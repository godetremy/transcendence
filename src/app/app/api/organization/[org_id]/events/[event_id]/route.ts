import { deleteEventById, getEventByIdToOrganization, UpdateEvent } from '@/database/Event';
import { formatPrivateEvent } from '@/database/format/Event';
import { getOrganizationById } from '@/database/Organization';
import { getUserFromSession } from '@/database/User';
import { getThrowableSession } from '@/lib/session';
import { CreateEventSchema } from '@/schema/EventSchema';
import { CreateOrUpdateEventType } from '@/types/Event';
import { errorHandler, ERRORS_DETAILS } from '@/utils/errors';
import { parseBody } from '@/utils/parsing';
import { getUserOrganizationPermission } from '@/utils/permission';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
	req: NextRequest,
	{ params }: { params: Promise<{ org_id: string; event_id: string }> }
): Promise<NextResponse> {
	return errorHandler(async () => {
		const { event_id, org_id } = await params;

		const session = await getThrowableSession(req);
		const user = await getUserFromSession(session, {});
		const organization = await getOrganizationById(org_id, {});

		if (!user) throw ERRORS_DETAILS.account_does_not_exists();
		if (!organization) throw ERRORS_DETAILS.organization_does_not_exist();

		if (user.admin == false && organization.owner_id != user.id) {
			await getUserOrganizationPermission(user, org_id);
		}

		const event_value = await getEventByIdToOrganization(event_id, org_id, {
			organization: true,
			event_registration: true,
			photos_album: true,
		});
		if (event_value === null) throw ERRORS_DETAILS.event_does_not_exists();

		return NextResponse.json(
			formatPrivateEvent<{ organization: true; event_registration: true; photos_album: true }>(event_value)
		);
	});
}

export async function PATCH(
	req: NextRequest,
	{ params }: { params: Promise<{ org_id: string; event_id: string }> }
): Promise<NextResponse> {
	return errorHandler(async () => {
		const { org_id, event_id } = await params;

		const session = await getThrowableSession(req);
		const user = await getUserFromSession(session, {});
		const organization = await getOrganizationById(org_id, {});

		if (!user) throw ERRORS_DETAILS.account_does_not_exists();
		if (!organization) throw ERRORS_DETAILS.organization_does_not_exist();

		if (user.admin == false && organization.owner_id != user.id) {
			const user_permission = await getUserOrganizationPermission(user, org_id);
			if (!user_permission.event_update) throw ERRORS_DETAILS.permission_denied();
		}

		const body = await parseBody<CreateOrUpdateEventType>(req, CreateEventSchema);

		const event_value = await UpdateEvent(body, event_id, {});
		if (event_value == null) throw ERRORS_DETAILS.event_does_not_exist();

		return NextResponse.json(formatPrivateEvent<object>(event_value));
	});
}

export async function DELETE(
	req: NextRequest,
	{ params }: { params: Promise<{ org_id: string; event_id: string }> }
): Promise<NextResponse> {
	return errorHandler(async () => {
		const { org_id, event_id } = await params;

		const session = await getThrowableSession(req);
		const user = await getUserFromSession(session, {});
		const organization = await getOrganizationById(org_id, {});

		if (!user) throw ERRORS_DETAILS.account_does_not_exists();
		if (!organization) throw ERRORS_DETAILS.organization_does_not_exist();

		if (user.admin == false && organization.owner_id != user.id) {
			const user_permission = await getUserOrganizationPermission(user, org_id);
			if (!user_permission.event_delete) throw ERRORS_DETAILS.permission_denied();
		}

		const value = await deleteEventById(event_id, org_id);

		return NextResponse.json(formatPrivateEvent<object>(value));
	});
}
