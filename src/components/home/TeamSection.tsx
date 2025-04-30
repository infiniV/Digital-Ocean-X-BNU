import Link from "next/link";
import Image from "next/image";
import { Users, Globe, Mail, Star, Award } from "lucide-react";

export const TeamSection = () => {
  return (
    <section className="container mx-auto animate-fade-in space-y-notion-xl px-2 py-notion-md sm:px-4 md:px-6 lg:px-8">
      {/* Background grain effect */}
      <div className="fixed inset-0 z-[-1] bg-grain opacity-10"></div>

      <div className="relative mb-8 animate-fade-in rounded-xl border border-notion-gray-light/20 bg-white p-4 shadow-notion dark:border-notion-gray-dark/30 dark:bg-notion-gray-dark/60 sm:p-6 md:p-8">
        {/* Background pattern with grain effect */}
        <div className="absolute inset-0 rounded-xl bg-grain opacity-10"></div>

        <div className="relative z-10 flex flex-col items-center gap-notion-md text-center">
          <h2 className="font-geist text-2xl font-semibold text-notion-text-light dark:text-notion-text-dark sm:text-3xl md:text-4xl">
            Meet Our Team
          </h2>
          <div className="h-1 w-16 bg-notion-pink opacity-70 sm:w-24 md:w-32"></div>
          <p className="max-w-2xl font-geist text-base leading-relaxed text-notion-text-light/80 dark:text-notion-text-dark/80 sm:text-lg">
            The dedicated professionals behind the Women Empowerment Training
            Program
          </p>
        </div>
      </div>

      <div className="grid animate-slide-up grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {/* Project Lead */}
        <div className="group relative overflow-hidden rounded-xl border border-notion-gray-light/20 bg-white shadow-notion transition-all duration-300 hover:border-notion-pink hover:shadow-notion-hover dark:border-notion-gray-dark/30 dark:bg-notion-gray-dark/60 dark:hover:border-notion-pink-dark">
          <div className="absolute inset-0 bg-grain opacity-10"></div>

          {/* Animated glow effect on hover */}
          <div className="pointer-events-none absolute -inset-1 z-0 rounded-xl bg-gradient-to-r from-notion-pink/20 via-notion-accent/20 to-notion-pink-dark/20 opacity-0 blur-xl transition-all duration-500 group-hover:opacity-70"></div>

          <div className="relative z-10 flex flex-col items-center p-6">
            <div className="relative mb-6">
              <div className="overflow-hidden rounded-full border-4 border-notion-pink/20 shadow-notion">
                <div className="group relative h-24 w-24 overflow-hidden rounded-full transition-all duration-500 sm:h-32 sm:w-32">
                  <Image
                    src="https://pwr.blr1.digitaloceanspaces.com/empowerwomn/profile-images/1745304935342-Screenshot_2025-04-22_at_11-55-17_Dr._Usman_Nazir_SCIT_-_BNU.png"
                    alt="Dr. Usman Nazir"
                    width={128}
                    height={128}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
                </div>
              </div>

              {/* Verification badge */}
              <div className="absolute bottom-0 right-0 flex h-8 w-8 items-center justify-center rounded-full bg-notion-pink text-white shadow-lg">
                <Award className="h-4 w-4" />
              </div>
            </div>

            <h3 className="font-geist text-xl font-semibold text-notion-text-light dark:text-notion-text-dark">
              Dr. Usman Nazir
            </h3>
            <p className="mt-1 font-geist text-notion-accent-dark dark:text-notion-accent-light">
              Project Lead
            </p>

            <div className="mt-4 h-0.5 w-12 bg-notion-gray-light/40 dark:bg-notion-gray-dark/40"></div>

            <div className="mt-4 flex flex-wrap justify-center gap-3">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-notion-gray-light/30 px-3 py-1 font-geist text-xs text-notion-text-light/80 dark:bg-notion-gray-dark/40 dark:text-notion-text-dark/80">
                <Star className="h-3 w-3" />
                Mentor
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-notion-pink-light/20 px-3 py-1 font-geist text-xs text-notion-pink-dark dark:bg-notion-pink-dark/30 dark:text-notion-pink-light">
                <Users className="h-3 w-3" />
                Leadership
              </span>
            </div>
          </div>
        </div>

        {/* Lead Researcher */}
        <div className="group relative overflow-hidden rounded-xl border border-notion-gray-light/20 bg-white shadow-notion transition-all duration-300 hover:border-notion-pink hover:shadow-notion-hover dark:border-notion-gray-dark/30 dark:bg-notion-gray-dark/60 dark:hover:border-notion-pink-dark">
          <div className="absolute inset-0 bg-grain opacity-10"></div>

          {/* Animated glow effect on hover */}
          <div className="pointer-events-none absolute -inset-1 z-0 rounded-xl bg-gradient-to-r from-notion-pink/20 via-notion-accent/20 to-notion-pink-dark/20 opacity-0 blur-xl transition-all duration-500 group-hover:opacity-70"></div>

          <div className="relative z-10 flex flex-col items-center p-6">
            <div className="relative mb-6">
              <div className="overflow-hidden rounded-full border-4 border-notion-pink/20 shadow-notion">
                <div className="group relative h-24 w-24 overflow-hidden rounded-full transition-all duration-500 sm:h-32 sm:w-32">
                  <Image
                    src="/aesearchoutreachanalyst/abubakr.jpg"
                    alt="Hafiz Muhammad Abubakar"
                    width={128}
                    height={128}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
                </div>
              </div>
            </div>

            <h3 className="font-geist text-xl font-semibold text-notion-text-light dark:text-notion-text-dark">
              Hafiz Muhammad Abubakar
            </h3>
            <p className="mt-1 font-geist text-notion-accent-dark dark:text-notion-accent-light">
              Lead Researcher
            </p>

            <div className="mt-4 h-0.5 w-12 bg-notion-gray-light/40 dark:bg-notion-gray-dark/40"></div>

            <div className="mt-4 flex flex-wrap justify-center gap-3">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-notion-gray-light/30 px-3 py-1 font-geist text-xs text-notion-text-light/80 dark:bg-notion-gray-dark/40 dark:text-notion-text-dark/80">
                <Globe className="h-3 w-3" />
                Research
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-notion-accent-light/20 px-3 py-1 font-geist text-xs text-notion-accent-dark dark:bg-notion-accent-dark/30 dark:text-notion-accent-light">
                <Users className="h-3 w-3" />
                Expertise
              </span>
            </div>
          </div>
        </div>

        {/* Research & Outreach Analyst */}
        <div className="group relative overflow-hidden rounded-xl border border-notion-gray-light/20 bg-white shadow-notion transition-all duration-300 hover:border-notion-pink hover:shadow-notion-hover dark:border-notion-gray-dark/30 dark:bg-notion-gray-dark/60 dark:hover:border-notion-pink-dark">
          <div className="absolute inset-0 bg-grain opacity-10"></div>

          {/* Animated glow effect on hover */}
          <div className="pointer-events-none absolute -inset-1 z-0 rounded-xl bg-gradient-to-r from-notion-pink/20 via-notion-accent/20 to-notion-pink-dark/20 opacity-0 blur-xl transition-all duration-500 group-hover:opacity-70"></div>

          <div className="relative z-10 flex flex-col items-center p-6">
            <div className="relative mb-6">
              <div className="overflow-hidden rounded-full border-4 border-notion-pink/20 shadow-notion">
                <div className="group relative h-24 w-24 overflow-hidden rounded-full transition-all duration-500 sm:h-32 sm:w-32">
                  <Image
                    src="/aesearchoutreachanalyst/Hania.jpeg"
                    alt="Hania"
                    width={128}
                    height={128}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
                </div>
              </div>
            </div>

            <h3 className="font-geist text-xl font-semibold text-notion-text-light dark:text-notion-text-dark">
              Hania
            </h3>
            <p className="mt-1 font-geist text-notion-accent-dark dark:text-notion-accent-light">
              Research & Outreach Analyst
            </p>

            <div className="mt-4 h-0.5 w-12 bg-notion-gray-light/40 dark:bg-notion-gray-dark/40"></div>

            <div className="mt-4 flex flex-wrap justify-center gap-3">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-notion-gray-light/30 px-3 py-1 font-geist text-xs text-notion-text-light/80 dark:bg-notion-gray-dark/40 dark:text-notion-text-dark/80">
                <Mail className="h-3 w-3" />
                Outreach
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-notion-pink-light/20 px-3 py-1 font-geist text-xs text-notion-pink-dark dark:bg-notion-pink-dark/30 dark:text-notion-pink-light">
                <Users className="h-3 w-3" />
                Analysis
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-notion-md flex justify-center">
        <Link
          href="/team"
          className="inline-flex items-center gap-2 rounded-lg border border-notion-pink/30 bg-notion-pink/10 px-6 py-3 font-geist text-sm font-medium text-notion-pink transition-all hover:bg-notion-pink hover:text-white dark:border-notion-pink-dark/30 dark:bg-notion-pink-dark/10 dark:text-notion-pink-light dark:hover:bg-notion-pink-dark dark:hover:text-white sm:text-base"
        >
          View Full Team
          <Users className="h-4 w-4" />
        </Link>
      </div>
    </section>
  );
};
