import { Prisma } from '@/database/prisma/generated/client';
import { PrivateEvent, PublicEvent } from '@/types/Event';

export function formatPublicEvent(row: Prisma.eventsGetPayload<{ include: { organization: true } }>): PublicEvent {
	return {
		id: row.id,
		title: row.title,
		subtitle: row.subtitle,
		description: row.description,
		max_registration: row.max_registration,
		image: row.image,
		localtion: row.location,
		start_at: row.start_at,
		end_at: row.end_at,
		create_at: row.created_at,
		update_at: row.update_at,
	};
}

export function formatPrivateEvent(row: Prisma.eventsGetPayload<{ include: { organization: true } }>): PrivateEvent {
	return {
		id: row.id,
		title: row.title,
		subtitle: row.subtitle,
		description: row.description,
		max_registration: row.max_registration,
		image: row.image,
		localtion: row.location,
		start_at: row.start_at,
		end_at: row.end_at,
		create_at: row.created_at,
		update_at: row.update_at,
		event_registration: '',
	};
}
