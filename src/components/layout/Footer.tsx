"use client";

import { Link } from "next-view-transitions";
import { Logo } from "~/components/ui/logo";
import {
  Home,
  BookOpen,
  Users,
  Mail,
  Presentation,
  Heart,
  ExternalLink,
} from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  const navLinks = [
    { href: "/", label: "Home", icon: Home },
    { href: "/courses", label: "Courses", icon: BookOpen },
    { href: "/trainers", label: "Trainers", icon: Presentation },
    { href: "/team", label: "Our Team", icon: Users },
  ];

  return (
    <footer className="relative border-t border-notion-gray-light/10 bg-notion-background/95 pt-notion-lg dark:border-notion-gray-dark/20 dark:bg-notion-background-dark/95">
      {/* Background grain effect */}
      <div className="absolute inset-0 bg-grain opacity-10"></div>

      <div className="container mx-auto px-4 py-notion-lg sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-4">
          {" "}
          {/* Column 1: Logo & About */}
          <div className="flex flex-col space-y-4">
            <Link href="/" className="group inline-block">
              <Logo className="transform transition-transform duration-200 group-hover:scale-105" />
            </Link>
            <p className="mt-2 max-w-xs font-geist text-sm leading-relaxed text-notion-text-light/70 dark:text-notion-text-dark/70">
              Empowering women in technology through education, mentorship, and
              community building.
            </p>
          </div>
          {/* Column 2: Quick Links */}
          <div className="flex flex-col space-y-4">
            <h3 className="font-geist text-lg font-semibold text-notion-text-light dark:text-notion-text-dark">
              Quick Links
            </h3>
            <div className="h-1 w-12 bg-notion-accent-dark opacity-70 dark:bg-notion-accent-light"></div>
            <ul className="mt-2 space-y-2">
              {navLinks.map(({ href, label, icon: Icon }) => (
                <li key={label}>
                  <Link
                    href={href}
                    className="group inline-flex items-center font-geist text-sm text-notion-text-light/80 transition-colors hover:text-notion-accent-dark dark:text-notion-text-dark/80 dark:hover:text-notion-accent-light"
                  >
                    <Icon
                      size={16}
                      className="mr-2 transform transition-transform duration-200 group-hover:scale-110"
                    />
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>{" "}
          {/* Column 3: User Links */}
          <div className="flex flex-col space-y-4">
            <h3 className="font-geist text-lg font-semibold text-notion-text-light dark:text-notion-text-dark">
              User Portal
            </h3>
            <div className="h-1 w-12 bg-notion-accent-dark opacity-70 dark:bg-notion-accent-light"></div>
            <ul className="mt-2 space-y-2">
              <li>
                <Link
                  href="/auth/signin"
                  className="inline-flex items-center font-geist text-sm text-notion-text-light/80 transition-colors hover:text-notion-accent-dark dark:text-notion-text-dark/80 dark:hover:text-notion-accent-light"
                >
                  <BookOpen size={16} className="mr-2" />
                  Trainee Dashboard
                </Link>
              </li>
              <li>
                <Link
                  href="/auth/signin"
                  className="inline-flex items-center font-geist text-sm text-notion-text-light/80 transition-colors hover:text-notion-accent-dark dark:text-notion-text-dark/80 dark:hover:text-notion-accent-light"
                >
                  <Presentation size={16} className="mr-2" />
                  Trainer Dashboard
                </Link>
              </li>
              <li>
                <Link
                  href="/auth/signin"
                  className="inline-flex items-center font-geist text-sm text-notion-text-light/80 transition-colors hover:text-notion-accent-dark dark:text-notion-text-dark/80 dark:hover:text-notion-accent-light"
                >
                  <Users size={16} className="mr-2" />
                  Admin Portal
                </Link>
              </li>{" "}
              <li>
                <a
                  href="https://www.digitalocean.com/community/tutorials"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center font-geist text-sm text-notion-text-light/80 transition-colors hover:text-notion-accent-dark dark:text-notion-text-dark/80 dark:hover:text-notion-accent-light"
                >
                  <ExternalLink size={16} className="mr-2" />
                  Digital Ocean Tutorials
                </a>
              </li>
            </ul>
          </div>
          {/* Column 4: Contact */}
          <div className="flex flex-col space-y-4">
            <h3 className="font-geist text-lg font-semibold text-notion-text-light dark:text-notion-text-dark">
              Contact Us
            </h3>
            <div className="h-1 w-12 bg-notion-accent-dark opacity-70 dark:bg-notion-accent-light"></div>
            <p className="font-geist text-sm text-notion-text-light/80 dark:text-notion-text-dark/80">
              Have questions or suggestions? Reach out to us.
            </p>{" "}
            <a
              href="mailto:orip@bnu.edu.pk"
              className="group inline-flex items-center font-geist text-sm text-notion-accent-dark transition-colors hover:text-notion-pink dark:text-notion-accent-light dark:hover:text-notion-pink-light"
            >
              <Mail
                size={16}
                className="mr-2 transform transition-transform duration-200 group-hover:scale-110"
              />
              orip@bnu.edu.pk
            </a>
          </div>
        </div>{" "}
        <div className="mt-10 flex flex-col items-center border-t border-notion-gray-light/10 pt-6 dark:border-notion-gray-dark/20">
          <p className="text-center font-geist text-sm text-notion-text-light/60 dark:text-notion-text-dark/60">
            © {currentYear} Digital Ocean X BNU Women Empowerment. All rights
            reserved.
          </p>
          <div className="mt-6 inline-flex items-center font-geist text-xs text-notion-text-light/60 dark:text-notion-text-dark/60">
            <span>Made with</span>
            <Heart size={12} className="mx-1 text-notion-pink" />
            <span>in collaboration with Digital Ocean</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
