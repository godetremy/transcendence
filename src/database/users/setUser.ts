import { prisma } from '@/database/prisma/prisma';

export async function setUserName(user_id: string, name: string) {
	await prisma.users.update({
		where: { id: user_id },
		data: { full_name: name },
	});
}

export async function setUserReason(user_id: string, reason: string) {
	await prisma.users.update({
		where: { id: user_id },
		data: { reason: reason },
	});
}
