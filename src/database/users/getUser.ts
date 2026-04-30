import { prisma } from '@/database/prisma/prisma';
import { User } from '@/types/database/User';
import { JWTSessionPayload } from '@/types/payload/SessionPayload';

export async function getUserFromSession(session: JWTSessionPayload): Promise<User | null> {
	return getUserById(session.user_id);
}

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
		return {
			id: row.id,
			mail: row.mail,
			first_name: row.first_name,
			last_name: row.last_name,
			full_name: row.full_name,
			is_agent: row.is_agent,
			profile_picture: row.profile_picture,
			oauth_fortytwo_id: row.oauth_fortytwo_id,
			memberships_id: row.memberships_id,
			memberships: row.memberships,
		};
	}
	return null;
}
