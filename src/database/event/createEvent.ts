'use server';
import { CreateEventType, Event } from '@/types/bde/Event';

import { prisma } from "@/database/prisma/prisma";
import { Prisma } from '../prisma/generated/client';
import { getMe, UserFormatting } from '../users/getUser';

export async function CreateEvent(event: CreateEventType): Promise<Event | null> {
	const me = await getMe();
	if (me == null) return null;
	const row = await prisma.event.create({
		data: {
			author_id: me.id,
			title: event.title,
			description: event.description,
			max_inscription: event.max_inscription,
			start_at: event.start_at,
			end_at: event.end_at,
		},
		include: {
            author: {
                include: {
                    memberships: true
                }
            },
            registered: true,
        }
	})
	if (row != null)
		return await EventFormatting(row);
	return null;
}

export async function EventFormatting(row: Prisma.eventGetPayload<{ include: { registered: true, author: { include: { memberships : true}} } }>): Promise<Event> {
	return {
		id: row.id,
		title: row.title,
		description: row.description,
		max_inscription: row.max_inscription,
		registered_count: row.registered_count,
		start_at: row.start_at,
		end_at: row.end_at,
		create_at: row.created_at,
		author_id: row.author_id,
		author: UserFormatting(row.author),
		registered: row.registered,
	}
}