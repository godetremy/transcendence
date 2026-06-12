import { getEventById } from '@/database/Event';
import { registered_eventWhereUniqueInput } from '@/database/prisma/generated/models';
import { countRegisteredEventsByFilter, createRegisteredEventById, deleteRegisteredEventById, getRegisteredEventById } from '@/database/RegisteredEvent';
import { decrypt } from '@/lib/session';
import { RegisteredEventParamSchema } from '@/schema/RegisteredEventSchema';
import { RegisteredEventParam } from '@/types/RegisteredEvent';
import { apiError, ERRORS_DETAILS, serverError } from '@/utils/errors';
import { parseBody } from '@/utils/parsing';
import { NextRequest, NextResponse } from 'next/server';

export async function PATCH(
	req: NextRequest,
	{ params }: { params: Promise<{ event_id: string }> }
): Promise<NextResponse> {
	try {
		const { event_id } = await params;
		const body = await parseBody<RegisteredEventParam>(req, RegisteredEventParamSchema);

		const cookie = req.cookies.get('session');
		const user_id = (await decrypt(cookie?.value)).user_id;
		
		const event = await getEventById(event_id, {registered: true});
		if (event == null) throw (ERRORS_DETAILS.event_does_not_exists());
		
		const registered = await getRegisteredEventById(event_id, user_id, { event: true});
		
		if (body.register == true)
		{
			if (registered != null) throw (ERRORS_DETAILS.event_does_not_register());
			
			const count = await countRegisteredEventsByFilter({ registered_event_id: event_id });
			if (count >= event.max_inscription) throw (ERRORS_DETAILS.event_max_inscription());

			const value = await createRegisteredEventById(event_id, user_id, {});
			if (value == null) throw (ERRORS_DETAILS.event_does_not_exists());
		}
		else
		{
			if (registered == null) throw (ERRORS_DETAILS.event_does_not_register());
			
			const db_filter: registered_eventWhereUniqueInput = {
				user_id: user_id,
				registered_event_id: event_id,
			};
			
			const value = await deleteRegisteredEventById(db_filter, {});
			if (value == null) throw (ERRORS_DETAILS.event_does_not_exists());
		}


		return NextResponse.json({ success: true });
	} catch (err: unknown) {
		if (typeof err === 'string') return apiError(err, 400);
		return serverError(err);
	}
}
