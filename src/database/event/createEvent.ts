'use server';
import { PublicEvent } from '@/types/Event';
import { Prisma } from '../prisma/generated/client';

export async function EventFormatting(
	row: Prisma.eventGetPayload<{ include: { registered: false; author: false } }>
): Promise<PublicEvent> {
	return {
		...row,
	};
}
