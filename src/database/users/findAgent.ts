import { prisma } from '@/database/prisma/prisma';

export async function findAgent(mail: string, password: string): Promise<string | null> {
	const row = await prisma.users.findUnique({
		where: { mail: mail, password: password },
	});
	if (row) return row.id;
	return null;
}
