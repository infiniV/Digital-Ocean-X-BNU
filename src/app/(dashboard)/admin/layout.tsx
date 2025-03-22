import { redirect } from "next/navigation";
import { auth } from "~/server/auth";
import { QueryProvider } from "~/components/providers/query-provider";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  // Redirect to sign-in if not authenticated
  if (!session) {
    redirect("/api/auth/signin");
  }

  // Redirect if not an admin
  if (session.user.role !== "admin") {
    redirect("/");
  }

  return <QueryProvider>{children}</QueryProvider>;
}