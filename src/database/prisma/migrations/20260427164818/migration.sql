-- AlterTable
ALTER TABLE "oauth_fortytwo" ALTER COLUMN "access_token" DROP NOT NULL;

-- AlterTable
ALTER TABLE "users" ALTER COLUMN "first_name" DROP NOT NULL,
ALTER COLUMN "last_name" DROP NOT NULL,
ALTER COLUMN "full_name" DROP NOT NULL;
