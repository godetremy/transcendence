import { config } from 'dotenv';
import { defineConfig } from '@prisma/config';

config({ path: 'docker/development/secrets/.env' });

export default defineConfig({
  schema: 'src/database/prisma/',
  migrations: {
    path: 'src/database/prisma/migrations',
  },
  datasource: {
    url: `postgres://${process.env.DATABASE_USERNAME}:${process.env.DATABASE_PASSWORD}@localhost:${process.env.DATABASE_PORT}/${process.env.DATABASE_NAME}`,
  },
});
