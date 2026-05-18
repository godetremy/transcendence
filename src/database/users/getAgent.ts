import { prisma } from '@/database/prisma/prisma';
import { User } from '@/types/bde/User';
import * as bcrypt from 'bcrypt';
import { Prisma } from '@/database/prisma/generated/client';

export async function getAgent(mail: string, password: string): Promise<User | null> {
	const row = await prisma.users.findFirst({
		where: { mail: mail },
	});
	if (row == null || row.password == null) return null;
	const result = await bcrypt.compare(password, row.password);
	if (result == true) return agentFormatting(row);
	return null;
}

export function agentFormatting(row: Prisma.usersGetPayload<{ include: { memberships: false } }>): User {
	return {
		id: row.id,
		mail: row.mail,
		first_name: row.first_name,
		last_name: row.last_name,
		full_name: row.full_name,
		is_agent: row.is_agent,
		is_agent_verified: row.is_agent_verified,
		profile_picture: row.profile_picture,
		oauth_fortytwo_id: null,
		memberships_id: null,
		memberships: null,
	};
}
