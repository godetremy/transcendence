import { countEventsByFilter, getEventsByFilter } from '@/database/Event';
import { formatPublicEvent } from '@/database/format/Event';
import { getDateParams } from '@/utils/date';
import { errorHandler } from '@/utils/errors';
import { generatePaginationResponse, getPaginationParams } from '@/utils/pagination';
import { getSortingParams } from '@/utils/sorting';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest): Promise<NextResponse> {
	return errorHandler(async () => {
		const searchParams = req.nextUrl.searchParams;

		const date = getDateParams(searchParams);
		const sorting = getSortingParams(searchParams);
		const pagination = getPaginationParams(searchParams);

		const count = await countEventsByFilter();
		const value = await getEventsByFilter({ organization: true }, date, sorting, pagination);

		return NextResponse.json(generatePaginationResponse(value.map(formatPublicEvent), count, pagination));
	});
}
