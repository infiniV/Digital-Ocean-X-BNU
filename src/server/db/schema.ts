import { relations } from "drizzle-orm";
import {
  index,
  integer,
  jsonb,
  pgEnum,
  pgTableCreator,
  primaryKey,
  text,
  timestamp,
  varchar,
  boolean,
} from "drizzle-orm/pg-core";
import { type AdapterAccount } from "next-auth/adapters";

export const createTable = pgTableCreator((name) => `womn-empr_${name}`);

// Define all enums first
export const roleEnum = pgEnum("user_role", ["trainee", "trainer", "admin"]);
export const verificationStatusEnum = pgEnum("verification_status", [
  "pending",
  "approved",
  "rejected",
]);
export const courseStatusEnum = pgEnum("course_status", [
  "draft",
  "published",
  "archived",
]);
export const skillLevelEnum = pgEnum("skill_level", [
  "beginner",
  "intermediate",
  "advanced",
]);
export const contentTypeEnum = pgEnum("content_type", [
  "slides",
  "video",
  "pdf",
  "text",
  "quiz",
  "assignment",
]);

// Define enrollment status enum
export const enrollmentStatusEnum = pgEnum("enrollment_status", [
  "active",
  "completed",
  "dropped",
  "pending",
]);

// Core tables
export const users = createTable("user", {
  id: varchar("id", { length: 255 })
    .notNull()
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: varchar("name", { length: 255 }),
  email: varchar("email", { length: 255 }).notNull(),
  emailVerified: timestamp("email_verified", {
    mode: "date",
    withTimezone: true,
  }),
  image: varchar("image", { length: 255 }),
  role: roleEnum("role").default("trainee"),
  bio: text("bio"),
  skills: jsonb("skills"),
  socialLinks: jsonb("social_links"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

// Add the missing courses table
export const courses = createTable("course", {
  id: varchar("id", { length: 255 })
    .notNull()
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  title: varchar("title", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  shortDescription: text("short_description"),
  description: text("description"),
  coverImageUrl: varchar("cover_image_url", { length: 255 }),
  skillLevel: skillLevelEnum("skill_level").default("beginner"),
  status: courseStatusEnum("status").default("draft"),
  trainerId: varchar("trainer_id", { length: 255 })
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  isFeatured: boolean("is_featured").default(false),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

// Add slides table to track uploaded slide content
export const slides = createTable("slide", {
  id: varchar("id", { length: 255 })
    .notNull()
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  courseId: varchar("course_id", { length: 255 })
    .notNull()
    .references(() => courses.id, { onDelete: "cascade" }),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  fileUrl: varchar("file_url", { length: 1024 }).notNull(),
  fileType: varchar("file_type", { length: 50 }).notNull(), // pdf, ppt, image
  originalFilename: varchar("original_filename", { length: 255 }),
  order: integer("order").default(0),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

// Add enrollments table
export const enrollments = createTable(
  "enrollment",
  {
    id: varchar("id", { length: 255 })
      .notNull()
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    courseId: varchar("course_id", { length: 255 })
      .notNull()
      .references(() => courses.id, { onDelete: "cascade" }),
    traineeId: varchar("trainee_id", { length: 255 })
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    status: enrollmentStatusEnum("status").default("active"),
    progress: integer("progress").default(0),
    enrolledAt: timestamp("enrolled_at", { withTimezone: true }).defaultNow(),
    completedAt: timestamp("completed_at", { withTimezone: true }),
    lastAccessedAt: timestamp("last_accessed_at", { withTimezone: true }),
  },
  (enrollment) => ({
    courseTraineeIdx: index("enrollment_course_trainee_idx").on(
      enrollment.courseId,
      enrollment.traineeId,
    ),
    traineeIdx: index("enrollment_trainee_idx").on(enrollment.traineeId),
    courseIdx: index("enrollment_course_idx").on(enrollment.courseId),
  }),
);

// Add notes table
export const notes = createTable("note", {
  id: varchar("id", { length: 255 })
    .notNull()
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  content: text("content").notNull(),
  slideId: varchar("slideId", { length: 255 })
    .notNull()
    .references(() => slides.id, { onDelete: "cascade" }),
  traineeId: varchar("trainee_id", { length: 255 })
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

// Add slide_progress table for tracking individual slide completion
export const slideProgress = createTable(
  "slide_progress",
  {
    id: varchar("id", { length: 255 })
      .notNull()
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    slideId: varchar("slide_id", { length: 255 })
      .notNull()
      .references(() => slides.id, { onDelete: "cascade" }),
    traineeId: varchar("trainee_id", { length: 255 })
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    completed: boolean("completed").default(false),
    completedAt: timestamp("completed_at", { withTimezone: true }),
  },
  (progress) => ({
    slideTraineeIdx: index("slide_progress_slide_trainee_idx").on(
      progress.slideId,
      progress.traineeId,
    ),
    traineeIdx: index("slide_progress_trainee_idx").on(progress.traineeId),
    slideIdx: index("slide_progress_slide_idx").on(progress.slideId),
  }),
);

// NextAuth required tables
export const accounts = createTable(
  "account",
  {
    userId: varchar("user_id", { length: 255 })
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: varchar("type", { length: 255 })
      .$type<AdapterAccount["type"]>()
      .notNull(),
    provider: varchar("provider", { length: 255 }).notNull(),
    providerAccountId: varchar("provider_account_id", {
      length: 255,
    }).notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: varchar("token_type", { length: 255 }),
    scope: varchar("scope", { length: 255 }),
    id_token: text("id_token"),
    session_state: varchar("session_state", { length: 255 }),
  },
  (account) => ({
    compoundKey: primaryKey({
      columns: [account.provider, account.providerAccountId],
    }),
    userIdIdx: index("account_user_id_idx").on(account.userId),
  }),
);

export const sessions = createTable(
  "session",
  {
    sessionToken: varchar("session_token", { length: 255 })
      .notNull()
      .primaryKey(),
    userId: varchar("user_id", { length: 255 })
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    expires: timestamp("expires", {
      mode: "date",
      withTimezone: true,
    }).notNull(),
  },
  (session) => ({
    userIdIdx: index("session_user_id_idx").on(session.userId),
  }),
);

export const verificationTokens = createTable(
  "verification_token",
  {
    identifier: varchar("identifier", { length: 255 }).notNull(),
    token: varchar("token", { length: 255 }).notNull(),
    expires: timestamp("expires", {
      mode: "date",
      withTimezone: true,
    }).notNull(),
  },
  (vt) => ({
    compoundKey: primaryKey({ columns: [vt.identifier, vt.token] }),
  }),
);

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  accounts: many(accounts),
  sessions: many(sessions),
  courses: many(courses),
  enrollments: many(enrollments, { relationName: "traineeEnrollments" }),
}));

export const coursesRelations = relations(courses, ({ one, many }) => ({
  trainer: one(users, { fields: [courses.trainerId], references: [users.id] }),
  slides: many(slides),
  enrollments: many(enrollments),
}));

export const slidesRelations = relations(slides, ({ one }) => ({
  course: one(courses, { fields: [slides.courseId], references: [courses.id] }),
}));

export const enrollmentsRelations = relations(enrollments, ({ one }) => ({
  course: one(courses, {
    fields: [enrollments.courseId],
    references: [courses.id],
  }),
  trainee: one(users, {
    fields: [enrollments.traineeId],
    references: [users.id],
  }),
}));

export const accountsRelations = relations(accounts, ({ one }) => ({
  user: one(users, { fields: [accounts.userId], references: [users.id] }),
}));

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, { fields: [sessions.userId], references: [users.id] }),
}));

// Add notes relations
export const notesRelations = relations(notes, ({ one }) => ({
  slide: one(slides, { fields: [notes.slideId], references: [slides.id] }),
  trainee: one(users, { fields: [notes.traineeId], references: [users.id] }),
}));

// Add slide_progress relations
export const slideProgressRelations = relations(slideProgress, ({ one }) => ({
  slide: one(slides, {
    fields: [slideProgress.slideId],
    references: [slides.id],
  }),
  trainee: one(users, {
    fields: [slideProgress.traineeId],
    references: [users.id],
  }),
}));
