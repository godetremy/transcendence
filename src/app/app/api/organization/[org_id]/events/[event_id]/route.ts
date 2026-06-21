import { deleteEventById, getEventById, getEventByIdToOrganization, UpdateEvent } from '@/database/Event';
import { formatPrivateEvent } from '@/database/format/Event';
import { getOrganizationById } from '@/database/Organization';
import { getOrganizationMemberByFilter } from '@/database/OrganizationMembers';
import { getOrganizationPermissionById } from '@/database/OrganizationPermission';
import { getUserById } from '@/database/User';
import { decrypt } from '@/lib/session';
import { CreateEventSchema } from '@/schema/EventSchema';
import { CreateOrUpdateEventType } from '@/types/Event';
import { errorHandler, ERRORS_DETAILS } from '@/utils/errors';
import { parseBody } from '@/utils/parsing';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
	req: NextRequest,
	{ params }: { params: Promise<{ org_id: string; event_id: string }> }
): Promise<NextResponse> {
	return errorHandler(async () => {
		const { event_id, org_id } = await params;

		const cookie = req.cookies.get('session');
		const user_id = (await decrypt(cookie?.value)).user_id;
		const user = await getUserById(user_id, {});
		const organization = await getOrganizationById(org_id, {});
		const event = await getEventByIdToOrganization(event_id, org_id, {});

		if (user == null) throw ERRORS_DETAILS.account_does_not_exists();
		if (organization == null) throw ERRORS_DETAILS.organization_does_not_exist();
		if (event == null) throw ERRORS_DETAILS.event_does_not_exists();

		if (user.admin == false && organization.owner_id != user_id) {
			const member = await getOrganizationMemberByFilter({ organization_id: org_id, user_id: user_id }, {});
			if (member == null) throw ERRORS_DETAILS.member_not_in_organization();
			if (member.approved == false || member.permission_id == null)
				throw ERRORS_DETAILS.member_not_in_organization();
		}

		const event_value = await getEventByIdToOrganization(event_id, org_id, { organization: true });
		if (event_value === null) throw ERRORS_DETAILS.event_does_not_exists();

		return NextResponse.json(formatPrivateEvent(event_value));
	});
}

export async function PATCH(
	req: NextRequest,
	{ params }: { params: Promise<{ org_id: string; event_id: string }> }
): Promise<NextResponse> {
	return errorHandler(async () => {
		const { org_id, event_id } = await params;

		const cookie = req.cookies.get('session');
		const user_id = (await decrypt(cookie?.value)).user_id;
		const user = await getUserById(user_id, {});
		const organization = await getOrganizationById(org_id, {});

		if (user == null) throw ERRORS_DETAILS.account_does_not_exists();
		if (organization == null) throw ERRORS_DETAILS.organization_does_not_exist();
		if (event == null) throw ERRORS_DETAILS.event_does_not_exists();

		if (user.admin == false && organization.owner_id != user_id) {
			const member = await getOrganizationMemberByFilter({ organization_id: org_id, user_id: user_id }, {});
			if (member == null) throw ERRORS_DETAILS.member_not_in_organization();
			if (member.approved == false || member.permission_id == null)
				throw ERRORS_DETAILS.member_not_in_organization();

			const permission = await getOrganizationPermissionById(member.permission_id, member.organization_id, {});
			if (permission?.event_update == null) throw ERRORS_DETAILS.permission_denied();
		}

		const body = await parseBody<CreateOrUpdateEventType>(req, CreateEventSchema);

		const event_value = await UpdateEvent(body, event_id, { organization: true });
		if (event_value == null) throw ERRORS_DETAILS.event_does_not_exist();

		return NextResponse.json(formatPrivateEvent(event_value));
	});
}

export async function DELETE(
	req: NextRequest,
	{ params }: { params: Promise<{ org_id: string; event_id: string }> }
): Promise<NextResponse> {
	return errorHandler(async () => {
		const { org_id, event_id } = await params;

		const cookie = req.cookies.get('session');
		const user_id = (await decrypt(cookie?.value)).user_id;
		const user = await getUserById(user_id, {});
		const organization = await getOrganizationById(org_id, {});
		const event = await getEventByIdToOrganization(event_id, org_id, {});

		if (user == null) throw ERRORS_DETAILS.account_does_not_exists();
		if (organization == null) throw ERRORS_DETAILS.organization_does_not_exist();
		if (event == null) throw ERRORS_DETAILS.event_does_not_exists();

		if (user.admin == false && organization.owner_id != user_id) {
			const member = await getOrganizationMemberByFilter({ organization_id: org_id, user_id: user_id }, {});
			if (member == null) throw ERRORS_DETAILS.member_not_in_organization();
			if (member.approved == false || member.permission_id == null)
				throw ERRORS_DETAILS.member_not_in_organization();

			const permission = await getOrganizationPermissionById(member.permission_id, member.organization_id, {});
			if (permission?.event_delete == null) throw ERRORS_DETAILS.permission_denied();
		}

		await deleteEventById(event_id, org_id, {});

		return NextResponse.json({ success: true });
	});
}
