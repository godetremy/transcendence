import { Prisma } from '../prisma/generated/client';
import { Memberships } from '@/types/Memberships';

const formatMembership = (memberships: Prisma.membershipsGetPayload<object>): Memberships => {
	return {
		...memberships,
	};
};

export default formatMembership;
