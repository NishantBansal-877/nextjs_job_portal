ALTER TABLE `employers` MODIFY COLUMN `deleted_at` timestamp;--> statement-breakpoint
ALTER TABLE `employers` ADD `updated_at` timestamp DEFAULT (now()) NOT NULL;