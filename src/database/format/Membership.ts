import { Prisma } from '../prisma/generated/client';
import { Membership } from '@/types/Membership';

const formatMembership = (memberships: Prisma.membershipsGetPayload<object>): Membership => {
	return {
		id: memberships.id,
		start_at: memberships.start_at.toISOString(),
		end_at: memberships.end_at.toISOString(),
	};
};

export default formatMembership;
