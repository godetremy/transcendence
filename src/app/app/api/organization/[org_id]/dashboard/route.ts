import { getDashBoardFollowersByElasticSearch, getDashBoardViewsByElasticSearch } from '@/database/dashBoard';
import { getEventsDashBoard } from '@/database/Event';
import { formatPrivateEvent } from '@/database/format/Event';
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

function bucketizeData(
	data: { cumulative_data: number; update_at: string }[],
	ranges: { start: Date; end: Date }[]
): number[] {
	let lastValue_cumulative = 0;

	return ranges.map(({ start, end }) => {
		const itemsInRange = data.filter((item) => {
			const itemDate = new Date(item.update_at);
			return itemDate >= start && itemDate < end;
		});

		if (itemsInRange.length > 0) {
			lastValue_cumulative = itemsInRange[itemsInRange.length - 1].cumulative_data;
		}

		return lastValue_cumulative;
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
		const elasticSearchFollowers = (followers?.aggregations?.views_over_time.buckets ?? [])
			.map((hit) => ({
				cumulative_data: hit.cumulative_views?.value,
				update_at: hit.key_as_string,
			}))
			.filter(
				(row): row is { cumulative_data: number; data: number; update_at: string } =>
					row.cumulative_data !== undefined && row.update_at !== undefined
			);

		const views = await getDashBoardViewsByElasticSearch(org_id);
		const elasticSearchViews = (views?.aggregations?.views_over_time.buckets ?? [])
			.map((hit) => ({
				cumulative_data: hit.cumulative_views?.value,
				update_at: hit.key_as_string,
			}))
			.filter(
				(row): row is { cumulative_data: number; update_at: string } =>
					row.cumulative_data !== undefined && row.update_at !== undefined
			);

		const events = await getEventsDashBoard({ organization_id: org_id }, { event_registration: true });
		const listEvents = events.map(formatPrivateEvent<{ event_registration: true }>);
		const dataEvents = listEvents.map((row) => ({
			numberRegister: row.register_number,
			maxRegister: row.max_registration,
			update_at: row.created_at,
		}));

		let filteredCountsViews: number[] = [];
		let filteredCountsFollowers: number[] = [];
		let labels: string[] = [];

		let filteredEvents: {
			numberRegister: never;
			maxRegister: number | null;
			update_at: string;
		}[] = [];

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
			filteredEvents = dataEvents.filter((item) => item.update_at <= date.to! && item.update_at >= date.from!);
		} else {
			const allDates = [...elasticSearchViews, ...elasticSearchFollowers].map((d) => new Date(d.update_at));
			const minDate = allDates.length > 0 ? new Date(Math.min(...allDates.map((d) => d.getTime()))) : new Date();
			const maxDate = allDates.length > 0 ? new Date(Math.max(...allDates.map((d) => d.getTime()))) : new Date();

			const { labels: generatedLabels, ranges } = generateLabelsAndRanges(minDate, maxDate);
			labels = generatedLabels;

			filteredCountsViews = bucketizeData(elasticSearchViews, ranges);
			filteredCountsFollowers = bucketizeData(elasticSearchFollowers, ranges);
			filteredEvents = dataEvents;
		}

		const totalRegistered = filteredEvents.reduce(
			(accumulator, currentValue) => accumulator + currentValue.numberRegister,
			0
		);
		const totalPlaceRegister = filteredEvents.reduce(
			(accumulator, currentValue) =>
				accumulator + (currentValue.maxRegister == null ? 0 : currentValue.maxRegister),
			0
		);
		const ratioViews =
			((filteredCountsViews[filteredCountsViews.length - 1] - filteredCountsViews[0]) * 100) /
			(filteredCountsViews[filteredCountsViews.length - 1] -
				filteredCountsViews[0] +
				(filteredCountsFollowers[filteredCountsFollowers.length - 1] - filteredCountsFollowers[0]));
		const ratioPlaceRegister = (totalPlaceRegister * 100) / (totalPlaceRegister + totalRegistered);
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
			doughnut: {
				followers: {
					labels: ['Followers', 'Vues'],
					list: [
						{
							label: 'Vues/Followers',
							data: [100 - Number(ratioViews.toPrecision(3)), Number(ratioViews.toPrecision(3))],
						},
					],
				},
				register: {
					labels: ['inscrit', 'pas-inscrit'],
					list: [
						{
							label: 'inscrit/pas-inscrit',
							data: [
								100 - Number(ratioPlaceRegister.toPrecision(3)),
								Number(ratioPlaceRegister.toPrecision(3)),
							],
						},
					],
				},
			},
			totalViews: filteredCountsViews[filteredCountsViews.length - 1],
			totalFollowers: filteredCountsFollowers[filteredCountsFollowers.length - 1],
			percentageViews:
				filteredCountsViews[0] == 0
					? filteredCountsViews[filteredCountsViews.length - 1]
					: filteredCountsViews[filteredCountsViews.length - 1] / filteredCountsViews[0],
			percentageFollowers:
				filteredCountsFollowers[0] == 0
					? filteredCountsFollowers[filteredCountsFollowers.length - 1]
					: filteredCountsFollowers[filteredCountsFollowers.length - 1] / filteredCountsFollowers[0],
		});
	});
}
