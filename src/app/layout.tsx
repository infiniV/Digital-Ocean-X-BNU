import "~/styles/globals.css";
import { ThemeProvider } from "~/components/theme-provider";
import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";
import { auth } from "~/server/auth";
import { RoleBasedNavbar } from "~/components/layout/RoleBasedNavbar";
import { type UserRole } from "~/server/auth/role-utils";
import AuthProvider from "~/components/SessionProvider";

export const metadata: Metadata = {
  title: "DO Women Empower",
  description: "Women Empowerment Platform",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const session = await auth();
  // Get the user role from the session
  const userRole = session?.user?.role as UserRole | undefined;

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={GeistSans.variable}>
        <AuthProvider session={session}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <RoleBasedNavbar session={session} userRole={userRole} />
            <main className="">{children}</main>
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
