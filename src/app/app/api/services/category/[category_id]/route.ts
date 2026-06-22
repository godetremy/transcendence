import { formatPublicService } from '@/database/format/Service';
import { countServicesByFilter, getServicesByCategory } from '@/database/Service';
import { getServiceCategoryById } from '@/database/ServiceCategories';
import { errorHandler, ERRORS_DETAILS } from '@/utils/errors';
import { generatePaginationResponse, getPaginationParams } from '@/utils/pagination';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
	req: NextRequest,
	{ params }: { params: Promise<{ category_id: string }> }
): Promise<NextResponse> {
	return errorHandler(async () => {
		const { category_id } = await params;
		const pagination = getPaginationParams(req.nextUrl.searchParams);

		const category = await getServiceCategoryById(category_id, {});
		if (category == null) throw ERRORS_DETAILS.category_does_not_exists();

		const count = await countServicesByFilter({ category_id: category_id });
		const lists = await getServicesByCategory({ organization: true, category: true }, category_id, pagination);

		return NextResponse.json(generatePaginationResponse(lists.map(formatPublicService), count, pagination));
	});
}	