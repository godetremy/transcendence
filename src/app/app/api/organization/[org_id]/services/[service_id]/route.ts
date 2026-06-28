import { formatPrivateService } from '@/database/format/Service';
import { getOrganizationById } from '@/database/Organization';
import { deleteServicesById, getServicesByIdToOrganization, UpdateServices } from '@/database/Service';
import { getUserFromSession } from '@/database/User';
import { getThrowableSession } from '@/lib/session';
import { CreateServiceSchema } from '@/schema/ServiceShema';
import { CreateOrUpdateServiceType } from '@/types/Service';
import { errorHandler, ERRORS_DETAILS } from '@/utils/errors';
import { parseBody } from '@/utils/parsing';
import { getUserOrganizationPermission } from '@/utils/permission';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
	req: NextRequest,
	{ params }: { params: Promise<{ org_id: string; service_id: string }> }
): Promise<NextResponse> {
	return errorHandler(async () => {
		const { service_id, org_id } = await params;

		const session = await getThrowableSession(req);
		const user = await getUserFromSession(session, {});

		if (!user) throw ERRORS_DETAILS.account_does_not_exists();

		await getUserOrganizationPermission(user, org_id, true);

		const service_value = await getServicesByIdToOrganization(service_id, org_id, {
			organization: true,
			category: true,
		});
		if (service_value === null) throw ERRORS_DETAILS.service_does_not_exists();

		return NextResponse.json(formatPrivateService<object>(service_value));
	});
}

export async function PATCH(
	req: NextRequest,
	{ params }: { params: Promise<{ org_id: string; service_id: string }> }
): Promise<NextResponse> {
	return errorHandler(async () => {
		const { org_id, service_id } = await params;

		const session = await getThrowableSession(req);
		const user = await getUserFromSession(session, {});
		const organization = await getOrganizationById(org_id, {});
		const service = await getServicesByIdToOrganization(service_id, org_id, {});

		if (!user) throw ERRORS_DETAILS.account_does_not_exists();
		if (!organization) throw ERRORS_DETAILS.organization_does_not_exist();
		if (!service) throw ERRORS_DETAILS.service_does_not_exists();

		const user_permission = await getUserOrganizationPermission(user, org_id, true);
		if (!user_permission.service_update) throw ERRORS_DETAILS.permission_denied();

		const body = await parseBody<CreateOrUpdateServiceType>(req, CreateServiceSchema);

		const service_value = await UpdateServices(body, service_id, { organization: true, category: true });
		if (service_value == null) throw ERRORS_DETAILS.service_does_not_exists();

		return NextResponse.json(formatPrivateService<object>(service_value));
	});
}

export async function DELETE(
	req: NextRequest,
	{ params }: { params: Promise<{ org_id: string; service_id: string }> }
): Promise<NextResponse> {
	return errorHandler(async () => {
		const { org_id, service_id } = await params;

		const session = await getThrowableSession(req);
		const user = await getUserFromSession(session, {});
		const organization = await getOrganizationById(org_id, {});
		const service = await getServicesByIdToOrganization(service_id, org_id, {});

		if (!user) throw ERRORS_DETAILS.account_does_not_exists();
		if (!organization) throw ERRORS_DETAILS.organization_does_not_exist();
		if (!service) throw ERRORS_DETAILS.service_does_not_exists();

		const user_permission = await getUserOrganizationPermission(user, org_id, true);
		if (!user_permission.service_delete) throw ERRORS_DETAILS.permission_denied();

		await deleteServicesById(service_id, org_id, {});

		return NextResponse.json({ success: true });
	});
}
