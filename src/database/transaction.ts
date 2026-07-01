import { PaginationParameters } from '@/types/PaginationParameters';
import { Prisma } from './prisma/generated/client';
import { prisma } from './prisma/prisma';
import { DEFAULT_PAGINATION, paginationToPrisma } from '@/utils/pagination';
import { Checkout } from '@sumup/sdk';

const CreateTransaction = async <T extends Prisma.transactionInclude>(
	include: T,
	balance_id: string,
	checkout: Checkout
): Promise<Prisma.transactionGetPayload<{ include: T }>> => {
	return prisma.transaction.create({
		data: {
			id: checkout.id,
			balance_id: balance_id,
			amount: checkout.amount ?? 0,
			name: checkout.description,
		},
		include: include,
	});
};

const getTransactions = async <T extends Prisma.transactionInclude>(
	include: T,
	balance_id: string,
	pagination?: PaginationParameters
): Promise<Prisma.transactionGetPayload<{ include: T }>[]> => {
	return prisma.transaction.findMany({
		where: {
			balance_id: balance_id,
		},
		...paginationToPrisma(pagination ?? DEFAULT_PAGINATION),
		include: include,
	});
};

const getTransaction = async <T extends Prisma.transactionInclude>(
	include: T,
	balance_id: string
): Promise<Prisma.transactionGetPayload<{ include: T }> | null> => {
	return prisma.transaction.findUnique({
		where: {
			id: balance_id,
		},
		include: include,
	});
};

const countTransaction = async (balance_id: string): Promise<number> => {
	return prisma.transaction.count({
		where: {
			balance_id: balance_id,
		},
	});
};

export { getTransactions, countTransaction, CreateTransaction, getTransaction };
