import { countEventsByFilter, createEvent, getEventsByFilterToOrganization } from '@/database/Event';
import { formatPrivateEvent } from '@/database/format/Event';
import { getOrganizationById } from '@/database/Organization';
import { getUserFromSession } from '@/database/User';
import { getThrowableSession } from '@/lib/session';
import { CreateEventSchema } from '@/schema/EventSchema';
import { CreateOrUpdateEventType } from '@/types/Event';
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

		const count = await countEventsByFilter();
		const value = await getEventsByFilterToOrganization({ organization: true }, org_id, date, sorting, pagination);

		return NextResponse.json(
			generatePaginationResponse(
				value.map(
					formatPrivateEvent<{
						organization: true;
					}>
				),
				count,
				pagination
			)
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

		if (user.admin == false && organization.owner_id != user.id) {
			const user_permission = await getUserOrganizationPermission(user, org_id, true);
			if (!user_permission.event_create) throw ERRORS_DETAILS.permission_denied();
		}

		const data = await parseBody<CreateOrUpdateEventType>(req, CreateEventSchema);
		const event = await createEvent(data, org_id, user.full_name ?? '', {});

		return NextResponse.json(formatPrivateEvent<object>(event));
	});
}
