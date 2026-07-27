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

type Granularity = 'day' | 'week' | 'month';

interface DailyCumulativePoint {
	cumulative_data: number;
	update_at: string;
}

interface Range {
	start: Date;
	end: Date;
}

interface EventRow {
	id: string;
	title: string;
	start_at: string;
	registered: number;
	max_registration: number | null;
	fill_rate: number | null;
}

interface GrowthStat {
	absolute: number;
	percent: number;
}

interface SeriesStat {
	cumulative: number[];
	delta: number[];
}

interface PeriodMeta {
	from: string;
	to: string;
	granularity: Granularity;
}

interface PeakStat {
	peak_label: string | null;
	peak_value: number;
}

function pickGranularity(diffDays: number): Granularity {
	if (diffDays <= 31) return 'day';
	if (diffDays <= 90) return 'week';
	return 'month';
}

function generateLabelsAndRanges(
	from: Date,
	to: Date
): {
	labels: string[];
	ranges: Range[];
	granularity: Granularity;
} {
	const diffMs = to.getTime() - from.getTime();
	const diffDays = diffMs / (1000 * 60 * 60 * 24);
	const stepUnit = pickGranularity(diffDays);

	const labels: string[] = [];
	const ranges: Range[] = [];
	const current = new Date(from);

	while (current <= to) {
		const start = new Date(current);
		const end = new Date(current);

		if (stepUnit === 'day') {
			end.setDate(end.getDate() + 1);
			labels.push(start.toISOString());
			current.setDate(current.getDate() + 1);
		} else if (stepUnit === 'week') {
			end.setDate(end.getDate() + 7);
			labels.push(start.toISOString());
			current.setDate(current.getDate() + 7);
		} else {
			end.setMonth(end.getMonth() + 1);
			labels.push(start.toISOString());
			current.setMonth(current.getMonth() + 1);
		}

		ranges.push({ start, end });
	}

	return { labels, ranges, granularity: stepUnit };
}

function cumulativeToDelta(cumulative: number[]): number[] {
	return cumulative.map((value, index) => (index === 0 ? value : value - cumulative[index - 1]));
}

function bucketizeCumulative(dailyData: DailyCumulativePoint[], ranges: Range[]): SeriesStat {
	let lastCumulative = 0;
	const cumulative = ranges.map(({ start, end }) => {
		const itemsInRange = dailyData.filter((item) => {
			const itemDate = new Date(item.update_at);
			return itemDate >= start && itemDate < end;
		});

		if (itemsInRange.length > 0) {
			lastCumulative = itemsInRange[itemsInRange.length - 1].cumulative_data;
		}

		return lastCumulative;
	});

	return { cumulative, delta: cumulativeToDelta(cumulative) };
}

function safeRatio(numerator: number, denominator: number): number {
	return denominator > 0 ? numerator / denominator : 0;
}

function growthFromCumulative(cumulative: number[]): GrowthStat {
	if (cumulative.length === 0) return { absolute: 0, percent: 0 };
	const first = cumulative[0];
	const last = cumulative[cumulative.length - 1];
	const absolute = last - first;
	const percent = first === 0 ? 0 : (absolute / first) * 100;
	return { absolute, percent };
}

function growthFromCounts(first: number, last: number): GrowthStat {
	const absolute = last - first;
	const percent = first === 0 ? 0 : (absolute / first) * 100;
	return { absolute, percent };
}

function peakFromSeries(labels: string[], delta: number[]): PeakStat {
	if (delta.length === 0) return { peak_label: null, peak_value: 0 };
	let peakIndex = 0;
	for (let i = 1; i < delta.length; i++) {
		if (delta[i] > delta[peakIndex]) peakIndex = i;
	}
	return { peak_label: labels[peakIndex] ?? null, peak_value: delta[peakIndex] };
}

function formatEventRow(
	row: ReturnType<typeof formatPrivateEvent<{ event_registration: true; organization: true }>>
): EventRow {
	return {
		id: row.id,
		title: row.title,
		start_at: row.start_at,
		registered: row.register_number,
		max_registration: row.max_registration,
		fill_rate: row.max_registration == null ? null : safeRatio(row.register_number, row.max_registration),
	};
}

function growthFromEventsWithinPeriod(events: EventRow[]): GrowthStat {
	const registeredSorted = [...events].sort((a, b) => a.start_at.localeCompare(b.start_at));
	const runningTotal: number[] = [];
	let acc = 0;
	for (const event of registeredSorted) {
		acc += event.registered;
		runningTotal.push(acc);
	}
	return growthFromCumulative(runningTotal);
}

