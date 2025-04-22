import { Suspense } from "react";
import { auth } from "~/server/auth";
import { WelcomeSection } from "~/components/home/WelcomeSection";
import { HeroSection } from "~/components/home/HeroSection";
import { FeaturedCourseCarousel } from "~/components/courses/FeaturedCourseCarousel";
import { ImpactStats } from "~/components/home/ImpactStats";
import { TestimonialCarousel } from "~/components/testimonials/TestimonialCarousel";
import { SignupForm } from "~/components/newsletter/SignupForm";
import { FeaturedTrainers } from "~/components/trainers/FeaturedTrainers";

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
