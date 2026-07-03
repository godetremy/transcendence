import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from './generated/client';
import { Pool } from 'pg';
import { esclient } from './elasticSearch';
import { DefaultArgs, PayloadToResult, RenameAndNestPayloadKeys } from '@prisma/client/runtime/client';
import { $usersPayload } from './generated/models';

const pool = new Pool({
	connectionString: `postgres://${process.env.POSTGRES_USER}:${process.env.POSTGRES_PASSWORD}@${process.env.POSTGRES_HOST}:${process.env.DATABASE_PORT}/${process.env.POSTGRES_DB}`,
});

const adapter = new PrismaPg(pool);

const globalForPrisma = global as unknown as { prisma: ReturnType<typeof createPrismaClient> };

const addQuery = async (
	result: PayloadToResult<$usersPayload<DefaultArgs>, RenameAndNestPayloadKeys<$usersPayload<DefaultArgs>>>
) => {
	if (result?.id) {
		await esclient.index({
			index: 'users',
			id: result.id,
			document: {
				full_name: result.full_name,
				mail: result.mail,
			},
		});
	}
};
function createPrismaClient() {
	const client = new PrismaClient({ adapter });

	return client.$extends({
		query: {
			users: {
				async create({ args, query }) {
					const result = await query(args);
					await addQuery(result);
					return result;
				},
				async update({ args, query }) {
					const result = await query(args);
					await addQuery(result);
					return result;
				},
				async upsert({ args, query }) {
					const result = await query(args);
					await addQuery(result);
					return result;
				},
				async delete({ args, query }) {
					const result = await query(args);
					if (result?.id) {
						await esclient.delete({ index: 'users', id: result.id }).catch(() => {});
					}
					return result;
				},
			},
		},
	});
}

export const prisma = globalForPrisma.prisma || createPrismaClient();

if (process.env.NODE_ENV !== 'production') {
	globalForPrisma.prisma = prisma;
}