function mapElasticSearchCumulative(
	response: Awaited<ReturnType<typeof getDashBoardViewsByElasticSearch>>
): DailyCumulativePoint[] {
	return (response?.aggregations?.views_over_time.buckets ?? [])
		.map((hit) => ({
			cumulative_data: hit.cumulative_views?.value ?? 0,
			update_at: hit.key_as_string,
		}))
		.filter((row): row is DailyCumulativePoint => row.cumulative_data !== undefined && row.update_at !== undefined);
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

		if (!user) throw ERRORS_DETAILS.does_not_exists('Ce compte');
		if (!organization || !organization.verified) throw ERRORS_DETAILS.does_not_exists('Cette organisation');

		if (!user.admin && organization.owner_id != user.id) {
			await getUserOrganizationPermission(user, org_id, true);
		}

		const date = parseParams<DateOption>(req.nextUrl.searchParams, DateDashBoardParamSchema);

		const elasticSearchFollowers = mapElasticSearchCumulative(await getDashBoardFollowersByElasticSearch(org_id));
		const elasticSearchViews = mapElasticSearchCumulative(await getDashBoardViewsByElasticSearch(org_id));

		const events = await getEventsDashBoard(
			{ organization_id: org_id },
			{ event_registration: true, organization: true }
		);
		const listEvents = events.map(formatPrivateEvent<{ event_registration: true; organization: true }>);
		const dataEvents = listEvents.map(formatEventRow);

		let labels: string[] = [];
		let granularity: Granularity = 'day';
		let seriesViews: SeriesStat = { cumulative: [], delta: [] };
		let seriesFollowers: SeriesStat = { cumulative: [], delta: [] };
		let filteredEvents: EventRow[] = [];
		let periodFrom: string;
		let periodTo: string;

		if (date.from != null && date.to != null) {
			const fromDate = new Date(date.from);
			const toDate = new Date(date.to);
			periodFrom = fromDate.toISOString();
			periodTo = toDate.toISOString();

			const {
				labels: generatedLabels,
				ranges,
				granularity: generatedGranularity,
			} = generateLabelsAndRanges(fromDate, toDate);
			labels = generatedLabels;
			granularity = generatedGranularity;

			const listGraphViews = elasticSearchViews.filter(
				(item) => item.update_at <= date.to! && item.update_at >= date.from!
			);
			const listGraphFollowers = elasticSearchFollowers.filter(
				(item) => item.update_at <= date.to! && item.update_at >= date.from!
			);

			seriesViews = bucketizeCumulative(listGraphViews, ranges);
			seriesFollowers = bucketizeCumulative(listGraphFollowers, ranges);
			filteredEvents = dataEvents.filter((item) => item.start_at <= date.to! && item.start_at >= date.from!);
		} else {
			const allDates = [...elasticSearchViews, ...elasticSearchFollowers].map((d) => new Date(d.update_at));
			const minDate = allDates.length > 0 ? new Date(Math.min(...allDates.map((d) => d.getTime()))) : new Date();
			const maxDate = allDates.length > 0 ? new Date(Math.max(...allDates.map((d) => d.getTime()))) : new Date();
			periodFrom = minDate.toISOString();
			periodTo = maxDate.toISOString();

			const {
				labels: generatedLabels,
				ranges,
				granularity: generatedGranularity,
			} = generateLabelsAndRanges(minDate, maxDate);
			labels = generatedLabels;
			granularity = generatedGranularity;

			seriesViews = bucketizeCumulative(elasticSearchViews, ranges);
			seriesFollowers = bucketizeCumulative(elasticSearchFollowers, ranges);
			filteredEvents = dataEvents;
		}

		const totalViews = seriesViews.cumulative[seriesViews.cumulative.length - 1] ?? 0;
		const totalFollowers = seriesFollowers.cumulative[seriesFollowers.cumulative.length - 1] ?? 0;
		const totalRegistrations = filteredEvents.reduce((accumulator, event) => accumulator + event.registered, 0);
		const totalCapacity = filteredEvents.reduce(
			(accumulator, event) => accumulator + (event.max_registration == null ? 0 : event.max_registration),
			0
		);
		const eventsCount = filteredEvents.length;

		return NextResponse.json({
			period: {
				from: periodFrom,
				to: periodTo,
				granularity,
			} satisfies PeriodMeta,
			series: {
				labels,
				views: seriesViews,
				followers: seriesFollowers,
				events: filteredEvents,
			},
			totals: {
				views: totalViews,
				followers: totalFollowers,
				registrations: totalRegistrations,
				capacity: totalCapacity,
				events_count: eventsCount,
			},
			growth: {
				views: growthFromCumulative(seriesViews.cumulative),
				followers: growthFromCumulative(seriesFollowers.cumulative),
				registrations: growthFromEventsWithinPeriod(filteredEvents),
				events: growthFromCounts(0, eventsCount),
			},
			highlights: {
				views: peakFromSeries(labels, seriesViews.delta),
				followers: peakFromSeries(labels, seriesFollowers.delta),
			},
			ratios: {
				followerToViewRate: safeRatio(totalFollowers, totalViews),
				registrationFillRate: safeRatio(totalRegistrations, totalCapacity),
			},
		});
	});
}
