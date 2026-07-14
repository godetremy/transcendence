import { countEventsByFilter, getEventsByFilter } from '@/database/Event';
import { formatPublicEvent } from '@/database/format/Event';
import { PublicEvent } from '@/types/Event';
import { errorHandler } from '@/utils/errors';
import { generatePaginationResponse, getPaginationParams } from '@/utils/pagination';
import { endOfWeek, endOfDay, endOfMonth, endOfYear } from 'date-fns';
import { NextRequest, NextResponse } from 'next/server';

export interface DateParse<T = object> {
	name: string;
	data: PublicEvent<T>[];
}

export async function GET(req: NextRequest): Promise<NextResponse> {
	return errorHandler(async () => {
		const searchParams = req.nextUrl.searchParams;

		const pagination = getPaginationParams(searchParams);

		const count = await countEventsByFilter();
		const value = await getEventsByFilter({ organization: true }, pagination);

		const today = new Date().toISOString();
		const endOfToday = endOfDay(new Date()).toISOString();
		const weekend = endOfWeek(new Date(), { weekStartsOn: 1 }).toISOString();
		const monthEnd = endOfMonth(new Date()).toISOString();
		const yearsEnd = endOfYear(new Date()).toISOString();

		const dateValue: DateParse[] = [];

		dateValue.push({
			name: "Aujourd'hui",
			data: value
				.filter((e) => e.start_at.toISOString() <= endOfToday && e.start_at.toISOString() >= today)
				.map(formatPublicEvent<object>),
		});
		dateValue.push({
			name: 'Cette semaine',
			data: value
				.filter((e) => e.start_at.toISOString() <= weekend && e.start_at.toISOString() >= endOfToday)
				.map(formatPublicEvent<object>),
		});
		dateValue.push({
			name: 'Ce mois',
			data: value
				.filter((e) => e.start_at.toISOString() <= monthEnd && e.start_at.toISOString() >= weekend)
				.map(formatPublicEvent<object>),
		});
		dateValue.push({
			name: 'Cette année',
			data: value
				.filter((e) => e.start_at.toISOString() <= yearsEnd && e.start_at.toISOString() >= monthEnd)
				.map(formatPublicEvent<object>),
		});
		dateValue.push({
			name: 'Les autres années',
			data: value.filter((e) => e.start_at.toISOString() >= yearsEnd).map(formatPublicEvent<object>),
		});

		console.log(dateValue);
		return NextResponse.json(generatePaginationResponse(dateValue, count, pagination));
	});
}
