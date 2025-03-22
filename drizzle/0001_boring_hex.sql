DO $$ BEGIN
 CREATE TYPE "public"."enrollment_status" AS ENUM('active', 'completed', 'dropped', 'pending');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."user_role" AS ENUM('trainee', 'trainer', 'admin');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "womn-empr_enrollment" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"course_id" varchar(255) NOT NULL,
	"trainee_id" varchar(255) NOT NULL,
	"status" "enrollment_status" DEFAULT 'active',
	"progress" integer DEFAULT 0,
	"enrolled_at" timestamp with time zone DEFAULT now(),
	"completed_at" timestamp with time zone,
	"last_accessed_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "womn-empr_note" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"content" text NOT NULL,
	"slideId" varchar(255) NOT NULL,
	"trainee_id" varchar(255) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "womn-empr_slide_progress" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"slide_id" varchar(255) NOT NULL,
	"trainee_id" varchar(255) NOT NULL,
	"completed" boolean DEFAULT false,
	"completed_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "womn-empr_slide" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"course_id" varchar(255) NOT NULL,
	"title" varchar(255) NOT NULL,
	"description" text,
	"file_url" varchar(1024) NOT NULL,
	"file_type" varchar(50) NOT NULL,
	"original_filename" varchar(255),
	"order" integer DEFAULT 0,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
DROP TABLE "womn-empr_category";--> statement-breakpoint
DROP TABLE "womn-empr_post";--> statement-breakpoint
DROP TABLE "womn-empr_trainer_profile";--> statement-breakpoint
ALTER TABLE "womn-empr_account" DROP CONSTRAINT "womn-empr_account_user_id_womn-empr_user_id_fk";
--> statement-breakpoint
ALTER TABLE "womn-empr_course" DROP CONSTRAINT "womn-empr_course_category_id_womn-empr_category_id_fk";
--> statement-breakpoint
ALTER TABLE "womn-empr_session" DROP CONSTRAINT "womn-empr_session_user_id_womn-empr_user_id_fk";
--> statement-breakpoint
ALTER TABLE "womn-empr_course" ALTER COLUMN "id" SET DATA TYPE varchar(255);--> statement-breakpoint
ALTER TABLE "womn-empr_course" ALTER COLUMN "id" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "womn-empr_course" ALTER COLUMN "short_description" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "womn-empr_course" ALTER COLUMN "skill_level" SET DEFAULT 'beginner';--> statement-breakpoint
ALTER TABLE "womn-empr_course" ALTER COLUMN "created_at" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
ALTER TABLE "womn-empr_course" ALTER COLUMN "updated_at" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
ALTER TABLE "womn-empr_user" ALTER COLUMN "role" SET DATA TYPE user_role;--> statement-breakpoint
ALTER TABLE "womn-empr_user" ADD COLUMN "verification_status" "verification_status" DEFAULT 'pending';--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "womn-empr_enrollment" ADD CONSTRAINT "womn-empr_enrollment_course_id_womn-empr_course_id_fk" FOREIGN KEY ("course_id") REFERENCES "public"."womn-empr_course"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "womn-empr_enrollment" ADD CONSTRAINT "womn-empr_enrollment_trainee_id_womn-empr_user_id_fk" FOREIGN KEY ("trainee_id") REFERENCES "public"."womn-empr_user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "womn-empr_note" ADD CONSTRAINT "womn-empr_note_slideId_womn-empr_slide_id_fk" FOREIGN KEY ("slideId") REFERENCES "public"."womn-empr_slide"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "womn-empr_note" ADD CONSTRAINT "womn-empr_note_trainee_id_womn-empr_user_id_fk" FOREIGN KEY ("trainee_id") REFERENCES "public"."womn-empr_user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "womn-empr_slide_progress" ADD CONSTRAINT "womn-empr_slide_progress_slide_id_womn-empr_slide_id_fk" FOREIGN KEY ("slide_id") REFERENCES "public"."womn-empr_slide"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "womn-empr_slide_progress" ADD CONSTRAINT "womn-empr_slide_progress_trainee_id_womn-empr_user_id_fk" FOREIGN KEY ("trainee_id") REFERENCES "public"."womn-empr_user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "womn-empr_slide" ADD CONSTRAINT "womn-empr_slide_course_id_womn-empr_course_id_fk" FOREIGN KEY ("course_id") REFERENCES "public"."womn-empr_course"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "enrollment_course_trainee_idx" ON "womn-empr_enrollment" USING btree ("course_id","trainee_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "enrollment_trainee_idx" ON "womn-empr_enrollment" USING btree ("trainee_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "enrollment_course_idx" ON "womn-empr_enrollment" USING btree ("course_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "slide_progress_slide_trainee_idx" ON "womn-empr_slide_progress" USING btree ("slide_id","trainee_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "slide_progress_trainee_idx" ON "womn-empr_slide_progress" USING btree ("trainee_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "slide_progress_slide_idx" ON "womn-empr_slide_progress" USING btree ("slide_id");--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "womn-empr_account" ADD CONSTRAINT "womn-empr_account_user_id_womn-empr_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."womn-empr_user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "womn-empr_session" ADD CONSTRAINT "womn-empr_session_user_id_womn-empr_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."womn-empr_user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "womn-empr_course" DROP COLUMN IF EXISTS "category_id";--> statement-breakpoint
ALTER TABLE "womn-empr_course" DROP COLUMN IF EXISTS "prerequisites";--> statement-breakpoint
ALTER TABLE "womn-empr_course" DROP COLUMN IF EXISTS "estimated_duration";--> statement-breakpoint
ALTER TABLE "womn-empr_course" DROP COLUMN IF EXISTS "tags";--> statement-breakpoint
ALTER TABLE "womn-empr_course" DROP COLUMN IF EXISTS "published_at";