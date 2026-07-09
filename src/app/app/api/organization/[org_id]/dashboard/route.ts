import { getDashBoardFollowersByElasticSearch, getDashBoardViewsByElasticSearch } from '@/database/dashBoard';
import { getOrganizationById } from '@/database/Organization';
import { getUserFromSession } from '@/database/User';
import { getThrowableSession } from '@/lib/session';
import { DateDashBoardParamSchema } from '@/schema/DashBoardSchema';
import { DateOption } from '@/types/DateParameters';
import { errorHandler, ERRORS_DETAILS } from '@/utils/errors';
import { parseParams } from '@/utils/parsing';
import { getUserOrganizationPermission } from '@/utils/permission';
import { NextRequest, NextResponse } from 'next/server';

function generateLabelsAndRanges(from: Date, to: Date): { labels: string[]; ranges: { start: Date; end: Date }[] } {
	const diffMs = to.getTime() - from.getTime();
	const diffDays = diffMs / (1000 * 60 * 60 * 24);

	let stepUnit: 'day' | 'week' | 'month';

	if (diffDays <= 31) {
		stepUnit = 'day';
	} else if (diffDays <= 366) {
		stepUnit = 'week';
	} else {
		stepUnit = 'month';
	}

	const labels: string[] = [];
	const ranges: { start: Date; end: Date }[] = [];

	const current = new Date(from);

	while (current <= to) {
		const start = new Date(current);
		let end: Date;

		if (stepUnit === 'day') {
			end = new Date(current);
			end.setDate(end.getDate() + 1);
			labels.push(start.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' }));
			current.setDate(current.getDate() + 1);
		} else if (stepUnit === 'week') {
			end = new Date(current);
			end.setDate(end.getDate() + 7);
			labels.push(`Sem. ${start.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' })}`);
			current.setDate(current.getDate() + 7);
		} else {
			end = new Date(current);
			end.setMonth(end.getMonth() + 1);
			labels.push(start.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' }));
			current.setMonth(current.getMonth() + 1);
		}

		ranges.push({ start, end });
	}

	return { labels, ranges };
}

function bucketizeData(data: { data: number; update_at: string }[], ranges: { start: Date; end: Date }[]): number[] {
	let lastValue = 0;

	return ranges.map(({ start, end }) => {
		const itemsInRange = data.filter((item) => {
			const itemDate = new Date(item.update_at);
			return itemDate >= start && itemDate < end;
		});

		if (itemsInRange.length > 0) {
			lastValue = itemsInRange[itemsInRange.length - 1].data;
		}

		return lastValue;
	});
}

export async function GET(
	req: NextRequest,
	{ params }: { params: Promise<{ org_id: string }> }
): Promise<NextResponse> {
	return errorHandler(async () => {
		const { org_id } = await params;
		const session = await getThrowableSession(req);
		const user = await getUserFromSession(session, {});
		const organization = await getOrganizationById(org_id, {});

		if (!user) throw ERRORS_DETAILS.account_does_not_exists();
		if (!organization || organization.verified == false) throw ERRORS_DETAILS.organization_does_not_exist();

		if (user.admin == false && organization.owner_id != user.id) {
			await getUserOrganizationPermission(user, org_id, true);
		}

		const date = parseParams<DateOption>(req.nextUrl.searchParams, DateDashBoardParamSchema);

		const followers = await getDashBoardFollowersByElasticSearch(org_id);
		const elasticSearchFollowers = (followers.aggregations?.views_over_time.buckets ?? [])
			.map((hit) => ({
				data: hit.cumulative_views?.value,
				update_at: hit.key_as_string,
			}))
			.filter(
				(row): row is { data: number; update_at: string } =>
					row.data !== undefined && row.update_at !== undefined
			);

		const views = await getDashBoardViewsByElasticSearch(org_id);
		const elasticSearchViews = (views.aggregations?.views_over_time.buckets ?? [])
			.map((hit) => ({
				data: hit.cumulative_views?.value,
				update_at: hit.key_as_string,
			}))
			.filter(
				(row): row is { data: number; update_at: string } =>
					row.data !== undefined && row.update_at !== undefined
			)!;

		let filteredCountsViews: number[] = [];
		let filteredCountsFollowers: number[] = [];
		let labels: string[] = [];

		if (date.from != null && date.to != null) {
			const fromDate = new Date(date.from);
			const toDate = new Date(date.to);

			const { labels: generatedLabels, ranges } = generateLabelsAndRanges(fromDate, toDate);
			labels = generatedLabels;

			const listGraphViews = elasticSearchViews.filter(
				(item) => item.update_at <= date.to! && item.update_at >= date.from!
			);
			const listGraphFollowers = elasticSearchFollowers.filter(
				(item) => item.update_at <= date.to! && item.update_at >= date.from!
			);

			filteredCountsViews = bucketizeData(listGraphViews, ranges);
			filteredCountsFollowers = bucketizeData(listGraphFollowers, ranges);
		} else {
			const allDates = [...elasticSearchViews, ...elasticSearchFollowers].map((d) => new Date(d.update_at));
			const minDate = allDates.length > 0 ? new Date(Math.min(...allDates.map((d) => d.getTime()))) : new Date();
			const maxDate = allDates.length > 0 ? new Date(Math.max(...allDates.map((d) => d.getTime()))) : new Date();

			const { labels: generatedLabels, ranges } = generateLabelsAndRanges(minDate, maxDate);
			labels = generatedLabels;

			filteredCountsViews = bucketizeData(elasticSearchViews, ranges);
			filteredCountsFollowers = bucketizeData(elasticSearchFollowers, ranges);
		}

		return NextResponse.json({
			area: {
				labels,
				list: [
					{
						label: 'Followers',
						data: filteredCountsFollowers,
					},
					{
						label: 'Vues',
						data: filteredCountsViews,
					},
				],
			},
		});
	});
}
