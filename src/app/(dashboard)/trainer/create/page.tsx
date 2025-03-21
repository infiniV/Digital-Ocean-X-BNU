import { redirect } from "next/navigation";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { auth } from "~/server/auth";
import { CourseForm } from "./_components/CourseForm";

export default async function CreateCoursePage() {
  const session = await auth();

  // Redirect to sign-in if not authenticated
  if (!session) {
    redirect("/api/auth/signin");
  }

  // Redirect if not a trainer
  if (session.user.role !== "trainer") {
    redirect("/");
  }

  return (
    <main className="min-h-screen space-y-8 px-4 py-8 sm:px-6 lg:px-8">
      <div className="space-y-6">
        <Link
          href="/trainer"
          className="inline-flex items-center gap-1.5 rounded-lg bg-notion-gray-light/10 px-4 py-2 font-geist text-sm font-medium text-notion-text-light/80 transition-all hover:bg-notion-pink hover:text-white dark:bg-notion-gray-dark/20 dark:text-notion-text-dark/80 dark:hover:bg-notion-pink dark:hover:text-white"
        >
          <ChevronLeft size={16} className="shrink-0" />
          <span>Back to Dashboard</span>
        </Link>

        <div className="space-y-2">
          <h1 className="font-geist text-2xl font-semibold tracking-tight text-notion-text-light dark:text-notion-text-dark sm:text-3xl">
            Create New Course
          </h1>
          <p className="max-w-2xl font-geist text-base text-notion-text-light/70 dark:text-notion-text-dark/70">
            Fill in the details below to create a new course. You can add slides
            after creating the course.
          </p>
        </div>
      </div>

      <CourseForm trainerId={session.user.id} />
    </main>
  );
}
