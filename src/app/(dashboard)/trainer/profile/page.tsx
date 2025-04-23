import { auth } from "~/server/auth";
import { TrainerProfileForm, TrainerPasswordForm } from "./ProfileForms";
import { cookies } from "next/headers";
import { ChevronLeftCircle } from "lucide-react";
import Link from "next/link";

interface ApiProfile {
  name: string | null;
  email: string | null;
  bio: string | null;
  image: string | null;
}

export default async function TrainerProfilePage() {
  const session = await auth();
  if (!session || session.user.role !== "trainer") {
    // Should never happen due to layout, but just in case
    return <div className="p-8 text-red-600">Unauthorized</div>;
  }

  let profile: ApiProfile = {
    name: session.user.name ?? null,
    email: session.user.email ?? null,
    bio: null,
    image: session.user.image ?? null,
  };

  try {
    // Fetch the latest profile (including bio) from the API
    const baseUrl =
      process.env.NEXT_PUBLIC_BASE_URL ??
      process.env.VERCEL_URL ??
      "http://localhost:3000";
    const apiUrl = baseUrl.startsWith("http")
      ? `${baseUrl}/api/trainer/profile`
      : `http://${baseUrl}/api/trainer/profile`;
    // Get cookies as a string for the Cookie header
    const cookiesStore = await cookies();
    const allCookies = cookiesStore.getAll();
    const cookieHeader = allCookies
      .map((c) => `${c.name}=${c.value}`)
      .join("; ");
    console.log("Fetching profile from", apiUrl);
    const res = await fetch(apiUrl, {
      headers: {
        "Content-Type": "application/json",
        Cookie: cookieHeader,
      },
      cache: "no-store",
    });
    console.log("API response status:", res.status);
    if (res.ok) {
      const data = (await res.json()) as {
        name?: string | null;
        email?: string | null;
        bio?: string | null;
        image?: string | null;
      };
      console.log("API response data:", data);
      profile = {
        name: data?.name ?? null,
        email: data?.email ?? null,
        bio: data?.bio ?? null,
        image: data?.image ?? null,
      };
      console.log("Fetched profile from API:", profile);
    } else {
      const errorText = await res.text();
      console.error("API error response:", errorText);
    }
  } catch (err) {
    // fallback to session only
    console.error("Failed to fetch profile from API, using session data.", err);
  }

  return (
    <main className="container mx-auto space-y-notion-xl px-2 py-8 sm:px-4 md:px-6 lg:px-8">
      <div className="relative">
        <Link
          href="/trainer"
          className="inline-flex items-center gap-2 rounded-lg border border-notion-gray-light/20 bg-white px-4 py-2 text-sm font-medium text-notion-text-light shadow-notion transition-all hover:border-notion-pink hover:shadow-notion-hover dark:border-notion-gray-dark/30 dark:bg-notion-gray-dark/60 dark:text-notion-text-dark"
        >
          <ChevronLeftCircle className="h-4 w-4" />
          Back to Dashboard
        </Link>
      </div>

      <div className="rounded-xl border border-notion-gray-light/20 bg-white p-8 shadow-notion dark:border-notion-gray-dark/30 dark:bg-notion-gray-dark/60">
        <div className="absolute inset-0 bg-grain opacity-10"></div>
        <div className="relative z-10 space-y-notion-md">
          <h1 className="font-geist text-3xl font-bold text-notion-text-light dark:text-notion-text-dark">
            My Profile
          </h1>
          <section className="space-y-notion-xl">
            <TrainerProfileForm trainer={profile} />
            <div className="border-t border-notion-gray-light/20 pt-8 dark:border-notion-gray-dark/30">
              <h2 className="mb-notion-md font-geist text-xl font-semibold text-notion-text-light dark:text-notion-text-dark">
                Change Password
              </h2>
              <TrainerPasswordForm />
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
