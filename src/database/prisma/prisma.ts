import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from './generated/client';
import { Pool } from 'pg';
import {
	createEventElasticSearch,
	createServiceElasticSearch,
	createUsersElasticSearch,
	getESClient,
} from './elasticSearch';

const pool = new Pool({
	connectionString: `postgres://${process.env.POSTGRES_USER}:${process.env.POSTGRES_PASSWORD}@${process.env.POSTGRES_HOST}:${process.env.DATABASE_PORT}/${process.env.POSTGRES_DB}`,
});

const adapter = new PrismaPg(pool);

const globalForPrisma = global as unknown as { prisma: ReturnType<typeof createPrismaClient> };

function createPrismaClient() {
	const client = new PrismaClient({ adapter });
	const esclient = getESClient();

	return client.$extends({
		query: {
			users: {
				async create({ args, query }) {
					const result = await query(args);
					await createUsersElasticSearch(result);
					return result;
				},
				async update({ args, query }) {
					const result = await query(args);
					await createUsersElasticSearch(result);
					return result;
				},
				async upsert({ args, query }) {
					const result = await query(args);
					await createUsersElasticSearch(result);
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
			events: {
				async create({ args, query }) {
					const result = await query(args);
					await createEventElasticSearch(result);
					return result;
				},
				async update({ args, query }) {
					const result = await query(args);
					await createEventElasticSearch(result);
					return result;
				},
				async upsert({ args, query }) {
					const result = await query(args);
					await createEventElasticSearch(result);
					return result;
				},
				async delete({ args, query }) {
					const result = await query(args);
					if (result?.id) {
						await esclient.delete({ index: 'events', id: result.id }).catch(() => {});
					}
					return result;
				},
			},
			services: {
				async create({ args, query }) {
					const result = await query(args);
					await createServiceElasticSearch(result);
					return result;
				},
				async update({ args, query }) {
					const result = await query(args);
					await createServiceElasticSearch(result);
					return result;
				},
				async upsert({ args, query }) {
					const result = await query(args);
					await createServiceElasticSearch(result);
					return result;
				},
				async delete({ args, query }) {
					const result = await query(args);
					if (result?.id) {
						await esclient.delete({ index: 'events', id: result.id }).catch(() => {});
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
