import { Prisma } from './prisma/generated/client';
import { prisma } from './prisma/prisma';

const getBalance = async <T extends Prisma.balanceInclude>(
	include: T,
	balance_id: string
): Promise<Prisma.balanceGetPayload<{ include: T }> | null> => {
	return prisma.balance.findUnique({
		where: {
			id: balance_id,
		},
		include: include,
	});
};

const updateBalance = async <T extends Prisma.balanceInclude>(
	include: T,
	balance_id: string,
	amount: number
): Promise<Prisma.balanceGetPayload<{ include: T }> | null> => {
	return prisma.balance.update({
		where: {
			id: balance_id,
		},
		include: include,
		data: {
			account: {
				increment: amount * 10,
			},
		},
	});
};

export { getBalance, updateBalance };
