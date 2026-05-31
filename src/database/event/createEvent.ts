'use server';
import { Event } from '@/types/bde/Event';
import { Prisma } from '../prisma/generated/client';
import { UserFormatting } from '../users/getUser';

export async function EventFormatting(
	row: Prisma.eventGetPayload<{ include: { registered: true; author: { include: { memberships: true } } } }>
): Promise<Event> {
	return {
		id: row.id,
		title: row.title,
		description: row.description,
		max_inscription: row.max_inscription,
		start_at: row.start_at,
		end_at: row.end_at,
		create_at: row.created_at,
		author_id: row.author_id,
		author: UserFormatting(row.author),
		registered: row.registered,
	};
}
