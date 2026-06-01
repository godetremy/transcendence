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
CREATE TABLE "registered_event" (
    "id" TEXT NOT NULL,
    "user_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "registered_event_id" TEXT,

    CONSTRAINT "registered_event_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "image_album" (
    "id" TEXT NOT NULL,
    "upload_user_id" TEXT,
    "event_id" TEXT,
    "image_path" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "image_album_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "image_report" (
    "id" TEXT NOT NULL,
    "image_album_id" TEXT,
    "signaling_id" TEXT NOT NULL,
    "reason" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "image_report_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "event" (
    "id" TEXT NOT NULL,
    "author_id" TEXT NOT NULL,
    "title" TEXT,
    "description" TEXT,
    "max_inscription" INTEGER NOT NULL DEFAULT 0,
    "start_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "end_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "event_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "oauth_fortytwo_id" TEXT,
    "memberships_id" TEXT,
    "fortytwo_user_id" INTEGER,
    "is_agent" BOOLEAN NOT NULL DEFAULT false,
    "is_agent_verified" BOOLEAN,
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
CREATE UNIQUE INDEX "registered_event_registered_event_id_key" ON "registered_event"("registered_event_id");

-- CreateIndex
CREATE UNIQUE INDEX "image_album_event_id_key" ON "image_album"("event_id");

-- CreateIndex
CREATE UNIQUE INDEX "image_album_image_path_key" ON "image_album"("image_path");

-- CreateIndex
CREATE UNIQUE INDEX "image_report_image_album_id_key" ON "image_report"("image_album_id");

-- CreateIndex
CREATE UNIQUE INDEX "users_fortytwo_user_id_key" ON "users"("fortytwo_user_id");

-- CreateIndex
CREATE UNIQUE INDEX "users_mail_key" ON "users"("mail");

-- AddForeignKey
ALTER TABLE "registered_event" ADD CONSTRAINT "registered_event_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "registered_event" ADD CONSTRAINT "registered_event_registered_event_id_fkey" FOREIGN KEY ("registered_event_id") REFERENCES "event"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "image_album" ADD CONSTRAINT "image_album_upload_user_id_fkey" FOREIGN KEY ("upload_user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "image_album" ADD CONSTRAINT "image_album_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "event"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "image_report" ADD CONSTRAINT "image_report_image_album_id_fkey" FOREIGN KEY ("image_album_id") REFERENCES "image_album"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "image_report" ADD CONSTRAINT "image_report_signaling_id_fkey" FOREIGN KEY ("signaling_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "event" ADD CONSTRAINT "event_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_oauth_fortytwo_id_fkey" FOREIGN KEY ("oauth_fortytwo_id") REFERENCES "oauth_fortytwo"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_memberships_id_fkey" FOREIGN KEY ("memberships_id") REFERENCES "memberships"("id") ON DELETE SET NULL ON UPDATE CASCADE;
