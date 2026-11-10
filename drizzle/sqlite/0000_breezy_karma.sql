CREATE TABLE `orders` (
	`id` text PRIMARY KEY NOT NULL,
	`items` text NOT NULL,
	`total_amount` integer NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	`status` text DEFAULT 'new' NOT NULL,
	`sync_status` text DEFAULT 'pending' NOT NULL,
	`last_synced_at` integer,
	`version` integer DEFAULT 0 NOT NULL
);
