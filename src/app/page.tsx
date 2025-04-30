import { Suspense } from "react";
import { auth } from "~/server/auth";
import { WelcomeSection } from "~/components/home/WelcomeSection";
import { HeroSection } from "~/components/home/HeroSection";
import { ImpactStats } from "~/components/home/ImpactStats";
import { TeamSection } from "~/components/home/TeamSection";
import { TestimonialCarousel } from "~/components/testimonials/TestimonialCarousel";
import { FeaturedTrainers } from "~/components/trainers/FeaturedTrainers";

export default async function HomePage() {
  const session = await auth();

  return (
    <main>
      {session ? <WelcomeSection user={session.user} /> : <HeroSection />}{" "}
      {!session && (
        <>
          {" "}
          <ImpactStats />
          <TeamSection />
          <Suspense>
            <FeaturedTrainers />
          </Suspense>
          <TestimonialCarousel />
        </>
      )}
    </main>
  );
}
