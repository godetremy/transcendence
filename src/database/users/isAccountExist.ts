import { prisma } from '@/database/prisma/prisma';

export async function isAccountExist(mail: string): Promise<boolean> {
	const result = await prisma.users.findUnique({
		where: {
			mail: mail,
		},
	});
	if (result == null) return false;
	return true;
}
