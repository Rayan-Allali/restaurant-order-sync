CREATE TABLE "orders" (
	"id" uuid PRIMARY KEY NOT NULL,
	"items" jsonb NOT NULL,
	"total_amount" integer NOT NULL,
	"status" text DEFAULT 'new' NOT NULL,
	"created_at" bigint NOT NULL,
	"updated_at" bigint NOT NULL
);
