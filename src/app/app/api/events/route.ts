import { countEventsByFilter, getEventsByFilter } from '@/database/Event';
import { formatPublicEvent } from '@/database/format/Event';
import { errorHandler } from '@/utils/errors';
import { generatePaginationResponse, getPaginationParams } from '@/utils/pagination';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest): Promise<NextResponse> {
	return errorHandler(async () => {
		const searchParams = req.nextUrl.searchParams;

		const pagination = getPaginationParams(searchParams);

		const count = await countEventsByFilter();
		const value = await getEventsByFilter({}, pagination);

		return NextResponse.json(generatePaginationResponse(value.map(formatPublicEvent<object>), count, pagination));
	});
}
