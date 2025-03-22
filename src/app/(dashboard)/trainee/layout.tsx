import { auth } from "~/server/auth";
import { redirect } from "next/navigation";

export default async function TraineeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session) {
    redirect("/api/auth/signin");
  }

  if (session.user.role !== "trainee") {
    redirect("/");
  }

  return <div className="min-h-screen">{children}</div>;
}
