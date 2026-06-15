import { Prisma } from '../prisma/generated/client';
import { User, PublicUser } from '@/types/User';
import formatMembership from '@/database/format/Membership';

const formatPrivateUser = <T extends Prisma.usersInclude>(row: Prisma.usersGetPayload<{ include: T }>): User => {
	// This filter private database data.
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const { fortytwo_oauth_id, fortytwo_user_id, password, two_factor_auth_id, memberships_id, ...user } = row;

	return {
		...user,
		membership:
			'membership' in row
				? row.membership
					? formatMembership(row.membership as Prisma.membershipsGetPayload<object>)
					: null
				: null,
	};
};

const formatPublicUser = (row: Prisma.usersGetPayload<object>): PublicUser => {
	return {
		id: row.id,
		first_name: row.first_name,
		last_name: row.last_name,
		full_name: row.full_name,
		profile_picture: row.full_name,
		agent: row.agent,
		created_at: row.created_at,
		updated_at: row.updated_at,
		is_member: row.memberships_id !== null,
	};
};

export { formatPrivateUser, formatPublicUser };
