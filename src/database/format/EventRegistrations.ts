import { Prisma } from '@/database/prisma/generated/client';
import { RegisteredEventPrivate } from '@/types/RegisteredEvent';

export function formatPrivateRegisteredEvent(
	row: Prisma.event_registrationsGetPayload<object>
): RegisteredEventPrivate {
	return {
		id: row.id,
		user_id: row.user_id,
		event_id: row.event_id,
		registered_at: row.registered_at,
	};
}
