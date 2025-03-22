-- Create achievement_type enum type if it doesn't exist
DO $$ BEGIN
    CREATE TYPE "achievement_type" AS ENUM ('course_enrollment', 'course_completion', 'streak', 'slides_milestone', 'multiple_courses', 'other');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Insert predefined achievements
INSERT INTO "womn-empr_achievement" ("id", "title", "description", "type", "icon_name", "icon_color", "required_value", "created_at", "updated_at")
VALUES 
  ('ach_first_course', 'First Steps', 'Enrolled in your first course', 'course_enrollment', 'book', 'notion-pink', 1, NOW(), NOW()),
  ('ach_course_graduate', 'Course Graduate', 'Completed your first course', 'course_completion', 'award', 'yellow-500', 1, NOW(), NOW()),
  ('ach_weekly_warrior', 'Weekly Warrior', 'Maintain a 7-day learning streak', 'streak', 'calendar', 'blue-500', 7, NOW(), NOW()),
  ('ach_course_explorer', 'Course Explorer', 'Enroll in 3 or more courses', 'multiple_courses', 'star', 'purple-500', 3, NOW(), NOW()),
  ('ach_halfway_there', 'Halfway There', 'Complete 50% of all your enrolled course slides', 'slides_milestone', 'trophy', 'amber-500', 50, NOW(), NOW()),
  ('ach_slide_master', 'Slide Master', 'Complete over 100 slides across all courses', 'slides_milestone', 'check', 'green-500', 100, NOW(), NOW())
ON CONFLICT ("id") DO UPDATE 
SET 
  "title" = EXCLUDED."title", 
  "description" = EXCLUDED."description",
  "type" = EXCLUDED."type",
  "icon_name" = EXCLUDED."icon_name",
  "icon_color" = EXCLUDED."icon_color",
  "required_value" = EXCLUDED."required_value",
  "updated_at" = NOW();