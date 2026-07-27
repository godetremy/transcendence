import { TranscationType } from '@/types/Transaction';
import { Prisma } from '../prisma/generated/client';

const formatTransaction = (row: Prisma.transactionGetPayload<object>): TranscationType => {
	return {
		id: row.id,
		created_at: row.created_at.toISOString(),
		amount: row.amount,
		name: row.name,
	};
};

export { formatTransaction };
