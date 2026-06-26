import { formatPrivateService } from '@/database/format/Service';
import { getOrganizationById } from '@/database/Organization';
import { countServicesByFilter, createServices, getServicesByFilterToOrganization } from '@/database/Service';
import { getServiceCategoryById } from '@/database/ServiceCategories';
import { getUserFromSession } from '@/database/User';
import { getThrowableSession } from '@/lib/session';
import { CreateServiceSchema } from '@/schema/ServiceShema';
import { CreateOrUpdateServiceType } from '@/types/Service';
import { getDateParams } from '@/utils/date';
import { errorHandler, ERRORS_DETAILS } from '@/utils/errors';
import { generatePaginationResponse, getPaginationParams } from '@/utils/pagination';
import { parseBody } from '@/utils/parsing';
import { getUserOrganizationPermission } from '@/utils/permission';
import { getSortingParams } from '@/utils/sorting';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
	req: NextRequest,
	{ params }: { params: Promise<{ org_id: string }> }
): Promise<NextResponse> {
	return errorHandler(async () => {
		const { org_id } = await params;
		const searchParams = req.nextUrl.searchParams;
		const session = await getThrowableSession(req);
		const user = await getUserFromSession(session, {});
		const organization = await getOrganizationById(org_id, {});

		if (!user) throw ERRORS_DETAILS.account_does_not_exists();
		if (!organization) throw ERRORS_DETAILS.organization_does_not_exist();

		if (user.admin == false && organization.owner_id != user.id) {
			await getUserOrganizationPermission(user, org_id, true);
		}

		const date = getDateParams(searchParams);
		const sorting = getSortingParams(searchParams);
		const pagination = getPaginationParams(searchParams);

		const count = await countServicesByFilter();
		const value = await getServicesByFilterToOrganization(
			{ organization: true, category: true },
			org_id,
			date,
			sorting,
			pagination
		);

		return NextResponse.json(
			generatePaginationResponse(value.map(formatPrivateService<object>), count, pagination)
		);
	});
}

export async function POST(
	req: NextRequest,
	{ params }: { params: Promise<{ org_id: string }> }
): Promise<NextResponse> {
	return errorHandler(async () => {
		const { org_id } = await params;
		const session = await getThrowableSession(req);
		const user = await getUserFromSession(session, {});
		const organization = await getOrganizationById(org_id, {});

		if (!user) throw ERRORS_DETAILS.account_does_not_exists();
		if (!organization) throw ERRORS_DETAILS.organization_does_not_exist();

		const user_permission = await getUserOrganizationPermission(user, org_id, true);
		if (!user_permission.service_create) throw ERRORS_DETAILS.permission_denied();

		const data = await parseBody<CreateOrUpdateServiceType>(req, CreateServiceSchema);

		const category = await getServiceCategoryById(data.category_id, {});
		if (category == null) throw ERRORS_DETAILS.category_does_not_exists();

		await createServices(data, org_id, {});

		return NextResponse.json({ success: true });
	});
}
