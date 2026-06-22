import { formatPrivateService } from '@/database/format/Service';
import { getOrganizationById } from '@/database/Organization';
import { getOrganizationMemberByFilter } from '@/database/OrganizationMembers';
import { getOrganizationPermissionById } from '@/database/OrganizationPermission';
import { countServicesByFilter, createServices, getServicesByFilterToOrganization } from '@/database/Service';
import { getServiceCategoryById } from '@/database/ServiceCategories';
import { getUserById } from '@/database/User';
import { decrypt } from '@/lib/session';
import { CreateServiceSchema } from '@/schema/ServiceShema';
import { CreateOrUpdateServiceType } from '@/types/Service';
import { getDateParams } from '@/utils/date';
import { errorHandler, ERRORS_DETAILS } from '@/utils/errors';
import { generatePaginationResponse, getPaginationParams } from '@/utils/pagination';
import { parseBody } from '@/utils/parsing';
import { getSortingParams } from '@/utils/sorting';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
	req: NextRequest,
	{ params }: { params: Promise<{ org_id: string }> }
): Promise<NextResponse> {
	return errorHandler(async () => {
		const { org_id } = await params;
		const searchParams = req.nextUrl.searchParams;
		const cookie = req.cookies.get('session');
		const user_id = (await decrypt(cookie?.value)).user_id;
		const user = await getUserById(user_id, {});
		const organization = await getOrganizationById(org_id, {});

		if (user == null) throw ERRORS_DETAILS.account_does_not_exists();
		if (organization == null) throw ERRORS_DETAILS.organization_does_not_exist();

		if (user.admin == false && organization.owner_id != user_id) {
			const member = await getOrganizationMemberByFilter({ organization_id: org_id, user_id: user_id }, {});
			if (member == null) throw ERRORS_DETAILS.member_not_in_organization();
			if (member.approved == false || member.permission_id == null)
				throw ERRORS_DETAILS.member_not_in_organization();
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

		return NextResponse.json(generatePaginationResponse(value.map(formatPrivateService), count, pagination));
	});
}

export async function POST(
	req: NextRequest,
	{ params }: { params: Promise<{ org_id: string }> }
): Promise<NextResponse> {
	return errorHandler(async () => {
		const { org_id } = await params;
		const cookie = req.cookies.get('session');
		const user_id = (await decrypt(cookie?.value)).user_id;
		const user = await getUserById(user_id, {});
		const organization = await getOrganizationById(org_id, {});

		if (user == null) throw ERRORS_DETAILS.account_does_not_exists();
		if (organization == null) throw ERRORS_DETAILS.organization_does_not_exist();

		if (user.admin == false && organization.owner_id != user_id) {
			const member = await getOrganizationMemberByFilter({ organization_id: org_id, user_id: user_id }, {});
			if (member == null) throw ERRORS_DETAILS.member_not_in_organization();
			if (member.approved == false || member.permission_id == null)
				throw ERRORS_DETAILS.member_not_in_organization();

			const permission = await getOrganizationPermissionById(member.permission_id, member.organization_id, {});
			if (permission?.service_create == null) throw ERRORS_DETAILS.permission_denied();
		}

		const data = await parseBody<CreateOrUpdateServiceType>(req, CreateServiceSchema);
		const category = await getServiceCategoryById(data.category_id, {});
		if (category == null) throw ERRORS_DETAILS.category_does_not_exists();
		await createServices(data, org_id, {});

		return NextResponse.json({ success: true });
	});
}
