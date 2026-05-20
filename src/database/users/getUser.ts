import { prisma } from '@/database/prisma/prisma';
import { User } from '@/types/bde/User';
import { JWTSessionPayload } from '@/types/session/SessionPayload';

export async function getUserFromSession(session: JWTSessionPayload): Promise<User | null> {
	return getUserById(session.user_id);
}
import { Prisma } from '../prisma/generated/client';

export async function getUserById(id: string): Promise<User | null> {
	const row = await prisma.users.findUnique({
		where: {
			id: id,
		},
		include: {
			memberships: true,
			oauth_fortytwo: true,
		},
	});
	if (row != null) {
		return UserFormatting(row);
	}
	return null;
}

export function UserFormatting(row: Prisma.usersGetPayload<{ include: { memberships: true } }>): User | null {
	return {
		id: row.id,
		mail: row.mail,
		first_name: row.first_name,
		last_name: row.last_name,
		full_name: row.full_name,
		is_agent: row.is_agent,
		is_agent_verified: row.is_agent_verified,
		reason: row.reason,
		profile_picture: row.profile_picture,
		oauth_fortytwo_id: row.oauth_fortytwo_id,
		memberships_id: row.memberships_id,
		memberships: row.memberships,
	};
}
