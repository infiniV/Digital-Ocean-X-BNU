-- Add default achievements
INSERT INTO "womn-empr_achievement" ("id", "title", "description", "type", "icon_name", "icon_color", "required_value")
VALUES 
  -- Course completion achievements
  (gen_random_uuid(), 'First Steps', 'Complete your first course', 'course_completion', 'trophy', 'amber-500', 1),
  (gen_random_uuid(), 'Learning Pro', 'Complete 5 courses', 'course_completion', 'trophy', 'amber-500', 5),
  (gen_random_uuid(), 'Master Learner', 'Complete 10 courses', 'course_completion', 'trophy', 'amber-500', 10),
  
  -- Learning streak achievements
  (gen_random_uuid(), 'Getting Started', 'Maintain a 3-day learning streak', 'streak', 'flame', 'red-500', 3),
  (gen_random_uuid(), 'Consistency is Key', 'Maintain a 7-day learning streak', 'streak', 'flame', 'red-500', 7),
  (gen_random_uuid(), 'Dedicated Learner', 'Maintain a 30-day learning streak', 'streak', 'flame', 'red-500', 30),
  
  -- Slides milestone achievements
  (gen_random_uuid(), 'Quick Learner', 'Complete 10 slides', 'slides_milestone', 'star', 'blue-500', 10),
  (gen_random_uuid(), 'Knowledge Seeker', 'Complete 50 slides', 'slides_milestone', 'star', 'blue-500', 50),
  (gen_random_uuid(), 'Content Master', 'Complete 100 slides', 'slides_milestone', 'star', 'blue-500', 100),
  
  -- Multiple courses achievements
  (gen_random_uuid(), 'Course Explorer', 'Enroll in 3 different courses', 'multiple_courses', 'compass', 'green-500', 3),
  (gen_random_uuid(), 'Course Enthusiast', 'Enroll in 5 different courses', 'multiple_courses', 'compass', 'green-500', 5),
  (gen_random_uuid(), 'Course Collector', 'Enroll in 10 different courses', 'multiple_courses', 'compass', 'green-500', 10);