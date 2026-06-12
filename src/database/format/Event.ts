import { Prisma } from '@/database/prisma/generated/client';
import { PublicEvent } from '@/types/Event';

export function formatPublicEvent(
	row: Prisma.eventGetPayload<{ include: { registered: false; author: true } }>
): PublicEvent {
	return {
		id: row.id,
		title: row.title,
		description: row.description,
		max_inscription: row.max_inscription,
		start_at: row.start_at,
		end_at: row.end_at,
		author: {
			id: row.author.id,
			first_name: row.author.first_name,
			last_name: row.author.last_name,
			full_name: row.author.full_name,
			profile_picture: row.author.profile_picture,
			is_agent: row.author.is_agent,
		},
	};
}
