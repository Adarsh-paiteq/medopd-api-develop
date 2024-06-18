CREATE TABLE IF NOT EXISTS "admins" (
	"id" text PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"password" text NOT NULL,
	"full_name" text NOT NULL,
	"earning_balance" integer DEFAULT 0 NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"refresh_token" text,
	CONSTRAINT "admins_id_unique" UNIQUE("id"),
	CONSTRAINT "admins_email_unique" UNIQUE("email")
);
