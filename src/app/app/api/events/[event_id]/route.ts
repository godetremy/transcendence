import { getEventById } from '@/database/Event';
import { formatPublicEvent } from '@/database/format/Event';
import { createViewElasticSearch } from '@/database/prisma/elasticSearch';
import {
	countEventRegistrationsByFilter,
	createEventRegistrationsById,
	deleteEventRegistrationsById,
	getEventRegistrationsById,
} from '@/database/RegisteredEvent';
import { decrypt } from '@/lib/session';
import { RegisteredParamSchema } from '@/schema/RegisteredEventSchema';
import { RegisteredParam } from '@/types/RegisteredParameter';
import { errorHandler, ERRORS_DETAILS } from '@/utils/errors';
import { parseBody } from '@/utils/parsing';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
	req: NextRequest,
	{ params }: { params: Promise<{ event_id: string }> }
): Promise<NextResponse> {
	return errorHandler(async () => {
		const { event_id } = await params;

		const event_value = await getEventById(event_id, { organization: true });
		if (event_value === null) throw ERRORS_DETAILS.does_not_exists('Cet événement');

		createViewElasticSearch(event_value.organization_id, event_id);

		return NextResponse.json(formatPublicEvent<{ organization: true }>(event_value));
	});
}

export async function PUT(
	req: NextRequest,
	{ params }: { params: Promise<{ event_id: string }> }
): Promise<NextResponse> {
	return errorHandler(async () => {
		const { event_id } = await params;
		const body = await parseBody<RegisteredParam>(req, RegisteredParamSchema);

		const cookie = req.cookies.get('session');
		const user_id = (await decrypt(cookie?.value)).user_id;

		const event = await getEventById(event_id, {});
		if (event == null) throw ERRORS_DETAILS.does_not_exists('Cet événement');

		const registered = await getEventRegistrationsById(event_id, user_id, {});

		if (body.register == 'true') {
			if (registered != null) throw ERRORS_DETAILS.event_has_register();

			const count = await countEventRegistrationsByFilter({ event_id: event_id });
			if (event.max_registration != null && count >= event.max_registration)
				throw ERRORS_DETAILS.event_max_inscription();

			const value = await createEventRegistrationsById(event_id, user_id, {});
			if (value == null) throw ERRORS_DETAILS.does_not_exists('Cet événement');
		} else {
			if (registered == null) throw ERRORS_DETAILS.event_does_not_register();

			const value = await deleteEventRegistrationsById(event_id, user_id, {});
			if (value == null) throw ERRORS_DETAILS.does_not_exists('Cet événement');
		}

		return NextResponse.json({ success: true });
	});
}
