import { prisma } from '@/database/prisma/prisma';

export async function isAccountExist(id: number): Promise<boolean> {
	const result = await prisma.users.findUnique({
		where: {
			fortytwo_user_id: id,
		},
	});
	if (result == null) return false;
	return true;
}

export async function isAccountExistByMail(email: string): Promise<boolean> {
	const result = await prisma.users.findUnique({
		where: {
			mail: email,
		},
	});
	if (result == null) return false;
	return true;
}
