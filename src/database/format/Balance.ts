import { Prisma } from '../prisma/generated/client';
import { BalanceType } from '@/types/Balance';

const formatBalance = (row: Prisma.balanceGetPayload<object>): BalanceType => {
	return {
		id: row.id,
		updated_at: row.updated_at.toISOString(),
		account: row.account,
	};
};

export { formatBalance };
