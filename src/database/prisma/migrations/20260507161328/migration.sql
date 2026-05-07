-- CreateTable
CREATE TABLE "memberships" (
    "id" TEXT NOT NULL,
    "start_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "end_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "memberships_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "oauth_fortytwo" (
    "id" TEXT NOT NULL,
    "access_token" TEXT,
    "refresh_token" TEXT,
    "valid_until" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "oauth_fortytwo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "oauth_fortytwo_id" TEXT,
    "memberships_id" TEXT,
    "fortytwo_user_id" INTEGER,
    "is_agent" BOOLEAN NOT NULL DEFAULT false,
    "is_verify_agent" BOOLEAN NOT NULL DEFAULT false,
    "reason" TEXT,
    "mail" TEXT NOT NULL,
    "password" TEXT,
    "first_name" TEXT,
    "last_name" TEXT,
    "full_name" TEXT,
    "profile_picture" TEXT NOT NULL DEFAULT '/images/default_user.png',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_fortytwo_user_id_key" ON "users"("fortytwo_user_id");

-- CreateIndex
CREATE UNIQUE INDEX "users_mail_key" ON "users"("mail");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_oauth_fortytwo_id_fkey" FOREIGN KEY ("oauth_fortytwo_id") REFERENCES "oauth_fortytwo"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_memberships_id_fkey" FOREIGN KEY ("memberships_id") REFERENCES "memberships"("id") ON DELETE SET NULL ON UPDATE CASCADE;
