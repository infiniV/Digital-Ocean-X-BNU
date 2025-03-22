// Dashboard statistics types
export interface DashboardStats {
  totalUsers: number;
  totalTrainers: number;
  totalTrainees: number;
  totalCourses: number;
  totalPublishedCourses: number;
  totalEnrollments: number;
  totalCompletions: number;
  totalSlides: number;
}

// Growth statistics types
export interface PeriodData {
  period: string;
}

export interface UserGrowthData extends PeriodData {
  new_users: number;
  new_trainees: number;
  new_trainers: number;
}

export interface CourseGrowthData extends PeriodData {
  new_courses: number;
  published_courses: number;
}

export interface EnrollmentGrowthData extends PeriodData {
  new_enrollments: number;
  new_completions: number;
}

export interface GrowthStats {
  userGrowth: UserGrowthData[];
  courseGrowth: CourseGrowthData[];
  enrollmentGrowth: EnrollmentGrowthData[];
}

// Engagement statistics types
export interface CourseCompletionData {
  course_id: string;
  title: string;
  total: number;
  completed: number;
  completion_rate: number;
}

export interface AchievementStatsData {
  id: string;
  title: string;
  type: string;
  total_earners: number;
  average_progress: number;
}

export interface ActivityStatsData {
  median_notes: number;
  median_streak: number;
  median_slides_completed: number;
  average_notes: number;
  average_streak: number;
  average_slides_completed: number;
  max_streak: number;
}

export interface DailyActivityData {
  date: string;
  slides_viewed: number;
  notes_created: number;
}

export interface EngagementStats {
  courseCompletion: CourseCompletionData[];
  achievements: AchievementStatsData[];
  activity: ActivityStatsData;
  dailyActivity: DailyActivityData[];
}