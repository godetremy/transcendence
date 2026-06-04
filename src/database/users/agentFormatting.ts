import { User } from '@/types/bde/User';
import { Prisma } from '@/database/prisma/generated/client';

export function agentFormatting(row: Prisma.usersGetPayload<{ include: { memberships: false } }>): User {
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
		oauth_fortytwo_id: null,
		memberships_id: null,
		memberships: null,
	};
}
