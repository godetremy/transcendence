import { getEventById } from '@/database/Event';
import { formatPublicEvent } from '@/database/format/Event';
import { createViewElasticSearch } from '@/database/prisma/elasticSearch';
import {
	countEventRegistrationsByFilter,
	createEventRegistrationsById,
	deleteEventRegistrationsById,
	getEventRegistrationsById,
} from '@/database/RegisteredEvent';
import { getUserFromSession } from '@/database/User';
import { decrypt, getThrowableSession } from '@/lib/session';
import { errorHandler, ERRORS_DETAILS } from '@/utils/errors';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
	req: NextRequest,
	{ params }: { params: Promise<{ event_id: string }> }
): Promise<NextResponse> {
	return errorHandler(async () => {
		const { event_id } = await params;

		const session = await getThrowableSession(req);
		const user = await getUserFromSession(session, {});
		if (!user) throw ERRORS_DETAILS.does_not_exists('Ce compte');

		const event_value = await getEventById(event_id, { organization: true });
		if (event_value === null) throw ERRORS_DETAILS.does_not_exists('Cet événement');

		createViewElasticSearch(event_value.organization_id, event_id);

		const registered = await getEventRegistrationsById(event_id, user.id, {});

		return NextResponse.json({
			...formatPublicEvent<{ organization: true }>(event_value),
			registered,
		});
	});
}

export async function PUT(
	req: NextRequest,
	{ params }: { params: Promise<{ event_id: string }> }
): Promise<NextResponse> {
	return errorHandler(async () => {
		const { event_id } = await params;
		const session = await getThrowableSession(req);

		const event = await getEventById(event_id, {});
		if (event == null) throw ERRORS_DETAILS.does_not_exists('Cet événement');

		const registered = await getEventRegistrationsById(event_id, session.user_id, {});

		if (registered == false) {
			const count = await countEventRegistrationsByFilter({ event_id: event_id });
			if (event.max_registration != null && count >= event.max_registration)
				throw ERRORS_DETAILS.event_max_inscription();

			const value = await createEventRegistrationsById(event_id, session.user_id, {});
			if (value == null) throw ERRORS_DETAILS.does_not_exists('Cet événement');
		} else {
			const value = await deleteEventRegistrationsById(event_id, session.user_id, {});
			if (value == null) throw ERRORS_DETAILS.does_not_exists('Cet événement');
		}

		return NextResponse.json({ success: true });
	});
}
