"use client";

import { User } from "lucide-react";
import Link from "next/link";

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

export function CommunityHighlights() {
  return (
    <section className="bg-notion-gray-light py-16 dark:bg-notion-gray-dark">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-4xl font-bold">Community Highlights</h2>
          <p className="mt-2 text-notion-text-light/70 dark:text-notion-text-dark/70">
            Recent discussions and achievements from our community
          </p>
        </div>

        <div className="mt-12 grid gap-8 lg:grid-cols-2">
          {/* Recent Discussions */}
          <div className="space-y-6">
            <h3 className="text-2xl font-semibold">Trending Discussions</h3>
            <div className="space-y-4">
              {recentDiscussions.map((discussion) => (
                <div
                  key={discussion.id}
                  className="group overflow-hidden rounded-lg border border-notion-gray-light bg-white p-4 transition-shadow hover:shadow-md dark:border-notion-gray-dark dark:bg-notion-dark"
                >
                  <div className="flex items-start gap-4">
                    <div className="relative h-10 w-10 flex-shrink-0 overflow-hidden rounded-full"></div>
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">
                          {discussion.author.name}
                        </span>
                        <User />
                        <span className="text-sm text-notion-text-light/50 dark:text-notion-text-dark/50">
                          in
                        </span>
                        <span className="text-sm font-medium text-notion-pink">
                          {discussion.category}
                        </span>
                      </div>
                      <Link
                        href={`/community/discussion/${discussion.id}`}
                        className="block font-medium hover:text-notion-pink"
                      >
                        {discussion.title}
                      </Link>
                      <div className="flex items-center gap-4 text-sm">
                        <span className="text-notion-text-light/70 dark:text-notion-text-dark/70">
                          {discussion.replies} replies
                        </span>
                        <span className="text-notion-text-light/70 dark:text-notion-text-dark/70">
                          {discussion.likes} likes
                        </span>
                        {discussion.isHot && (
                          <span className="text-xs font-medium text-notion-accent">
                            🔥 Hot
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <Link
              href="/community/discussions"
              className="inline-block text-sm font-medium text-notion-pink hover:text-notion-pink-dark"
            >
              View all discussions →
            </Link>
          </div>

          {/* Recent Achievements */}
          <div className="space-y-6">
            <h3 className="text-2xl font-semibold">Latest Achievements</h3>
            <div className="space-y-4">
              {recentAchievements.map((achievement) => (
                <div
                  key={achievement.id}
                  className="group overflow-hidden rounded-lg border border-notion-gray-light bg-white p-4 transition-shadow hover:shadow-md dark:border-notion-gray-dark dark:bg-notion-dark"
                >
                  <div className="flex items-start gap-4">
                    <div className="relative h-10 w-10 flex-shrink-0 overflow-hidden rounded-full"></div>
                    <div className="flex-1 space-y-1">
                      <div className="font-medium">{achievement.user.name}</div>
                      <div className="font-medium text-notion-pink">
                        {achievement.title}
                      </div>
                      <p className="text-sm text-notion-text-light/70 dark:text-notion-text-dark/70">
                        {achievement.description}
                      </p>
                      <div className="text-sm text-notion-text-light/50 dark:text-notion-text-dark/50">
                        {achievement.date}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <Link
              href="/community/achievements"
              className="inline-block text-sm font-medium text-notion-pink hover:text-notion-pink-dark"
            >
              View all achievements →
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
