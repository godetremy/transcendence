import { Prisma } from '../prisma/generated/client';
import { Membership } from '@/types/Membership';

const formatMembership = (memberships: Prisma.membershipsGetPayload<object>): Membership => {
	return {
		...memberships,
	};
};

export default formatMembership;
