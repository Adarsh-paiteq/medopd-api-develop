DO $$ BEGIN
 CREATE TYPE "file_type" AS ENUM('IMAGE', 'VIDEO', 'DOCUMENT', 'AUDIO');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "chat_message_attachments" (
	"id" text PRIMARY KEY NOT NULL,
	"chat_id" text NOT NULL,
	"chat_message_id" text NOT NULL,
	"sender_id" text NOT NULL,
	"file_id" text NOT NULL,
	"file_path" text NOT NULL,
	"file_url" text NOT NULL,
	"file_type" "file_type" NOT NULL,
	"thumbnail_image_url" text,
	"thumbnail_image_id" text,
	"thumbnail_image_id_path" text,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "chat_message_attachments_id_unique" UNIQUE("id")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "chat_message_attachments" ADD CONSTRAINT "chat_message_attachments_chat_id_chats_id_fk" FOREIGN KEY ("chat_id") REFERENCES "chats"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "chat_message_attachments" ADD CONSTRAINT "chat_message_attachments_chat_message_id_chat_messages_id_fk" FOREIGN KEY ("chat_message_id") REFERENCES "chat_messages"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
