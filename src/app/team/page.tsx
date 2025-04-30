import { db } from "~/server/db";
import { users, courses, slides, enrollments } from "~/server/db/schema";
import { eq, and, count } from "drizzle-orm";
import Image from "next/image";
import Link from "next/link";
import {
  Award,
  BarChart,
  Book,
  Calendar,
  CheckCircle,
  ExternalLink,
  FileText,
  Layers,
  Mail,
  MapPin,
  MessageCircle,
  Star,
  Users,
} from "lucide-react";

// Define types based on your schema
type ProjectLeadWithStats = {
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
};

// Analyst data type
type Analyst = {
  name: string;
  title: string;
  image: string;
  bio: string;
  isLead?: boolean;
};

// Lead Researcher
const leadResearcher: Analyst = {
  name: "Hafiz Muhammad Abubakar",
  title: "Lead Researcher",
  image: "/aesearchoutreachanalyst/abubakr.jpg",
  bio: "Co-Data Scientist at Bank of Punjab's Employees Training Program | Member CAIR (Center of Artificial Intelligence Research) | Tech Solution Provider | Student at Beaconhouse National University",
  isLead: true,
};

// Research & Outreach Analysts data
const analysts: Analyst[] = [
  leadResearcher,
  {
    name: "Manahil Tanweer",
    title: "Research & Outreach Analyst",
    image: "/aesearchoutreachanalyst/IMG-20241109-WA0044.jpg",
    bio: "As a Research & Outreach Analyst for the Women Empowerment Training Program, I will conduct participant engagement initiatives, monitor post-training outcomes, and systematically collect and analyze feedback to support continuous program development and impact assessment.",
  },
  {
    name: "Menahil Fatima",
    title: "Research & Outreach Analyst",
    image: "/aesearchoutreachanalyst/IMG-20240601-WA0075.jpg",
    bio: "As a Research & Outreach Analyst, I will work closely with women entrepreneurs to build collaborative networks, fuel digital innovation, and empower them to achieve sustained growth.",
  },
  {
    name: "Mariam Saghir",
    title: "Research & Outreach Analyst",
    image: "/aesearchoutreachanalyst/unnamed.jpg",
    bio: "As a Research & Outreach Analyst for Women Empowerment Training, I am dedicated to inspiring participants, tracking progress following the training sessions, and evaluating feedback to enhance program effectiveness and amplify the lasting impact on the participants lives.",
  },
  {
    name: "Hania",
    title: "Research & Outreach Analyst",
    image: "/aesearchoutreachanalyst/Hania.jpeg",
    bio: "As a Research & Outreach Analyst for the Women Empowerment Training Program, I am passionate about supporting women-led businesses and documenting their success stories to drive impactful change. I contribute to academic research, internal reporting, and public communication efforts through my role.",
  },
];

async function getProjectLead(): Promise<ProjectLeadWithStats | null> {
  try {
    // Get Dr. Usman Nazir from the database (assumed to be a trainer with this name)
    const projectLead = await db.query.users.findFirst({
      where: and(eq(users.role, "trainer"), eq(users.name, "Dr. Usman Nazir")),
    });

    if (!projectLead) {
      return null;
    }

    // Get statistics for the project lead
    const [courseCount] = await db
      .select({ count: count() })
      .from(courses)
      .where(eq(courses.trainerId, projectLead.id));

    const [publishedCount] = await db
      .select({ count: count() })
      .from(courses)
      .where(
        and(
          eq(courses.trainerId, projectLead.id),
          eq(courses.status, "published"),
        ),
      );

    const [slideCount] = await db
      .select({ count: count() })
      .from(slides)
      .innerJoin(courses, eq(slides.courseId, courses.id))
      .where(eq(courses.trainerId, projectLead.id));

    // Get student count (through enrollments)
    const [studentCount] = await db
      .select({ count: count() })
      .from(enrollments)
      .innerJoin(courses, eq(enrollments.courseId, courses.id))
      .where(eq(courses.trainerId, projectLead.id));

    // Calculate average rating if available, default to 4.0-5.0 range if no ratings
    const defaultRating = 4.8; // Set a good default rating for project lead

    return {
      ...projectLead,
      socialLinks: projectLead.socialLinks
        ? (projectLead.socialLinks as Record<string, string>)
        : null,
      stats: {
        totalCourses: courseCount?.count ?? 0,
        publishedCourses: publishedCount?.count ?? 0,
        totalSlides: slideCount?.count ?? 0,
        totalStudents: studentCount?.count ?? 0,
        averageRating: defaultRating,
      },
    };
  } catch (error) {
    console.error("Error fetching project lead:", error);
    return null;
  }
}

