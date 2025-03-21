-- Add notes table
CREATE TABLE IF NOT EXISTS "womn-empr_note" (
  "id" VARCHAR(255) PRIMARY KEY DEFAULT uuid_generate_v4(),
  "content" TEXT NOT NULL,
  "slideId" VARCHAR(255) NOT NULL REFERENCES "womn-empr_slide"("id") ON DELETE CASCADE,
  "trainee_id" VARCHAR(255) NOT NULL REFERENCES "womn-empr_user"("id") ON DELETE CASCADE,
  "created_at" TIMESTAMPTZ DEFAULT NOW(),
  "updated_at" TIMESTAMPTZ DEFAULT NOW()
);

-- Add slide_progress table
CREATE TABLE IF NOT EXISTS "womn-empr_slide_progress" (
  "id" VARCHAR(255) PRIMARY KEY DEFAULT uuid_generate_v4(),
  "slide_id" VARCHAR(255) NOT NULL REFERENCES "womn-empr_slide"("id") ON DELETE CASCADE,
  "trainee_id" VARCHAR(255) NOT NULL REFERENCES "womn-empr_user"("id") ON DELETE CASCADE,
  "completed" BOOLEAN DEFAULT FALSE,
  "completed_at" TIMESTAMPTZ,
  CONSTRAINT "slide_progress_slide_trainee_idx" UNIQUE ("slide_id", "trainee_id")
);

-- Add indexes
CREATE INDEX IF NOT EXISTS "note_slide_idx" ON "womn-empr_note"("slideId");
CREATE INDEX IF NOT EXISTS "note_trainee_idx" ON "womn-empr_note"("trainee_id");
CREATE INDEX IF NOT EXISTS "slide_progress_trainee_idx" ON "womn-empr_slide_progress"("trainee_id");
CREATE INDEX IF NOT EXISTS "slide_progress_slide_idx" ON "womn-empr_slide_progress"("slide_id");

-- Add last_accessed_at to enrollments table if not exists
ALTER TABLE "womn-empr_enrollment"
ADD COLUMN IF NOT EXISTS "last_accessed_at" TIMESTAMPTZ;