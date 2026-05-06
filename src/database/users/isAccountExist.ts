import { prisma } from '@/database/prisma/prisma';

export async function isAccountExist(id: string): Promise<boolean> {
	const result = await prisma.users.findUnique({
		where: {
			id: id,
		},
	});
	if (result == null) return false;
	return true;
}
