CREATE TABLE IF NOT EXISTS "notifications" (
	"id" text PRIMARY KEY NOT NULL,
	"receiver_id" text NOT NULL,
	"sender_id" text,
	"body" text NOT NULL,
	"title" text NOT NULL,
	"page" text,
	"is_read" boolean DEFAULT false NOT NULL,
	"updated_at" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "notifications_id_unique" UNIQUE("id")
);
