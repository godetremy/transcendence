import { prisma } from '@/database/prisma/prisma';
import * as bcrypt from 'bcrypt';

export async function findAgent(mail: string, password: string): Promise<string | null> {
	const row = await prisma.users.findFirst({
		where: { mail: mail },
	});
	if (row == null || row.password == null) return null;
	const result = await bcrypt.compare(password, row.password);
	if (result == true) return row.id;
	return null;
}
