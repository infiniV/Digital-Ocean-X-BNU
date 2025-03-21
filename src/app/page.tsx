import { Suspense } from "react";
import { auth } from "~/server/auth";
import { WelcomeSection } from "~/components/home/WelcomeSection";
import { HeroSection } from "~/components/home/HeroSection";
import { FeaturedCourseCarousel } from "~/components/courses/FeaturedCourseCarousel";
import { ImpactStats } from "~/components/home/ImpactStats";
import { TestimonialCarousel } from "~/components/testimonials/TestimonialCarousel";
import { SignupForm } from "~/components/newsletter/SignupForm";

export default async function HomePage() {
  const session = await auth();

  return (
    <main>
      {session ? <WelcomeSection user={session.user} /> : <HeroSection />}

      <Suspense>
        <FeaturedCourseCarousel isAuthenticated={!!session} />
      </Suspense>

      {!session && (
        <>
          <ImpactStats />
          <TestimonialCarousel />
          <SignupForm />
        </>
      )}
    </main>
  );
}
