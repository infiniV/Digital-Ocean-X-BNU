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
    <main className="container px-6 py-8">
      <Link
        href="/trainer"
        className="mb-6 flex items-center gap-1 font-geist text-sm text-notion-text-light/70 hover:text-notion-pink dark:text-notion-text-dark/70 dark:hover:text-notion-pink"
      >
        <ChevronLeft size={16} /> Back to Dashboard
      </Link>

      <div className="mb-8">
        <h1 className="font-geist text-2xl font-semibold text-notion-text-light dark:text-notion-text-dark">
          Create New Course
        </h1>
        <p className="font-geist text-notion-text-light/70 dark:text-notion-text-dark/70">
          Fill in the details below to create a new course. You can add slides
          after creating the course.
        </p>
      </div>

      <CourseForm trainerId={session.user.id} />
    </main>
  );
}
