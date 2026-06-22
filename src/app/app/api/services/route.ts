import { formatPublicService } from '@/database/format/Service';
import { countServicesByFilter, getServicesByFilter } from '@/database/Service';
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

		const count = await countServicesByFilter();
		const value = await getServicesByFilter({ organization: true, category: true }, date, sorting, pagination);

		return NextResponse.json(generatePaginationResponse(value.map(formatPublicService), count, pagination));
	});
}
