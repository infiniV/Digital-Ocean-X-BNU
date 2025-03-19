import { Suspense } from "react";
import { HeroSection } from "~/components/home/HeroSection";
import { FeaturedCourseCarousel } from "~/components/courses/FeaturedCourseCarousel";
import { ImpactStats } from "~/components/home/ImpactStats";
import { TestimonialCarousel } from "~/components/testimonials/TestimonialCarousel";
import { EventPreview } from "~/components/events/EventPreview";
import { CommunityHighlights } from "~/components/community/CommunityHighlights";
import { SignupForm } from "~/components/newsletter/SignupForm";

export default function HomePage() {
  return (
    <main>
      <HeroSection />

      <Suspense>
        <FeaturedCourseCarousel />
      </Suspense>

      <ImpactStats />

      <TestimonialCarousel />

      <EventPreview />

      <CommunityHighlights />

      <SignupForm />
    </main>
  );
}
