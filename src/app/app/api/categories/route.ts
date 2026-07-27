import { NextRequest, NextResponse } from 'next/server';
import { errorHandler, ERRORS_DETAILS } from '@/utils/errors';
import { getThrowableSession } from '@/lib/session';
import { getUserFromSession } from '@/database/User';
import { checkIsUserGlobalAdmin } from '@/utils/permission';
import { parseBody } from '@/utils/parsing';
import { CategoryCreateBodyShema } from '@/schema/CategoryCreateBodyShema';
import { CategoryCreateBody } from '@/types/CategoryCreateBody';
import {
	countServiceCategoriesByFilter,
	createServiceCategory,
	getServiceCategoriesByFilter,
} from '@/database/ServiceCategories';
import { formatServiceCategory } from '@/database/format/ServiceCategories';
import { generatePaginationResponse, getPaginationParams } from '@/utils/pagination';

export function GET(req: NextRequest) {
	return errorHandler(async () => {
		const pagination = getPaginationParams(req.nextUrl.searchParams);

		const total = await countServiceCategoriesByFilter({});
		const categories = await getServiceCategoriesByFilter({}, {}, pagination);

		const list = categories.map((category) => formatServiceCategory(category));

		return NextResponse.json(generatePaginationResponse(list, total, pagination));
	});
}

export function POST(req: NextRequest) {
	return errorHandler(async () => {
		const session = await getThrowableSession(req);
		const user = await getUserFromSession(session, {});
		if (!user) throw ERRORS_DETAILS.does_not_exists('Cet utilisateur');
		checkIsUserGlobalAdmin(user);

		const body = await parseBody<CategoryCreateBody>(req, CategoryCreateBodyShema);
		const category = await createServiceCategory(body);

		return NextResponse.json(formatServiceCategory(category));
	});
}
