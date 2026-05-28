'use server';
import { prisma } from "@/database/prisma/prisma";

export async function deleteEvent(event_id : string) {
	const row = await prisma.event.delete({
		where: {
			id : event_id,
		},
		include: {
			registered: true,
		}
	})
}