DO $$ BEGIN
 CREATE TYPE "public"."achievement_type" AS ENUM('course_enrollment', 'course_completion', 'streak', 'slides_milestone', 'multiple_courses', 'other');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "womn-empr_achievement" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"title" varchar(255) NOT NULL,
	"description" text NOT NULL,
	"type" "achievement_type" NOT NULL,
	"icon_name" varchar(50) NOT NULL,
	"icon_color" varchar(50) NOT NULL,
	"required_value" integer DEFAULT 1,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "womn-empr_learning_streak" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"date" timestamp with time zone NOT NULL,
	"current_streak" integer DEFAULT 1,
	"longest_streak" integer DEFAULT 1,
	"last_activity_date" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "womn-empr_user_achievement" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"achievement_id" varchar(255) NOT NULL,
	"progress" integer DEFAULT 0,
	"current_value" integer DEFAULT 0,
	"is_unlocked" boolean DEFAULT false,
	"unlocked_at" timestamp with time zone,
	"updated_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "womn-empr_learning_streak" ADD CONSTRAINT "womn-empr_learning_streak_user_id_womn-empr_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."womn-empr_user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "womn-empr_user_achievement" ADD CONSTRAINT "womn-empr_user_achievement_user_id_womn-empr_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."womn-empr_user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "womn-empr_user_achievement" ADD CONSTRAINT "womn-empr_user_achievement_achievement_id_womn-empr_achievement_id_fk" FOREIGN KEY ("achievement_id") REFERENCES "public"."womn-empr_achievement"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "user_achievement_idx" ON "womn-empr_user_achievement" USING btree ("user_id","achievement_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "user_achievement_user_idx" ON "womn-empr_user_achievement" USING btree ("user_id");