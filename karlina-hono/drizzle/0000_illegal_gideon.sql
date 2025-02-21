CREATE TABLE `auth` (
	`key` varchar(36) NOT NULL,
	CONSTRAINT `auth_key` PRIMARY KEY(`key`)
);
--> statement-breakpoint
CREATE TABLE `person` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`address` varchar(255) NOT NULL,
	`phone` varchar(255) NOT NULL,
	CONSTRAINT `person_id` PRIMARY KEY(`id`)
);
