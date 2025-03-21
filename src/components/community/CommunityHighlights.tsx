"use client";

import {
  type LucideIcon,
  MessageCircle,
  Heart,
  Flame,
  Trophy,
  Clock,
  ArrowRight,
  MessageSquare,
} from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

interface Discussion {
  id: number;
  title: string;
  author: {
    name: string;
    image: string;
  };
  category: string;
  replies: number;
  likes: number;
  isHot?: boolean;
}

interface Achievement {
  id: number;
  user: {
    name: string;
    image: string;
  };
  title: string;
  description: string;
  date: string;
}

const recentDiscussions: Discussion[] = [
  {
    id: 1,
    title: "Tips for negotiating your first tech salary",
    author: {
      name: "Emma Wilson",
      image: "/users/emma.jpg",
    },
    category: "Career Advice",
    replies: 24,
    likes: 56,
    isHot: true,
  },
  {
    id: 2,
    title: "How to overcome imposter syndrome?",
    author: {
      name: "Lisa Chen",
      image: "/users/lisa.jpg",
    },
    category: "Mental Health",
    replies: 45,
    likes: 89,
    isHot: true,
  },
  {
    id: 3,
    title: "Resources for learning React Native",
    author: {
      name: "Sofia Rodriguez",
      image: "/users/sofia.jpg",
    },
    category: "Learning Resources",
    replies: 12,
    likes: 34,
  },
];

const recentAchievements: Achievement[] = [
  {
    id: 1,
    user: {
      name: "Rachel Kim",
      image: "/users/rachel.jpg",
    },
    title: "Completed Full-Stack Development Path",
    description: "Finished all courses and projects in the full-stack track",
    date: "2 days ago",
  },
  {
    id: 2,
    user: {
      name: "Aisha Patel",
      image: "/users/aisha.jpg",
    },
    title: "First Open Source Contribution",
    description: "Made first PR to a major open source project",
    date: "4 days ago",
  },
];

