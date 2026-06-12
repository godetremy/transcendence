import { Prisma } from '@/database/prisma/generated/client';
import { RegisteredEventPublic } from '@/types/RegisteredEvent';

export function formatPublicRegisteredEvent(
	row: Prisma.registered_eventGetPayload<{}>
): RegisteredEventPublic {
	return {
		user_id: row.user_id,
		created_at: row.created_at,
		registered_event_id: row.registered_event_id
	};
}
