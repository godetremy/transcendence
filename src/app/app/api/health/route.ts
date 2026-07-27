import { PrismaClient } from "@/database/prisma/generated/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const pool = new Pool({
	connectionString: `postgres://${process.env.POSTGRES_USER}:${process.env.POSTGRES_PASSWORD}@${process.env.POSTGRES_HOST}:${process.env.DATABASE_PORT}/${process.env.POSTGRES_DB}`,
});

const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({ adapter });

export async function GET() {
  const checks = {
    database: false,
    api: true,
    timestamp: new Date().toISOString(),
  }

  try {
    await prisma.$queryRaw`SELECT 1`
    checks.database = true
  } catch (e) {
    checks.database = false
  }

  const allHealthy = Object.values(checks).every(
    v => typeof v !== 'boolean' || v === true
  )

  return Response.json(checks, {
    status: allHealthy ? 200 : 503,
  })
}