function CategoryBadge({ category }: { category: string }) {
  const categoryConfig: Record<string, { color: string; icon: LucideIcon }> = {
    "Career Advice": {
      color:
        "bg-notion-accent/10 text-notion-accent border border-notion-accent/20",
      icon: Trophy,
    },
    "Mental Health": {
      color: "bg-notion-pink/10 text-notion-pink border border-notion-pink/20",
      icon: Heart,
    },
    "Learning Resources": {
      color:
        "bg-notion-text-light/10 text-notion-text-light border border-notion-text-light/20 dark:bg-notion-text-dark/10 dark:text-notion-text-dark dark:border-notion-text-dark/20",
      icon: MessageCircle,
    },
  };

  const config = categoryConfig[category] ?? {
    color:
      "bg-notion-accent/10 text-notion-accent border border-notion-accent/20",
    icon: MessageCircle,
  };
  const Icon = config.icon;

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-medium ${config.color}`}
    >
      <Icon size={12} className="flex-shrink-0" />
      {category}
    </span>
  );
}

export function CommunityHighlights() {
  const MotionLink = motion(Link);

  return (
    <section className="relative border-y border-notion-gray-light/10 bg-notion-background py-24 dark:border-notion-gray-dark/10 dark:bg-notion-background-dark">
      {/* Subtle Background Pattern */}
      <div className="absolute inset-0" aria-hidden="true">
        <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern
              id="community-grid"
              x="0"
              y="0"
              width="40"
              height="40"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M.5.5h39v39h-39z"
                fill="none"
                stroke="currentColor"
                className="stroke-notion-accent/[0.03]"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#community-grid)" />
        </svg>
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-gradient-to-r from-notion-accent to-notion-pink bg-clip-text font-geist text-4xl font-bold tracking-tight text-transparent sm:text-5xl"
          >
            Community Highlights
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="mx-auto mt-3 max-w-2xl font-geist text-lg text-notion-text-light/70 dark:text-notion-text-dark/70"
          >
            Recent discussions and achievements from our community
          </motion.p>
        </div>

        <div className="mt-16 grid gap-8 lg:grid-cols-2">
          {/* Recent Discussions */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-notion-accent/10 p-2.5">
                  <MessageSquare size={24} className="text-notion-accent" />
                </div>
                <h3 className="font-geist text-2xl font-semibold text-notion-text-light dark:text-notion-text-dark">
                  Trending Discussions
                </h3>
              </div>
              <MotionLink
                href="/community/discussions"
                className="group flex items-center gap-1.5 rounded-lg px-4 py-2 font-geist text-sm font-medium text-notion-accent transition-colors hover:bg-notion-accent/5"
                whileHover={{ x: 4 }}
              >
                View all
                <ArrowRight
                  size={16}
                  className="transition-transform group-hover:translate-x-0.5"
                />
              </MotionLink>
            </div>

            <div className="space-y-4">
              {recentDiscussions.map((discussion, idx) => (
                <motion.div
                  key={discussion.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="group relative overflow-hidden rounded-xl border border-notion-gray-light/20 bg-notion-background p-5 transition-all hover:border-notion-accent/30 hover:shadow-notion dark:border-notion-gray-dark/20 dark:bg-notion-background-dark dark:hover:border-notion-accent/20"
                >
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                      <CategoryBadge category={discussion.category} />
                      {discussion.isHot && (
                        <div className="flex items-center gap-1.5 rounded-full bg-notion-pink/10 px-3 py-1 text-sm font-medium text-notion-pink">
                          <Flame size={12} className="flex-shrink-0" />
                          Trending
                        </div>
                      )}
                    </div>
                    <Link
                      href={`/community/discussion/${discussion.id}`}
                      className="block font-geist text-lg font-medium text-notion-text-light transition-colors hover:text-notion-accent dark:text-notion-text-dark"
                    >
                      {discussion.title}
                    </Link>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-notion-accent/10 font-geist text-sm font-medium text-notion-accent ring-2 ring-notion-accent/20">
                          {discussion.author.name?.[0]?.toUpperCase() ?? "?"}
                        </div>
                        <span className="font-geist text-sm font-medium text-notion-text-light/80 dark:text-notion-text-dark/80">
                          {discussion.author.name}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-notion-text-light/60 dark:text-notion-text-dark/60">
                        <div className="flex items-center gap-1.5">
                          <MessageCircle size={14} />
                          {discussion.replies}
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Heart
                            size={14}
                            className="hover:fill-notion-pink hover:text-notion-pink"
                          />
                          {discussion.likes}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Recent Achievements */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-notion-accent/10 p-2.5">
                  <Trophy size={24} className="text-notion-accent" />
                </div>
                <h3 className="font-geist text-2xl font-semibold text-notion-text-light dark:text-notion-text-dark">
                  Latest Achievements
                </h3>
              </div>
              <MotionLink
                href="/community/achievements"
                className="group flex items-center gap-1.5 rounded-lg px-4 py-2 font-geist text-sm font-medium text-notion-accent transition-colors hover:bg-notion-accent/5"
                whileHover={{ x: 4 }}
              >
                View all
                <ArrowRight
                  size={16}
                  className="transition-transform group-hover:translate-x-0.5"
                />
              </MotionLink>
            </div>

            <div className="space-y-4">
              {recentAchievements.map((achievement, idx) => (
                <motion.div
                  key={achievement.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="group relative overflow-hidden rounded-xl border border-notion-gray-light/20 bg-notion-background p-5 transition-all hover:border-notion-accent/30 hover:shadow-notion dark:border-notion-gray-dark/20 dark:bg-notion-background-dark dark:hover:border-notion-accent/20"
                >
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-notion-accent/10 font-geist text-sm font-medium text-notion-accent ring-2 ring-notion-accent/20">
                        {achievement.user.name?.[0]?.toUpperCase() ?? "?"}
                      </div>
                      <div>
                        <div className="font-geist font-medium text-notion-text-light dark:text-notion-text-dark">
                          {achievement.user.name}
                        </div>
                        <div className="flex items-center gap-1.5 text-sm text-notion-text-light/60 dark:text-notion-text-dark/60">
                          <Clock size={14} className="flex-shrink-0" />
                          {achievement.date}
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="font-geist font-medium text-notion-accent">
                        {achievement.title}
                      </div>
                      <p className="font-geist text-sm leading-relaxed text-notion-text-light/70 dark:text-notion-text-dark/70">
                        {achievement.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
