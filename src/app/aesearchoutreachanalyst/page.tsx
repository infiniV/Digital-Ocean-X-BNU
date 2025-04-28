import Image from "next/image";
import { Users } from "lucide-react";

const analysts = [
  {
    name: "Manahil Tanweer",
    title: "Research & Outreach Analyst",
    image: "/aesearchoutreachanalyst/Hania.jpeg", // No image for Manahil, using Hania's as placeholder
    bio: "As a Research & Outreach Analyst for the Women Empowerment Training Program, I will conduct participant engagement initiatives, monitor post-training outcomes, and systematically collect and analyze feedback to support continuous program development and impact assessment.",
  },
  {
    name: "Menahil Fatima",
    title: "Research & Outreach Analyst",
    image: "/aesearchoutreachanalyst/IMG-20241109-WA0044.jpg",
    bio: "As a Research & Outreach Analyst, I will work closely with women entrepreneurs to build collaborative networks, fuel digital innovation, and empower them to achieve sustained growth.",
  },
  {
    name: "Hania",
    title: "Research & Outreach Analyst",
    image: "/aesearchoutreachanalyst/IMG-20240601-WA0075.jpg",
    bio: "As a Research & Outreach Analyst for the Women Empowerment Training Program, I am passionate about supporting women-led businesses and documenting their success stories to drive impactful change. I contribute to academic research, internal reporting, and public communication efforts through my role.",
  },
];

export default function ResearchOutreachAnalystPage() {
  return (
    <main className="min-h-screen space-y-notion-xl px-notion-md py-notion-lg sm:px-notion-lg lg:px-notion-xl">
      <div className="animate-fade-in">
        <div className="flex flex-col gap-notion-xs">
          <h1 className="font-geist text-2xl font-semibold text-notion-text-light dark:text-notion-text-dark sm:text-3xl md:text-4xl">
            Research & Outreach Analysts
          </h1>
          <p className="max-w-2xl font-geist text-base text-notion-text-light/70 dark:text-notion-text-dark/70 sm:text-lg">
            Meet our dedicated Research & Outreach Analysts who drive
            engagement, innovation, and impact for women empowerment.
          </p>
        </div>
      </div>
      <div className="space-y-notion-lg">
        <div className="grid grid-cols-1 gap-notion-lg sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
          {analysts.map((analyst) => (
            <div
              key={analyst.name}
              className="group relative h-full overflow-hidden rounded-xl border border-notion-gray-light/20 bg-white shadow-notion transition-all duration-500 hover:-translate-y-1 hover:border-notion-pink hover:shadow-notion-lg dark:border-notion-gray-dark/30 dark:bg-notion-gray-dark/60 dark:hover:border-notion-pink-dark"
            >
              {/* Background pattern with grain effect */}
              <div className="absolute inset-0 bg-grain opacity-10"></div>
              {/* Animated glow effect on hover */}
              <div className="pointer-events-none absolute -inset-1 z-0 rounded-xl bg-gradient-to-r from-notion-pink/20 via-notion-accent/20 to-notion-pink-dark/20 opacity-0 blur-xl transition-all duration-500 group-hover:opacity-70"></div>
              {/* Content */}
              <div className="relative z-10 flex flex-col items-center p-notion-lg">
                <div className="relative mb-notion-md flex h-20 w-20 items-center justify-center overflow-hidden rounded-full border-4 border-notion-pink/20 bg-white shadow-notion transition-all duration-300 group-hover:scale-105 dark:border-notion-accent-light">
                  {analyst.image ? (
                    <Image
                      src={analyst.image}
                      alt={analyst.name}
                      width={80}
                      height={80}
                      className="h-20 w-20 object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  ) : (
                    <div className="flex h-20 w-20 items-center justify-center rounded-full bg-notion-gray-light/30 ring-2 ring-notion-pink/20 dark:bg-notion-gray-dark/50">
                      <Users className="h-8 w-8 text-notion-text-light/40 dark:text-notion-text-dark/40" />
                    </div>
                  )}
                </div>
                <h2 className="font-geist text-lg font-semibold text-notion-text-light transition-colors group-hover:text-notion-pink dark:text-notion-text-dark dark:group-hover:text-notion-pink-light">
                  {analyst.name}
                </h2>
                {/* Small glow under name on hover */}
                <div className="h-0.5 w-0 bg-notion-pink/50 blur-[2px] transition-all duration-500 group-hover:w-2/3"></div>
                <h3 className="mb-notion-xs mt-notion-xs font-geist text-sm text-notion-accent-dark dark:text-notion-accent-light">
                  {analyst.title}
                </h3>
                <p className="line-clamp-4 min-h-[4.5rem] text-center font-geist text-sm text-notion-text-light/80 dark:text-notion-text-dark/80">
                  {analyst.bio}
                </p>
              </div>
              {/* Subtle grain overlay for texture */}
              <div className="pointer-events-none absolute inset-0 rounded-lg bg-grain opacity-10"></div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