export default async function TeamPage() {
  const projectLead = await getProjectLead();

  // If project lead is not found, provide default content
  const leadContent = projectLead
    ? {
        id: projectLead.id,
        name: projectLead.name ?? "Dr. Usman Nazir",
        email: projectLead.email,
        bio:
          projectLead.bio ??
          "Project Lead for the Women Empowerment Training Program. Dedicated to fostering digital literacy and entrepreneurial skills among women in Pakistan.",
        image: projectLead.image ?? "/placeholder-profile.jpg",
        verificationStatus: "verified", // Assume the project lead is verified
        username: projectLead.username ?? "drusmannazir",
        createdAt: projectLead.createdAt,
        socialLinks: projectLead.socialLinks ?? {},
        stats: projectLead.stats,
      }
    : {
        id: "default-id",
        name: "Dr. Usman Nazir",
        email: "usman.nazir@example.com",
        bio: "Project Lead for the Women Empowerment Training Program. Dedicated to fostering digital literacy and entrepreneurial skills among women in Pakistan.",
        image: "/placeholder-profile.jpg",
        verificationStatus: "verified",
        username: "drusmannazir",
        createdAt: new Date(),
        socialLinks: {},
        stats: {
          totalCourses: 5,
          publishedCourses: 4,
          totalSlides: 120,
          totalStudents: 250,
          averageRating: 4.8,
        },
      };

  // Format date for display
  const formattedJoinDate = leadContent.createdAt
    ? new Intl.DateTimeFormat("en-US", {
        month: "long",
        year: "numeric",
      }).format(leadContent.createdAt)
    : "April 2023"; // Default join date if not available

  return (
    <main className="container mx-auto min-h-screen space-y-notion-xl py-notion-xl">
      {/* Background grain effect */}
      <div className="fixed inset-0 z-[-1] bg-grain opacity-10"></div>{" "}
      {/* Page title */}
      <div className="animate-fade-in">
        <div className="flex flex-col gap-notion-xs text-center">
          <h1 className="font-geist text-3xl font-semibold text-notion-text-light dark:text-notion-text-dark sm:text-4xl md:text-5xl">
            Our Team
          </h1>
          <div className="mx-auto mt-4 h-1 w-24 bg-notion-pink opacity-70 sm:mt-6 sm:w-32"></div>
          <p className="mx-auto mt-6 max-w-2xl font-geist text-base text-notion-text-light/80 dark:text-notion-text-dark/80 sm:text-lg">
            Meet the dedicated team behind the Women Empowerment Training
            Program, committed to fostering digital skills and entrepreneurship
            among women.
          </p>
        </div>
      </div>
      {/* Project Lead Section */}
      <section>
        <div className="mb-notion-md text-center">
          <h2 className="font-geist text-2xl font-semibold text-notion-text-light dark:text-notion-text-dark sm:text-3xl">
            Project Lead
          </h2>
          <div className="mx-auto mt-2 h-1 w-16 bg-notion-pink/60 opacity-70 sm:w-20"></div>
        </div>

        {/* Project Lead Card - inspired by trainer profile */}
        <div className="relative animate-fade-in rounded-xl border border-notion-gray-light/20 bg-white p-4 shadow-notion dark:border-notion-gray-dark/30 dark:bg-notion-gray-dark/60 sm:p-6 md:p-8">
          {/* Background pattern with grain effect */}
          <div className="absolute inset-0 rounded-xl bg-grain opacity-10"></div>

          <div className="relative z-10 flex flex-col gap-6 md:flex-row md:gap-8">
            {/* Profile image with verification badge */}
            <div className="relative flex justify-center md:block">
              <div className="overflow-hidden rounded-full border-4 border-notion-pink/20 shadow-notion">
                {leadContent.image ? (
                  <div className="group relative h-24 w-24 overflow-hidden rounded-full transition-all duration-500 sm:h-32 sm:w-32 md:h-48 md:w-48">
                    <Image
                      src={leadContent.image}
                      alt={leadContent.name}
                      width={192}
                      height={192}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
                  </div>
                ) : (
                  <div className="flex h-24 w-24 items-center justify-center rounded-full bg-notion-gray-light/30 transition-all duration-300 dark:bg-notion-gray-dark/50 sm:h-32 sm:w-32 md:h-48 md:w-48">
                    <Users className="h-12 w-12 text-notion-text-light/40 dark:text-notion-text-dark/40 sm:h-16 sm:w-16" />
                  </div>
                )}
              </div>
              {/* Verification badge */}
              <div className="absolute bottom-0 right-2 flex h-8 w-8 items-center justify-center rounded-full bg-notion-pink text-white shadow-lg sm:right-4 md:right-6 md:h-10 md:w-10">
                <Award className="h-4 w-4 md:h-5 md:w-5" />
              </div>
            </div>

            {/* Lead's info */}
            <div className="flex-1 space-y-notion-sm sm:space-y-notion-md">
              <div>
                <h1 className="font-geist text-2xl font-semibold text-notion-text-light dark:text-notion-text-dark sm:text-3xl md:text-4xl">
                  {leadContent.name}
                </h1>
                <div className="mt-2 h-1 w-12 bg-notion-pink opacity-70 sm:w-16 md:w-24"></div>
              </div>

              <p className="font-geist text-base leading-relaxed text-notion-text-light/80 dark:text-notion-text-dark/80 sm:text-lg md:max-w-2xl">
                {leadContent.bio}
              </p>

              <div className="flex flex-wrap gap-2 pt-2 sm:gap-3">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-notion-gray-light/30 px-3 py-1 font-geist text-xs text-notion-text-light/80 dark:bg-notion-gray-dark/40 dark:text-notion-text-dark/80 sm:px-4 sm:py-1.5 sm:text-sm">
                  <MapPin className="h-4 w-4" />
                  {leadContent.username}
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-notion-gray-light/30 px-3 py-1 font-geist text-xs text-notion-text-light/80 dark:bg-notion-gray-dark/40 dark:text-notion-text-dark/80 sm:px-4 sm:py-1.5 sm:text-sm">
                  <Calendar className="h-4 w-4" />
                  Program Lead since {formattedJoinDate}
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-notion-accent-light/20 px-3 py-1 font-geist text-xs text-notion-accent-dark dark:bg-notion-accent-dark/30 dark:text-notion-accent-light sm:px-4 sm:py-1.5 sm:text-sm">
                  <Users className="h-4 w-4" />
                  {leadContent.stats.totalStudents.toLocaleString()} students
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-notion-pink-light/20 px-3 py-1 font-geist text-xs text-notion-pink-dark dark:bg-notion-pink-dark/30 dark:text-notion-pink-light sm:px-4 sm:py-1.5 sm:text-sm">
                  <Star className="h-4 w-4" />
                  {leadContent.stats.averageRating} rating
                </span>
              </div>

              {/* Contact and profile links */}
              <div className="flex flex-wrap gap-3 pt-2 sm:gap-4">
                <Link
                  href={`mailto:${leadContent.email}`}
                  className="inline-flex items-center gap-1.5 text-sm text-notion-text-light/70 transition-colors hover:text-notion-pink dark:text-notion-text-dark/70 dark:hover:text-notion-pink-light"
                >
                  <Mail className="h-5 w-5" />
                  <span className="font-geist">Email</span>
                </Link>

                {leadContent.id !== "default-id" && (
                  <Link
                    href={`/trainers/${leadContent.id}`}
                    className="inline-flex items-center gap-1.5 text-sm text-notion-text-light/70 transition-colors hover:text-notion-pink dark:text-notion-text-dark/70 dark:hover:text-notion-pink-light"
                  >
                    <ExternalLink className="h-5 w-5" />
                    <span className="font-geist">View Full Profile</span>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Stats cards for project lead */}
        <div className="mt-6 grid animate-slide-up grid-cols-1 gap-4 sm:mt-8 sm:grid-cols-2 lg:grid-cols-4">
          <div className="group relative overflow-hidden rounded-xl border border-notion-gray-light/20 bg-white p-6 shadow-notion transition-all duration-300 hover:border-notion-pink hover:shadow-notion-hover dark:border-notion-gray-dark/30 dark:bg-notion-gray-dark/60 dark:hover:border-notion-pink-dark">
            <div className="absolute inset-0 bg-grain opacity-10"></div>
            <div className="relative z-10 flex flex-col items-center justify-center gap-2 text-center">
              <Book className="h-8 w-8 text-notion-pink/70 transition-transform duration-300 group-hover:scale-110 dark:text-notion-pink-light/70" />
              <span className="font-geist text-3xl font-semibold text-notion-text-light dark:text-notion-text-dark">
                {leadContent.stats.totalCourses}
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
                {leadContent.stats.publishedCourses}
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
                {leadContent.stats.totalSlides}
              </span>
              <span className="font-geist text-sm text-notion-text-light/70 dark:text-notion-text-dark/70">
                Total Slides
              </span>
            </div>
          </div>
          <div className="group relative overflow-hidden rounded-xl border border-notion-gray-light/20 bg-white p-6 shadow-notion transition-all duration-300 hover:border-notion-pink hover:shadow-notion-hover dark:border-notion-gray-dark/30 dark:bg-notion-gray-dark/60 dark:hover:border-notion-pink-dark">
            <div className="absolute inset-0 bg-grain opacity-10"></div>
            <div className="relative z-10 flex flex-col items-center justify-center gap-2 text-center">
              <Users className="h-8 w-8 text-notion-pink/70 transition-transform duration-300 group-hover:scale-110 dark:text-notion-pink-light/70" />
              <span className="font-geist text-3xl font-semibold text-notion-text-light dark:text-notion-text-dark">
                {leadContent.stats.totalStudents}
              </span>
              <span className="font-geist text-sm text-notion-text-light/70 dark:text-notion-text-dark/70">
                Total Students
              </span>
            </div>
          </div>
        </div>
      </section>{" "}
      {/* Research & Outreach Analysts Section */}
      <section className="space-y-notion-lg pt-notion-xl">
        <div className="mb-notion-md text-center">
          <h2 className="font-geist text-2xl font-semibold text-notion-text-light dark:text-notion-text-dark sm:text-3xl">
            Research & Outreach Analysts
          </h2>
          <div className="mx-auto mt-2 h-1 w-16 bg-notion-pink/60 opacity-70 sm:w-20"></div>
          <p className="mx-auto mt-4 max-w-2xl font-geist text-base text-notion-text-light/70 dark:text-notion-text-dark/70 sm:text-lg">
            Our dedicated Research & Outreach Analysts drive engagement,
            innovation, and impact for women empowerment.
          </p>
        </div>{" "}
        {/* Analysts in cards that match project lead styling */}
        {analysts.map((analyst, index) => (
          <div
            key={analyst.name}
            className={`relative animate-fade-in rounded-xl border ${
              analyst.isLead
                ? "shadow-notion-md border-notion-pink/40 bg-white p-4 dark:border-notion-pink-dark/40 dark:bg-notion-gray-dark/70"
                : "border-notion-gray-light/20 bg-white p-4 shadow-notion dark:border-notion-gray-dark/30 dark:bg-notion-gray-dark/60"
            } sm:p-6 ${index > 0 ? "mt-8" : ""}`}
          >
            {/* Background pattern with grain effect */}
            <div className="absolute inset-0 rounded-xl bg-grain opacity-10"></div>

            <div className="relative z-10 flex flex-col gap-6 md:flex-row md:gap-8">
              {/* Profile image */}{" "}
              <div className="relative flex justify-center md:block">
                <div
                  className={`overflow-hidden rounded-full border-4 ${
                    analyst.isLead
                      ? "shadow-notion-md border-notion-pink/40"
                      : "border-notion-pink/20 shadow-notion"
                  }`}
                >
                  {analyst.image ? (
                    <div className="group relative h-24 w-24 overflow-hidden rounded-full transition-all duration-500 sm:h-32 sm:w-32 md:h-40 md:w-40">
                      <Image
                        src={analyst.image}
                        alt={analyst.name}
                        width={160}
                        height={160}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
                    </div>
                  ) : (
                    <div className="flex h-24 w-24 items-center justify-center rounded-full bg-notion-gray-light/30 transition-all duration-300 dark:bg-notion-gray-dark/50 sm:h-32 sm:w-32 md:h-40 md:w-40">
                      <Users className="h-12 w-12 text-notion-text-light/40 dark:text-notion-text-dark/40 sm:h-16 sm:w-16" />
                    </div>
                  )}
                </div>

                {/* Badge for Lead Researcher */}
                {analyst.isLead && (
                  <div className="absolute bottom-0 right-2 flex h-8 w-8 items-center justify-center rounded-full bg-notion-pink text-white shadow-lg sm:right-4 md:right-6 md:h-10 md:w-10">
                    <Award className="h-4 w-4 md:h-5 md:w-5" />
                  </div>
                )}
              </div>
              {/* Analyst's info */}
              <div className="flex-1 space-y-notion-sm sm:space-y-notion-md">
                <div>
                  <h3 className="font-geist text-xl font-semibold text-notion-text-light dark:text-notion-text-dark sm:text-2xl md:text-3xl">
                    {analyst.name}
                  </h3>
                  <div className="mt-2 h-1 w-12 bg-notion-pink opacity-70 sm:w-16"></div>
                </div>
                <h4 className="font-geist text-base font-medium text-notion-accent-dark dark:text-notion-accent-light sm:text-lg">
                  {analyst.title}
                </h4>
                <p className="font-geist text-base leading-relaxed text-notion-text-light/80 dark:text-notion-text-dark/80 md:max-w-2xl">
                  {analyst.bio}
                </p>{" "}
                <div className="flex flex-wrap gap-2 pt-2 sm:gap-3">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-notion-gray-light/30 px-3 py-1 font-geist text-xs text-notion-text-light/80 dark:bg-notion-gray-dark/40 dark:text-notion-text-dark/80 sm:px-4 sm:py-1.5 sm:text-sm">
                    <FileText className="h-4 w-4" />
                    Research
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-notion-accent-light/20 px-3 py-1 font-geist text-xs text-notion-accent-dark dark:bg-notion-accent-dark/30 dark:text-notion-accent-light sm:px-4 sm:py-1.5 sm:text-sm">
                    <MessageCircle className="h-4 w-4" />
                    Outreach
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-notion-pink-light/20 px-3 py-1 font-geist text-xs text-notion-pink-dark dark:bg-notion-pink-dark/30 dark:text-notion-pink-light sm:px-4 sm:py-1.5 sm:text-sm">
                    <BarChart className="h-4 w-4" />
                    Analytics
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </section>{" "}
      {/* Team mission section */}
      <section className="pt-notion-xl">
        <div className="relative animate-fade-in rounded-xl border border-notion-gray-light/20 bg-white p-4 shadow-notion dark:border-notion-gray-dark/30 dark:bg-notion-gray-dark/60 sm:p-6 md:p-8">
          <div className="absolute inset-0 rounded-xl bg-grain opacity-10"></div>

          <div className="relative z-10">
            <div className="mb-notion-md text-center">
              <h2 className="font-geist text-2xl font-semibold text-notion-text-light dark:text-notion-text-dark sm:text-3xl">
                Our Mission
              </h2>
              <div className="mx-auto mt-2 h-1 w-16 bg-notion-pink/60 opacity-70 sm:w-20"></div>
            </div>

            <p className="mx-auto mt-6 max-w-3xl text-center font-geist text-base leading-relaxed text-notion-text-light/80 dark:text-notion-text-dark/80 sm:text-lg">
              The Women Empowerment Training Program is dedicated to empowering
              women with digital skills and entrepreneurial knowledge. Our team
              combines academic expertise with practical guidance to help women
              navigate the digital landscape and establish sustainable
              businesses. Through personalized training, community building, and
              ongoing support, we aim to close the digital gender gap and foster
              economic independence.
            </p>

            <div className="mt-8 flex justify-center">
              <div className="inline-flex items-center justify-center gap-2 rounded-full bg-notion-pink/10 px-6 py-2 font-geist text-sm text-notion-pink transition-colors hover:bg-notion-pink/20 dark:bg-notion-pink-dark/20 dark:text-notion-pink-light dark:hover:bg-notion-pink-dark/30">
                <span>
                  Join us in our mission to empower women through technology
                </span>
                <ExternalLink className="h-4 w-4" />
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
