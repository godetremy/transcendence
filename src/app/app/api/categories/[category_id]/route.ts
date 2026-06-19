import { NextRequest, NextResponse } from 'next/server';
import { errorHandler, ERRORS_DETAILS } from '@/utils/errors';
import {
	deleteServiceCategoryById,
	existServiceCategoryById,
	getServiceCategoryById,
	updateServiceCategory,
} from '@/database/ServiceCategories';
import { formatServiceCategory } from '@/database/format/ServiceCategories';
import { getThrowableSession } from '@/lib/session';
import { getUserFromSession } from '@/database/User';
import { checkIsUserGlobalAdmin } from '@/utils/permission';
import { parseBody } from '@/utils/parsing';
import { CategoryUpdateBody } from '@/types/CategoryUpdateBody';
import { CategoryUpdateBodyShema } from '@/schema/CategoryUpdateBodyShema';

export function GET(req: NextRequest, { params }: { params: Promise<{ category_id: string }> }) {
	return errorHandler(async () => {
		const { category_id } = await params;

		const category = await getServiceCategoryById(category_id, {});
		if (!category) throw ERRORS_DETAILS.category_does_not_exists();

		return NextResponse.json(formatServiceCategory(category));
	});
}

export function PATCH(req: NextRequest, { params }: { params: Promise<{ category_id: string }> }) {
	return errorHandler(async () => {
		const { category_id } = await params;
		const session = await getThrowableSession(req);
		const user = await getUserFromSession(session, {});
		if (!user) throw ERRORS_DETAILS.account_not_found();
		checkIsUserGlobalAdmin(user);

		const body = await parseBody<CategoryUpdateBody>(req, CategoryUpdateBodyShema);

		if (!(await existServiceCategoryById(category_id))) throw ERRORS_DETAILS.category_does_not_exists();

		const category = await updateServiceCategory(category_id, body);

		return NextResponse.json(formatServiceCategory(category));
	});
}

export function DELETE(req: NextRequest, { params }: { params: Promise<{ category_id: string }> }) {
	return errorHandler(async () => {
		const { category_id } = await params;
		const session = await getThrowableSession(req);
		const user = await getUserFromSession(session, {});
		if (!user) throw ERRORS_DETAILS.account_not_found();
		checkIsUserGlobalAdmin(user);

		if (!(await existServiceCategoryById(category_id))) throw ERRORS_DETAILS.category_does_not_exists();
		await deleteServiceCategoryById(category_id);

		return NextResponse.json({ success: true });
	});
}
