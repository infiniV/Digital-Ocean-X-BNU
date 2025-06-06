DO $$ BEGIN
 CREATE TYPE "public"."content_type" AS ENUM('slides', 'video', 'pdf', 'text', 'quiz', 'assignment');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."course_status" AS ENUM('draft', 'published', 'archived', 'under_review');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."role" AS ENUM('trainee', 'trainer', 'admin');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."skill_level" AS ENUM('beginner', 'intermediate', 'advanced');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."verification_status" AS ENUM('pending', 'approved', 'rejected');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "womn-empr_account" (
	"user_id" varchar(255) NOT NULL,
	"type" varchar(255) NOT NULL,
	"provider" varchar(255) NOT NULL,
	"provider_account_id" varchar(255) NOT NULL,
	"refresh_token" text,
	"access_token" text,
	"expires_at" integer,
	"token_type" varchar(255),
	"scope" varchar(255),
	"id_token" text,
	"session_state" varchar(255),
	CONSTRAINT "womn-empr_account_provider_provider_account_id_pk" PRIMARY KEY("provider","provider_account_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "womn-empr_category" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(100) NOT NULL,
	"description" text,
	"icon_url" varchar(255),
	"parent_id" uuid,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "womn-empr_category_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "womn-empr_course" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" varchar(255) NOT NULL,
	"slug" varchar(255) NOT NULL,
	"description" text,
	"short_description" varchar(500),
	"trainer_id" varchar(255) NOT NULL,
	"category_id" uuid,
	"cover_image_url" varchar(255),
	"status" "course_status" DEFAULT 'draft',
	"is_featured" boolean DEFAULT false,
	"skill_level" "skill_level",
	"prerequisites" text,
	"estimated_duration" integer,
	"tags" text[],
	"created_at" timestamp DEFAULT now(),
	"published_at" timestamp,
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "womn-empr_course_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "womn-empr_post" (
	"id" integer PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY (sequence name "womn-empr_post_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"name" varchar(256),
	"created_by" varchar(255) NOT NULL,
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "womn-empr_session" (
	"session_token" varchar(255) PRIMARY KEY NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"expires" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "womn-empr_trainer_profile" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"expertise" text[],
	"years_experience" integer,
	"qualifications" jsonb,
	"verification_status" "verification_status" DEFAULT 'pending',
	"verification_documents" jsonb,
	"rating" numeric(3, 2),
	"total_trainees" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "womn-empr_user" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"name" varchar(255),
	"email" varchar(255) NOT NULL,
	"email_verified" timestamp with time zone,
	"image" varchar(255),
	"role" "role" DEFAULT 'trainee',
	"bio" text,
	"skills" jsonb,
	"social_links" jsonb,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "womn-empr_verification_token" (
	"identifier" varchar(255) NOT NULL,
	"token" varchar(255) NOT NULL,
	"expires" timestamp with time zone NOT NULL,
	CONSTRAINT "womn-empr_verification_token_identifier_token_pk" PRIMARY KEY("identifier","token")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "womn-empr_account" ADD CONSTRAINT "womn-empr_account_user_id_womn-empr_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."womn-empr_user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "womn-empr_course" ADD CONSTRAINT "womn-empr_course_trainer_id_womn-empr_user_id_fk" FOREIGN KEY ("trainer_id") REFERENCES "public"."womn-empr_user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "womn-empr_course" ADD CONSTRAINT "womn-empr_course_category_id_womn-empr_category_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."womn-empr_category"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "womn-empr_post" ADD CONSTRAINT "womn-empr_post_created_by_womn-empr_user_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."womn-empr_user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "womn-empr_session" ADD CONSTRAINT "womn-empr_session_user_id_womn-empr_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."womn-empr_user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "womn-empr_trainer_profile" ADD CONSTRAINT "womn-empr_trainer_profile_user_id_womn-empr_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."womn-empr_user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "account_user_id_idx" ON "womn-empr_account" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "created_by_idx" ON "womn-empr_post" USING btree ("created_by");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "name_idx" ON "womn-empr_post" USING btree ("name");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "session_user_id_idx" ON "womn-empr_session" USING btree ("user_id");