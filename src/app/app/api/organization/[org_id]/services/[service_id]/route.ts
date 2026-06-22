import { formatPrivateService } from '@/database/format/Service';
import { getOrganizationById } from '@/database/Organization';
import { getOrganizationMemberByFilter } from '@/database/OrganizationMembers';
import { getOrganizationPermissionById } from '@/database/OrganizationPermission';
import { deleteServicesById, getServicesByIdToOrganization, UpdateServices } from '@/database/Service';
import { getUserById } from '@/database/User';
import { decrypt } from '@/lib/session';
import { CreateServiceSchema } from '@/schema/ServiceShema';
import { CreateOrUpdateServiceType } from '@/types/Service';
import { errorHandler, ERRORS_DETAILS } from '@/utils/errors';
import { parseBody } from '@/utils/parsing';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
	req: NextRequest,
	{ params }: { params: Promise<{ org_id: string; service_id: string }> }
): Promise<NextResponse> {
	return errorHandler(async () => {
		const { service_id, org_id } = await params;

		const cookie = req.cookies.get('session');
		const user_id = (await decrypt(cookie?.value)).user_id;
		const user = await getUserById(user_id, {});
		const organization = await getOrganizationById(org_id, {});
		const service = await getServicesByIdToOrganization(service_id, org_id, {});

		if (user == null) throw ERRORS_DETAILS.account_does_not_exists();
		if (organization == null) throw ERRORS_DETAILS.organization_does_not_exist();
		if (service == null) throw ERRORS_DETAILS.service_does_not_exists();

		if (user.admin == false && organization.owner_id != user_id) {
			const member = await getOrganizationMemberByFilter({ organization_id: org_id, user_id: user_id }, {});
			if (member == null) throw ERRORS_DETAILS.member_not_in_organization();
			if (member.approved == false || member.permission_id == null)
				throw ERRORS_DETAILS.member_not_in_organization();
		}

		const service_value = await getServicesByIdToOrganization(service_id, org_id, { organization: true, category: true });
		if (service_value === null) throw ERRORS_DETAILS.service_does_not_exists();

		return NextResponse.json(
			formatPrivateService(service_value)
		);
	});
}

export async function PATCH(
	req: NextRequest,
	{ params }: { params: Promise<{ org_id: string; service_id: string }> }
): Promise<NextResponse> {
	return errorHandler(async () => {
		const { org_id, service_id } = await params;

		const cookie = req.cookies.get('session');
		const user_id = (await decrypt(cookie?.value)).user_id;
		const user = await getUserById(user_id, {});
		const organization = await getOrganizationById(org_id, {});
		const service = await getServicesByIdToOrganization(service_id, org_id, {});

		if (user == null) throw ERRORS_DETAILS.account_does_not_exists();
		if (organization == null) throw ERRORS_DETAILS.organization_does_not_exist();
		if (service == null) throw ERRORS_DETAILS.service_does_not_exists();

		if (user.admin == false && organization.owner_id != user_id) {
			const member = await getOrganizationMemberByFilter({ organization_id: org_id, user_id: user_id }, {});
			if (member == null) throw ERRORS_DETAILS.member_not_in_organization();
			if (member.approved == false || member.permission_id == null)
				throw ERRORS_DETAILS.member_not_in_organization();

			const permission = await getOrganizationPermissionById(member.permission_id, member.organization_id, {});
			if (permission?.service_update == null) throw ERRORS_DETAILS.permission_denied();
		}

		const body = await parseBody<CreateOrUpdateServiceType>(req, CreateServiceSchema);

		const service_value = await UpdateServices(body, service_id, { organization: true, category: true });
		if (service_value == null) throw ERRORS_DETAILS.service_does_not_exists();

		return NextResponse.json(formatPrivateService(service_value));
	});
}

export async function DELETE(
	req: NextRequest,
	{ params }: { params: Promise<{ org_id: string; service_id: string }> }
): Promise<NextResponse> {
	return errorHandler(async () => {
		const { org_id, service_id } = await params;

		const cookie = req.cookies.get('session');
		const user_id = (await decrypt(cookie?.value)).user_id;
		const user = await getUserById(user_id, {});
		const organization = await getOrganizationById(org_id, {});
		const service = await getServicesByIdToOrganization(service_id, org_id, {});

		if (user == null) throw ERRORS_DETAILS.account_does_not_exists();
		if (organization == null) throw ERRORS_DETAILS.organization_does_not_exist();
		if (service == null) throw ERRORS_DETAILS.service_does_not_exists();

		if (user.admin == false && organization.owner_id != user_id) {
			const member = await getOrganizationMemberByFilter({ organization_id: org_id, user_id: user_id }, {});
			if (member == null) throw ERRORS_DETAILS.member_not_in_organization();
			if (member.approved == false || member.permission_id == null)
				throw ERRORS_DETAILS.member_not_in_organization();

			const permission = await getOrganizationPermissionById(member.permission_id, member.organization_id, {});
			if (permission?.service_delete == null) throw ERRORS_DETAILS.permission_denied();
		}

		await deleteServicesById(service_id, org_id, {});

		return NextResponse.json({ success: true });
	});
}
