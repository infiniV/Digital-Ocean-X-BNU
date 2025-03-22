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
    <main className="mx-auto min-h-screen max-w-7xl space-y-10 px-4 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-12">
      <div className="space-y-8">
        <Link
          href="/trainer"
          className="group inline-flex items-center gap-2 rounded-md border border-transparent bg-notion-gray-light/15 px-4 py-2.5 font-geist text-sm font-medium text-notion-text-light/90 transition-all duration-200 ease-in-out hover:-translate-y-0.5 hover:border-notion-pink/20 hover:bg-notion-pink/10 hover:text-notion-pink focus:outline-none focus:ring-2 focus:ring-notion-pink/40 dark:bg-notion-gray-dark/30 dark:text-notion-text-dark/90 dark:hover:bg-notion-pink/20 dark:hover:text-white"
        >
          <ChevronLeft
            size={16}
            className="shrink-0 transition-transform group-hover:-translate-x-0.5"
          />
          <span>Back to Dashboard</span>
        </Link>

        <div className="space-y-3">
          <h1 className="font-geist text-2xl font-semibold tracking-tight text-notion-text-light dark:text-notion-text-dark sm:text-3xl md:text-4xl">
            Create New Course
          </h1>
          <p className="max-w-2xl font-geist text-base text-notion-text-light/80 dark:text-notion-text-dark/80 md:text-lg">
            Fill in the details below to create a new course. You can add slides
            after creating the course.
          </p>
        </div>
      </div>

      <div className="rounded-xl border border-notion-gray-light/20 bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-md dark:border-notion-gray-dark/30 dark:bg-notion-gray-dark/20 dark:shadow-notion-gray-dark/10 sm:p-8">
        <CourseForm trainerId={session.user.id} />
      </div>
    </main>
  );
}
