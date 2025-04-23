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
    <main className="mx-auto max-w-2xl space-y-10 px-4 py-8 sm:px-6 lg:px-8">
      <div>
        {/* back to dashboard */}
        <Link
          href="/trainer"
          className="mb-4 inline-flex items-center gap-2 rounded-lg bg-notion-gray-light/5 px-3 py-2 text-sm font-medium text-notion-text-light transition-all hover:bg-notion-accent/10 dark:bg-notion-gray-dark/60 dark:text-notion-text-dark dark:hover:bg-notion-gray-dark/80"
        >
          <ChevronLeftCircle className="h-4 w-4" />
          Back to Dashboard
        </Link>
      </div>
      <h1 className="mb-6 font-geist text-2xl font-bold">My Profile</h1>
      <section className="space-y-8">
        <TrainerProfileForm trainer={profile} />
        <div className="border-t pt-8">
          <h2 className="mb-4 font-geist text-xl font-semibold">
            Change Password
          </h2>
          <TrainerPasswordForm />
        </div>
      </section>
    </main>
  );
}
