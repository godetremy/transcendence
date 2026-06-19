import { NextRequest, NextResponse } from 'next/server';
import { errorHandler, ERRORS_DETAILS } from '@/utils/errors';
import { deleteOrganization, getOrganizationById, updateOrganization } from '@/database/Organization';
import { formatPublicOrganization } from '@/database/format/Organization';
import { CreateOrganizationType } from '@/types/Organization';
import { CreateOrganizationSchema } from '@/schema/OrganizationSchema';
import { parseBody } from '@/utils/parsing';
import { decrypt } from '@/lib/session';
import { getUserById } from '@/database/User';

export async function GET(
	req: NextRequest,
	{ params }: { params: Promise<{ org_id: string }> }
): Promise<NextResponse> {
	return errorHandler(async () => {
		const { org_id } = await params;
		const org = await getOrganizationById(org_id, {});

		if (org == null) throw ERRORS_DETAILS.organization_does_not_exist();

		return NextResponse.json(formatPublicOrganization(org));
	});
}

export async function PATCH(
	req: NextRequest,
	{ params }: { params: Promise<{ org_id: string }> }
): Promise<NextResponse> {
	return errorHandler(async () => {
		const { org_id } = await params;
		const org = await getOrganizationById(org_id, {});

		if (org == null) throw ERRORS_DETAILS.organization_does_not_exist();

		const body = await parseBody<CreateOrganizationType>(req, CreateOrganizationSchema);

		//if (await organizationExistByName(body.name)) throw ERRORS_DETAILS.organization_already_exist();

		const cookie = req.cookies.get('session');
		const user_id = (await decrypt(cookie?.value)).user_id;
		const user = await getUserById(user_id, {});

		if (user == null) throw ERRORS_DETAILS.account_does_not_exists();
		if (org.owner_id != user_id && !user.admin) throw ERRORS_DETAILS.permission_denied();

		const value = await updateOrganization(body, org_id);

		return NextResponse.json(formatPublicOrganization(value));
	});
}

export async function DELETE(
	req: NextRequest,
	{ params }: { params: Promise<{ org_id: string }> }
): Promise<NextResponse> {
	return errorHandler(async () => {
		const { org_id } = await params;
		const org = await getOrganizationById(org_id, {});

		if (org == null) throw ERRORS_DETAILS.organization_does_not_exist();

		const cookie = req.cookies.get('session');
		const user_id = (await decrypt(cookie?.value)).user_id;
		const user = await getUserById(user_id, {});

		if (user == null) throw ERRORS_DETAILS.account_does_not_exists();
		if (org.owner_id != user_id && !user.admin) throw ERRORS_DETAILS.permission_denied();

		const value = await deleteOrganization(org_id);
		return NextResponse.json(formatPublicOrganization(value));
	});
}
