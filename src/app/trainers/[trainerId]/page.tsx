import { db } from "~/server/db";
import { users, courses, slides } from "~/server/db/schema";
import { and, eq, count, desc } from "drizzle-orm";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Award,
  Book,
  Calendar,
  CheckCircle,
  Clock,
  ExternalLink,
  Facebook,
  Globe,
  Layers,
  Mail,
  MapPin,
  Star,
  Twitter,
  Users,
} from "lucide-react";

// Define types based on your schema
type TrainerWithStats = {
  id: string;
  name: string | null;
  email: string;
  bio: string | null;
  image: string | null;
  verificationStatus: string | null;
  username: string | null;
  createdAt: Date | null;
  socialLinks: Record<string, string> | null;
  stats: {
    totalCourses: number;
    publishedCourses: number;
    totalSlides: number;
    totalStudents: number;
    averageRating: number;
  };
  courses: {
    id: string;
    title: string;
    shortDescription: string | null;
    coverImageUrl: string | null;
    skillLevel: string | null;
    status: string; // Must be a string, not null
    createdAt: Date | null;
    stats: {
      students: number;
      rating: number;
    };
  }[];
};

// Fetch trainer with their complete stats
async function getTrainer(trainerId: string): Promise<TrainerWithStats | null> {
  try {
    // Get trainer
    const trainer = await db.query.users.findFirst({
      where: eq(users.id, trainerId),
    });

    if (!trainer || trainer.role !== "trainer") {
      return null;
    }

    // Get course counts
    const [courseCount] = await db
      .select({ count: count() })
      .from(courses)
      .where(eq(courses.trainerId, trainer.id));

    const [publishedCount] = await db
      .select({ count: count() })
      .from(courses)
      .where(
        and(eq(courses.trainerId, trainer.id), eq(courses.status, "published")),
      );

    const [slideCount] = await db
      .select({ count: count() })
      .from(slides)
      .innerJoin(courses, eq(slides.courseId, courses.id))
      .where(eq(courses.trainerId, trainer.id));

    // Get trainer's courses
    const trainerCourses = await db.query.courses.findMany({
      where: eq(courses.trainerId, trainer.id),
      orderBy: [desc(courses.createdAt)],
    });

    // Process courses with proper typing
    const coursesWithStats = await Promise.all(
      trainerCourses.map(async (course) => {
        // Ensure status is never null and convert rating to number
        return {
          id: course.id,
          title: course.title,
          shortDescription: course.shortDescription,
          coverImageUrl: course.coverImageUrl,
          skillLevel: course.skillLevel,
          status: course.status ?? "draft", // Ensure status is never null
          createdAt: course.createdAt,
          stats: {
            students: 0, // Will be replaced with real data in production
            rating: 0, // Will be replaced with real data in production
          },
        };
      }),
    );

    // Build trainer with stats
    return {
      ...trainer,
      socialLinks: trainer.socialLinks
        ? (trainer.socialLinks as Record<string, string>)
        : null,
      stats: {
        totalCourses: courseCount?.count ?? 0,
        publishedCourses: publishedCount?.count ?? 0,
        totalSlides: slideCount?.count ?? 0,
        totalStudents: 0, // Will be replaced with real data in production
        averageRating: 0, // Will be replaced with real data in production
      },
      courses: coursesWithStats,
    };
  } catch (error) {
    console.error("Error fetching trainer:", error);
    return null;
  }
}

