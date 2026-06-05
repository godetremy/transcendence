import { Prisma } from '../prisma/generated/client';
import { User } from '@/types/User';
import formatMembership from '@/database/format/Membership';

const formatUser = (row: Prisma.usersGetPayload<{ include: { memberships: true } }>): User => {
	return {
		...row,
		memberships: row.memberships ? formatMembership(row.memberships) : null,
	};
};

export default formatUser;
