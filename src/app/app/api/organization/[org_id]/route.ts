import { NextRequest, NextResponse } from 'next/server';
import { errorHandler, ERRORS_DETAILS } from '@/utils/errors';
import { deleteOrganization, getOrganizationById, updateOrganization } from '@/database/Organization';
import { formatPrivateOrganization, formatPublicOrganization } from '@/database/format/Organization';
import { CreateOrganizationType } from '@/types/Organization';
import { CreateOrganizationSchema } from '@/schema/OrganizationSchema';
import { parseBody } from '@/utils/parsing';
import { getThrowableSession } from '@/lib/session';
import { getUserFromSession } from '@/database/User';
import { getUserOrganizationPermission } from '@/utils/permission';

export async function GET(
	req: NextRequest,
	{ params }: { params: Promise<{ org_id: string }> }
): Promise<NextResponse> {
	return errorHandler(async () => {
		const { org_id } = await params;

		const org = await getOrganizationById(org_id, {});
		if (!org) throw ERRORS_DETAILS.does_not_exists('Cette organisation');

		const session = await getThrowableSession(req);
		const user = await getUserFromSession(session, {});
		if (!user) throw ERRORS_DETAILS.does_not_exists('Ce compte');

		const isMemberOrOwner = user.admin || org.owner_id === user.id;
		const formatter = isMemberOrOwner ? formatPrivateOrganization : formatPublicOrganization;
		return NextResponse.json(formatter<object>(org));
	});
}

export async function PATCH(
	req: NextRequest,
	{ params }: { params: Promise<{ org_id: string }> }
): Promise<NextResponse> {
	return errorHandler(async () => {
		const { org_id } = await params;

		const session = await getThrowableSession(req);
		const user = await getUserFromSession(session, {});
		if (!user) throw ERRORS_DETAILS.does_not_exists('Ce compte');

		const org = await getOrganizationById(org_id, {});
		if (!org) throw ERRORS_DETAILS.does_not_exists('Cette organisation');

		const body = await parseBody<CreateOrganizationType>(req, CreateOrganizationSchema);

		const user_permission = await getUserOrganizationPermission(user, org_id, true);
		if (!user_permission.organization_update_info) throw ERRORS_DETAILS.permission_denied();

		const value = await updateOrganization(body, org_id);

		return NextResponse.json(formatPrivateOrganization<object>(value));
	});
}

export async function DELETE(
	req: NextRequest,
	{ params }: { params: Promise<{ org_id: string }> }
): Promise<NextResponse> {
	return errorHandler(async () => {
		const { org_id } = await params;
		const org = await getOrganizationById(org_id, {});

		if (!org) throw ERRORS_DETAILS.does_not_exists('Cette organisation');

		const session = await getThrowableSession(req);
		const user = await getUserFromSession(session, {});

		if (!user) throw ERRORS_DETAILS.does_not_exists('Ce compte');
		if (org.owner_id != user.id && !user.admin) throw ERRORS_DETAILS.permission_denied();

		const value = await deleteOrganization(org_id);
		return NextResponse.json(formatPublicOrganization<object>(value));
	});
}