export default async function TrainerProfilePage({
  params,
}: {
  params: { trainerId: string };
}) {
  const trainer = await getTrainer(params.trainerId);

  if (!trainer) {
    notFound();
  }

  // Format date for display
  const formattedJoinDate = trainer.createdAt
    ? new Intl.DateTimeFormat("en-US", {
        month: "long",
        year: "numeric",
      }).format(trainer.createdAt)
    : "Unknown date";

  // Parse social links or provide defaults
  const socialLinks = trainer.socialLinks ?? {};

  return (
    <main className="container mx-auto min-h-screen space-y-notion-xl px-4 py-notion-lg sm:px-6 lg:px-8">
      {/* Background grain effect */}
      <div className="fixed inset-0 z-[-1] bg-grain opacity-10"></div>

      {/* Header with trainer info */}
      <div className="relative animate-fade-in rounded-xl border border-notion-gray-light/20 bg-white p-8 shadow-notion dark:border-notion-gray-dark/30 dark:bg-notion-gray-dark/60">
        {/* Background pattern with grain effect */}
        <div className="absolute inset-0 rounded-xl bg-grain opacity-10"></div>

        <div className="relative z-10 flex flex-col gap-8 md:flex-row">
          {/* Profile image with verification badge */}
          <div className="relative">
            <div className="overflow-hidden rounded-full border-4 border-notion-pink/20 shadow-notion">
              {trainer.image ? (
                <div className="group relative h-32 w-32 overflow-hidden rounded-full transition-all duration-500 md:h-48 md:w-48">
                  <Image
                    src={trainer.image}
                    alt={trainer.name ?? "Trainer"}
                    width={192}
                    height={192}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
                </div>
              ) : (
                <div className="flex h-32 w-32 items-center justify-center rounded-full bg-notion-gray-light/30 transition-all duration-300 dark:bg-notion-gray-dark/50 md:h-48 md:w-48">
                  <Users className="h-16 w-16 text-notion-text-light/40 dark:text-notion-text-dark/40" />
                </div>
              )}
            </div>
            {/* Verification badge if verified */}
            {trainer.verificationStatus === "verified" && (
              <div className="absolute bottom-0 right-4 flex h-10 w-10 items-center justify-center rounded-full bg-notion-pink text-white shadow-lg md:right-6">
                <Award className="h-5 w-5" />
              </div>
            )}
          </div>

          {/* Trainer info */}
          <div className="flex-1 space-y-notion-md">
            <div>
              <h1 className="font-geist text-3xl font-semibold text-notion-text-light dark:text-notion-text-dark md:text-4xl">
                {trainer.name}
              </h1>
              <div className="mt-2 h-1 w-16 bg-notion-pink opacity-70 md:w-24"></div>
            </div>

            <p className="font-geist text-lg leading-relaxed text-notion-text-light/80 dark:text-notion-text-dark/80 md:max-w-2xl">
              {trainer.bio ?? "No bio available"}
            </p>

            <div className="flex flex-wrap gap-3 pt-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-notion-gray-light/30 px-4 py-1.5 font-geist text-sm text-notion-text-light/80 dark:bg-notion-gray-dark/40 dark:text-notion-text-dark/80">
                <MapPin className="h-4 w-4" />
                {trainer.username ?? "Trainer"}
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-notion-gray-light/30 px-4 py-1.5 font-geist text-sm text-notion-text-light/80 dark:bg-notion-gray-dark/40 dark:text-notion-text-dark/80">
                <Calendar className="h-4 w-4" />
                Joined {formattedJoinDate}
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-notion-accent-light/20 px-4 py-1.5 font-geist text-sm text-notion-accent-dark dark:bg-notion-accent-dark/30 dark:text-notion-accent-light">
                <Users className="h-4 w-4" />
                {trainer.stats.totalStudents.toLocaleString()} students
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-notion-pink-light/20 px-4 py-1.5 font-geist text-sm text-notion-pink-dark dark:bg-notion-pink-dark/30 dark:text-notion-pink-light">
                <Star className="h-4 w-4" />
                {trainer.stats.averageRating} rating
              </span>
            </div>

            {/* Social links */}
            <div className="flex flex-wrap gap-4 pt-2">
              {socialLinks.website && (
                <Link
                  href={socialLinks.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-notion-text-light/70 transition-colors hover:text-notion-pink dark:text-notion-text-dark/70 dark:hover:text-notion-pink-light"
                >
                  <Globe className="h-5 w-5" />
                  <span className="font-geist text-sm">Website</span>
                </Link>
              )}
              {socialLinks.twitter && (
                <Link
                  href={socialLinks.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-notion-text-light/70 transition-colors hover:text-notion-pink dark:text-notion-text-dark/70 dark:hover:text-notion-pink-light"
                >
                  <Twitter className="h-5 w-5" />
                  <span className="font-geist text-sm">Twitter</span>
                </Link>
              )}
              {socialLinks.facebook && (
                <Link
                  href={socialLinks.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-notion-text-light/70 transition-colors hover:text-notion-pink dark:text-notion-text-dark/70 dark:hover:text-notion-pink-light"
                >
                  <Facebook className="h-5 w-5" />
                  <span className="font-geist text-sm">Facebook</span>
                </Link>
              )}
              <Link
                href={`mailto:${trainer.email}`}
                className="inline-flex items-center gap-1.5 text-notion-text-light/70 transition-colors hover:text-notion-pink dark:text-notion-text-dark/70 dark:hover:text-notion-pink-light"
              >
                <Mail className="h-5 w-5" />
                <span className="font-geist text-sm">Email</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Stats cards */}
      <div className="grid animate-slide-up grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="group relative overflow-hidden rounded-xl border border-notion-gray-light/20 bg-white p-6 shadow-notion transition-all duration-300 hover:border-notion-pink hover:shadow-notion-hover dark:border-notion-gray-dark/30 dark:bg-notion-gray-dark/60 dark:hover:border-notion-pink-dark">
          <div className="absolute inset-0 bg-grain opacity-10"></div>
          <div className="relative z-10 flex flex-col items-center justify-center gap-2 text-center">
            <Book className="h-8 w-8 text-notion-pink/70 transition-transform duration-300 group-hover:scale-110 dark:text-notion-pink-light/70" />
            <span className="font-geist text-3xl font-semibold text-notion-text-light dark:text-notion-text-dark">
              {trainer.stats.totalCourses}
            </span>
            <span className="font-geist text-sm text-notion-text-light/70 dark:text-notion-text-dark/70">
              Total Courses
            </span>
          </div>
        </div>
        <div className="group relative overflow-hidden rounded-xl border border-notion-gray-light/20 bg-white p-6 shadow-notion transition-all duration-300 hover:border-notion-pink hover:shadow-notion-hover dark:border-notion-gray-dark/30 dark:bg-notion-gray-dark/60 dark:hover:border-notion-pink-dark">
          <div className="absolute inset-0 bg-grain opacity-10"></div>
          <div className="relative z-10 flex flex-col items-center justify-center gap-2 text-center">
            <CheckCircle className="h-8 w-8 text-notion-pink/70 transition-transform duration-300 group-hover:scale-110 dark:text-notion-pink-light/70" />
            <span className="font-geist text-3xl font-semibold text-notion-text-light dark:text-notion-text-dark">
              {trainer.stats.publishedCourses}
            </span>
            <span className="font-geist text-sm text-notion-text-light/70 dark:text-notion-text-dark/70">
              Published Courses
            </span>
          </div>
        </div>
        <div className="group relative overflow-hidden rounded-xl border border-notion-gray-light/20 bg-white p-6 shadow-notion transition-all duration-300 hover:border-notion-pink hover:shadow-notion-hover dark:border-notion-gray-dark/30 dark:bg-notion-gray-dark/60 dark:hover:border-notion-pink-dark">
          <div className="absolute inset-0 bg-grain opacity-10"></div>
          <div className="relative z-10 flex flex-col items-center justify-center gap-2 text-center">
            <Layers className="h-8 w-8 text-notion-pink/70 transition-transform duration-300 group-hover:scale-110 dark:text-notion-pink-light/70" />
            <span className="font-geist text-3xl font-semibold text-notion-text-light dark:text-notion-text-dark">
              {trainer.stats.totalSlides}
            </span>
            <span className="font-geist text-sm text-notion-text-light/70 dark:text-notion-text-dark/70">
              Total Slides
            </span>
          </div>
        </div>
        <div className="group relative overflow-hidden rounded-xl border border-notion-gray-light/20 bg-white p-6 shadow-notion transition-all duration-300 hover:border-notion-pink hover:shadow-notion-hover dark:border-notion-gray-dark/30 dark:bg-notion-gray-dark/60 dark:hover:border-notion-pink-dark">
          <div className="absolute inset-0 bg-grain opacity-10"></div>
          <div className="relative z-10 flex flex-col items-center justify-center gap-2 text-center">
            <Star className="h-8 w-8 text-notion-pink/70 transition-transform duration-300 group-hover:scale-110 dark:text-notion-pink-light/70" />
            <span className="font-geist text-3xl font-semibold text-notion-text-light dark:text-notion-text-dark">
              {trainer.stats.averageRating}
            </span>
            <span className="font-geist text-sm text-notion-text-light/70 dark:text-notion-text-dark/70">
              Average Rating
            </span>
          </div>
        </div>
      </div>

      {/* Courses Section */}
      <div>
        <h2 className="mb-6 font-geist text-2xl font-semibold text-notion-text-light dark:text-notion-text-dark">
          Courses by {trainer.name}
        </h2>

        {trainer.courses.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-4 rounded-xl border border-dashed border-notion-gray-light/30 bg-white py-12 text-center dark:border-notion-gray-dark/30 dark:bg-notion-gray-dark/60">
            <Book className="h-12 w-12 text-notion-text-light/30 dark:text-notion-text-dark/30" />
            <div>
              <h3 className="font-geist text-lg font-medium text-notion-text-light dark:text-notion-text-dark">
                No courses yet
              </h3>
              <p className="mt-1 font-geist text-sm text-notion-text-light/70 dark:text-notion-text-dark/70">
                This trainer hasn&apos;t published any courses yet
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
            <div className="lg:col-span-8">
              <div className="space-y-6">
                {trainer.courses.map((course) => (
                  <Link
                    href={`/courses/${course.id}/preview`}
                    key={course.id}
                    className="group block"
                  >
                    <div className="relative overflow-hidden rounded-xl border border-notion-gray-light/20 bg-white shadow-notion transition-all duration-300 hover:border-notion-pink hover:shadow-notion-hover dark:border-notion-gray-dark/30 dark:bg-notion-gray-dark/60 dark:hover:border-notion-pink-dark">
                      {/* Background pattern with grain effect */}
                      <div className="absolute inset-0 bg-grain opacity-10"></div>

                      {/* Animated glow effect on hover */}
                      <div className="pointer-events-none absolute -inset-1 z-0 rounded-xl bg-gradient-to-r from-notion-pink/20 via-notion-accent/20 to-notion-pink-dark/20 opacity-0 blur-xl transition-all duration-500 group-hover:opacity-70"></div>

                      <div className="relative z-10 flex flex-col gap-6 p-6 sm:flex-row">
                        {/* Course image or placeholder */}
                        <div className="relative h-40 w-full overflow-hidden rounded-lg sm:h-auto sm:w-40">
                          {course.coverImageUrl ? (
                            <div className="relative h-full w-full overflow-hidden rounded-lg">
                              <Image
                                src={course.coverImageUrl}
                                alt={course.title}
                                width={160}
                                height={160}
                                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
                            </div>
                          ) : (
                            <div className="flex h-full w-full items-center justify-center rounded-lg bg-notion-gray-light/30 dark:bg-notion-gray-dark/50">
                              <Book className="h-16 w-16 text-notion-text-light/40 dark:text-notion-text-dark/40" />
                            </div>
                          )}
                        </div>

                        {/* Course info */}
                        <div className="flex-1">
                          <h3 className="font-geist text-xl font-semibold text-notion-text-light transition-colors group-hover:text-notion-pink dark:text-notion-text-dark dark:group-hover:text-notion-pink-light">
                            {course.title}
                          </h3>
                          <p className="mt-2 font-geist text-notion-text-light/70 dark:text-notion-text-dark/70">
                            {course.shortDescription ??
                              "No description available"}
                          </p>
                          <div className="mt-4 flex flex-wrap gap-3">
                            <span className="inline-flex items-center gap-1 rounded-full bg-notion-gray-light/30 px-3 py-1 font-geist text-xs text-notion-text-light/80 dark:bg-notion-gray-dark/40 dark:text-notion-text-dark/80">
                              <Calendar className="mr-0.5 h-3 w-3" />
                              {course.createdAt
                                ? new Date(course.createdAt).toLocaleDateString(
                                    "en-US",
                                    {
                                      month: "long",
                                      day: "numeric",
                                      year: "numeric",
                                    },
                                  )
                                : "Unknown date"}
                            </span>
                            <span className="inline-flex items-center gap-1 rounded-full bg-notion-gray-light/30 px-3 py-1 font-geist text-xs text-notion-text-light/80 dark:bg-notion-gray-dark/40 dark:text-notion-text-dark/80">
                              <Clock className="mr-0.5 h-3 w-3" />
                              {course.skillLevel ?? "All levels"}
                            </span>
                            <span className="inline-flex items-center gap-1 rounded-full bg-notion-accent-light/20 px-3 py-1 font-geist text-xs text-notion-accent-dark dark:bg-notion-accent-dark/30 dark:text-notion-accent-light">
                              <Users className="mr-0.5 h-3 w-3" />
                              {course.stats.students} students
                            </span>
                            <span className="inline-flex items-center gap-1 rounded-full bg-notion-pink-light/20 px-3 py-1 font-geist text-xs text-notion-pink-dark dark:bg-notion-pink-dark/30 dark:text-notion-pink-light">
                              <Star className="mr-0.5 h-3 w-3" />
                              {course.stats.rating} rating
                            </span>
                          </div>
                        </div>

                        {/* View course button/icon */}
                        <div className="flex items-center justify-center">
                          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-notion-pink/10 text-notion-pink transition-all duration-300 group-hover:bg-notion-pink group-hover:text-white dark:bg-notion-pink-dark/20 dark:text-notion-pink-light dark:group-hover:bg-notion-pink-dark dark:group-hover:text-white">
                            <ExternalLink className="h-5 w-5" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Contact sidebar */}
            <div className="mt-8 lg:col-span-4 lg:mt-0">
              <div className="sticky top-8 rounded-xl border border-notion-gray-light/20 bg-white p-6 shadow-notion dark:border-notion-gray-dark/30 dark:bg-notion-gray-dark/60">
                <div className="absolute inset-0 rounded-xl bg-grain opacity-10"></div>
                <div className="relative z-10">
                  <h3 className="font-geist text-xl font-semibold text-notion-text-light dark:text-notion-text-dark">
                    Contact
                  </h3>
                  <div className="mt-4 space-y-3">
                    <Link
                      href={`mailto:${trainer.email}`}
                      className="flex items-center gap-2 text-notion-text-light/70 transition-colors hover:text-notion-pink dark:text-notion-text-dark/70 dark:hover:text-notion-pink-light"
                    >
                      <Mail className="h-5 w-5" />
                      <span className="font-geist text-sm">
                        {trainer.email}
                      </span>
                    </Link>
                    {socialLinks.website && (
                      <Link
                        href={socialLinks.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-notion-text-light/70 transition-colors hover:text-notion-pink dark:text-notion-text-dark/70 dark:hover:text-notion-pink-light"
                      >
                        <Globe className="h-5 w-5" />
                        <span className="font-geist text-sm">Website</span>
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* About Section */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        <div className="lg:col-span-8">
          <h2 className="mb-6 font-geist text-2xl font-semibold text-notion-text-light dark:text-notion-text-dark">
            About {trainer.name}
          </h2>
          <div className="relative rounded-xl border border-notion-gray-light/20 bg-white p-6 shadow-notion dark:border-notion-gray-dark/30 dark:bg-notion-gray-dark/60">
            <div className="absolute inset-0 rounded-xl bg-grain opacity-10"></div>
            <div className="relative">
              <p className="font-geist leading-relaxed text-notion-text-light/90 dark:text-notion-text-dark/90">
                {trainer.bio ?? "No bio available for this trainer yet."}
              </p>

              <h3 className="mt-8 font-geist text-xl font-semibold text-notion-text-light dark:text-notion-text-dark">
                Course Statistics
              </h3>
              <div className="mt-4 space-y-2">
                <div className="flex items-center justify-between border-b border-notion-gray-light/20 pb-2 dark:border-notion-gray-dark/30">
                  <span className="font-geist text-notion-text-light/80 dark:text-notion-text-dark/80">
                    Total Courses
                  </span>
                  <span className="font-geist font-medium text-notion-text-light dark:text-notion-text-dark">
                    {trainer.stats.totalCourses}
                  </span>
                </div>
                <div className="flex items-center justify-between border-b border-notion-gray-light/20 pb-2 dark:border-notion-gray-dark/30">
                  <span className="font-geist text-notion-text-light/80 dark:text-notion-text-dark/80">
                    Published Courses
                  </span>
                  <span className="font-geist font-medium text-notion-text-light dark:text-notion-text-dark">
                    {trainer.stats.publishedCourses}
                  </span>
                </div>
                <div className="flex items-center justify-between border-b border-notion-gray-light/20 pb-2 dark:border-notion-gray-dark/30">
                  <span className="font-geist text-notion-text-light/80 dark:text-notion-text-dark/80">
                    Total Slides
                  </span>
                  <span className="font-geist font-medium text-notion-text-light dark:text-notion-text-dark">
                    {trainer.stats.totalSlides}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-geist text-notion-text-light/80 dark:text-notion-text-dark/80">
                    Average Rating
                  </span>
                  <span className="font-geist font-medium text-notion-text-light dark:text-notion-text-dark">
                    {trainer.stats.averageRating} / 5
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Contact info sidebar */}
        <div className="mt-8 lg:col-span-4 lg:mt-0">
          <div className="sticky top-8 space-y-6">
            <div className="relative rounded-xl border border-notion-gray-light/20 bg-white p-6 shadow-notion dark:border-notion-gray-dark/30 dark:bg-notion-gray-dark/60">
              <div className="absolute inset-0 rounded-xl bg-grain opacity-10"></div>
              <div className="relative z-10">
                <h3 className="font-geist text-xl font-semibold text-notion-text-light dark:text-notion-text-dark">
                  Skill Level
                </h3>
                <div className="mt-4">
                  <div className="h-2 w-full rounded-full bg-notion-gray-light/30 dark:bg-notion-gray-dark/40">
                    <div
                      className="h-2 rounded-full bg-notion-pink dark:bg-notion-pink-dark"
                      style={{
                        width: `${Math.min(trainer.stats.totalCourses * 10, 100)}%`,
                      }}
                    ></div>
                  </div>
                  <div className="mt-2 flex justify-between">
                    <span className="font-geist text-xs text-notion-text-light/70 dark:text-notion-text-dark/70">
                      Beginner
                    </span>
                    <span className="font-geist text-xs text-notion-text-light/70 dark:text-notion-text-dark/70">
                      Advanced
                    </span>
                  </div>
                </div>

                <div className="mt-6">
                  <h4 className="font-geist text-sm font-medium text-notion-text-light dark:text-notion-text-dark">
                    Join a course today
                  </h4>
                  <p className="mt-1 font-geist text-xs text-notion-text-light/70 dark:text-notion-text-dark/70">
                    Enhance your digital skills with expert-led courses
                  </p>
                  <div className="mt-3">
                    <Link
                      href="/courses"
                      className="block w-full rounded-lg border border-notion-pink/30 bg-notion-pink/10 py-2 text-center font-geist text-sm font-medium text-notion-pink hover:bg-notion-pink/20 dark:border-notion-pink-dark/30 dark:bg-notion-pink-dark/10 dark:text-notion-pink-light dark:hover:bg-notion-pink-dark/20"
                    >
                      Browse All Courses
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
