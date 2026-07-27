import { config } from 'dotenv';
import { defineConfig } from '@prisma/config';


if (!process.env.RUNNING_IN_DOCKER) {
	const env = process.env.APP_ENV ?? 'development';
    config({ path: `docker/${env}/secrets/.env` });
}

export default defineConfig({
	schema: 'src/database/prisma/',
	migrations: {
		path: 'src/database/prisma/migrations',
	},
	datasource: {
		url: `postgres://${process.env.POSTGRES_USER}:${process.env.POSTGRES_PASSWORD}@${process.env.POSTGRES_HOST}:${process.env.DATABASE_PORT}/${process.env.POSTGRES_DB}`,
	},
});
