import AuthProvider from "~/components/SessionProvider";
import { auth } from "~/server/auth";
// ...existing imports...

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  return (
    <AuthProvider session={session}>
      {/* ...existing layout code... */}
      {children}
      {/* ...existing layout code... */}
    </AuthProvider>
  );
}
