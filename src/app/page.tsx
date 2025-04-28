import { Suspense } from "react";
import { auth } from "~/server/auth";
import { WelcomeSection } from "~/components/home/WelcomeSection";
import { HeroSection } from "~/components/home/HeroSection";
import { FeaturedCourseCarousel } from "~/components/courses/FeaturedCourseCarousel";
import { ImpactStats } from "~/components/home/ImpactStats";
import { TestimonialCarousel } from "~/components/testimonials/TestimonialCarousel";
import { SignupForm } from "~/components/newsletter/SignupForm";
import { FeaturedTrainers } from "~/components/trainers/FeaturedTrainers";
import Link from "next/link";

export default async function HomePage() {
  const session = await auth();

  return (
    <main>
      {session ? <WelcomeSection user={session.user} /> : <HeroSection />}

      {!session && (
        <>
          <Suspense>
            <FeaturedCourseCarousel isAuthenticated={!!session} />
          </Suspense>
          <ImpactStats />
          {/* Research & Outreach Analyst Section */}
          <section className="my-notion-xl animate-fade-in rounded-xl border border-notion-gray-light/20 bg-white p-notion-lg shadow-notion dark:border-notion-gray-dark/30 dark:bg-notion-gray-dark/60">
            <div className="flex flex-col items-center gap-notion-md text-center">
              <h2 className="font-geist text-2xl font-semibold text-notion-text-light dark:text-notion-text-dark sm:text-3xl">
                Meet Our Research & Outreach Analysts
              </h2>
              <p className="max-w-2xl font-geist text-base text-notion-text-light/70 dark:text-notion-text-dark/70">
                Discover the team driving engagement, innovation, and impact for
                women empowerment.
              </p>
              <Link
                href="/aesearchoutreachanalyst"
                className="mt-notion-md inline-flex items-center gap-2 rounded-lg border border-notion-pink/30 bg-notion-pink/10 px-6 py-2 font-geist text-base font-medium text-notion-pink transition-all hover:bg-notion-pink/20 hover:text-white dark:border-notion-pink-dark/30 dark:bg-notion-pink-dark/10 dark:text-notion-pink-light dark:hover:bg-notion-pink-dark/20"
              >
                View Analysts
              </Link>
            </div>
          </section>
          <Suspense>
            <FeaturedTrainers />
          </Suspense>
          <TestimonialCarousel />
          <SignupForm />
        </>
      )}
    </main>
  );
}
