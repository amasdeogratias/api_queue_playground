CREATE TABLE `schools` (
	`id` varchar(100) NOT NULL,
	`name` varchar(255) NOT NULL,
	`code` varchar(50) NOT NULL,
	`email` varchar(255),
	`phone` varchar(30),
	`currency` varchar(3) NOT NULL DEFAULT 'TZS',
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `schools_id` PRIMARY KEY(`id`),
	CONSTRAINT `schools_code_uq` UNIQUE(`code`)
);
--> statement-breakpoint
CREATE TABLE `school_members` (
	`id` varchar(100) NOT NULL,
	`school_id` bigint unsigned NOT NULL,
	`user_id` bigint unsigned NOT NULL,
	`role` enum('admin','accountant','viewer') NOT NULL DEFAULT 'viewer',
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `school_members_id` PRIMARY KEY(`id`),
	CONSTRAINT `school_members_school_user_uq` UNIQUE(`school_id`,`user_id`)
);
--> statement-breakpoint
ALTER TABLE `school_members` ADD CONSTRAINT `school_members_school_id_schools_id_fk` FOREIGN KEY (`school_id`) REFERENCES `schools`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `school_members` ADD CONSTRAINT `school_members_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX `schools_name_idx` ON `schools` (`name`);--> statement-breakpoint
CREATE INDEX `school_members_school_role_idx` ON `school_members` (`school_id`,`role`);