"use client";

import { useState } from "react";
import {
  CalendarDays,
  Clock,
  Users,
  Presentation,
  Network,
  Laptop,
  ChevronRight,
  UserCircle2,
  Filter,
} from "lucide-react";

interface Event {
  id: number;
  title: string;
  date: Date;
  time: string;
  type: "workshop" | "networking" | "webinar";
  host: string;
  description: string;
}

const upcomingEvents: Event[] = [
  {
    id: 1,
    title: "Tech Leadership Workshop",
    date: new Date("2024-04-15"),
    time: "10:00 AM - 12:00 PM",
    type: "workshop",
    host: "Jennifer Lee",
    description: "Learn essential leadership skills for women in tech roles.",
  },
  {
    id: 2,
    title: "Networking Mixer",
    date: new Date("2024-04-20"),
    time: "6:00 PM - 8:00 PM",
    type: "networking",
    host: "Women in Tech Network",
    description: "Connect with other women professionals in the tech industry.",
  },
  {
    id: 3,
    title: "Career Growth Strategies",
    date: new Date("2024-04-25"),
    time: "2:00 PM - 3:30 PM",
    type: "webinar",
    host: "Michelle Chen",
    description: "Strategies for advancing your career in technology.",
  },
];

function EventCard({ event }: { event: Event }) {
  const typeConfig = {
    workshop: {
      icon: Presentation,
      class: "bg-notion-pink/10 text-notion-pink",
    },
    networking: {
      icon: Network,
      class: "bg-notion-accent/10 text-notion-accent",
    },
    webinar: {
      icon: Laptop,
      class:
        "bg-notion-gray-light/20 text-notion-text-light dark:bg-notion-gray-dark/20 dark:text-notion-text-dark",
    },
  };

  const TypeIcon = typeConfig[event.type].icon;
  const typeClass = typeConfig[event.type].class;

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
    }).format(date);
  };

  return (
    <div className="bg-notion-background hover:shadow-notion dark:bg-notion-background-dark group relative overflow-hidden rounded-xl border border-notion-gray-light/20 p-6 transition-all hover:border-notion-pink/30 dark:border-notion-gray-dark/20">
      <div className="flex items-start justify-between">
        <div className="flex-1 space-y-4">
          <div className="flex items-center gap-2">
            <span
              className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${typeClass}`}
            >
              <TypeIcon size={14} />
              {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
            </span>
          </div>
          <h3 className="font-geist text-lg font-semibold text-notion-text-light dark:text-notion-text-dark">
            {event.title}
          </h3>
          <p className="font-geist text-sm leading-relaxed text-notion-text-light/70 dark:text-notion-text-dark/70">
            {event.description}
          </p>
        </div>
        <div className="ml-4 flex flex-col items-center rounded-lg bg-notion-pink/5 p-3 text-notion-pink">
          <CalendarDays size={20} className="mb-1" />
          <div className="font-geist text-lg font-bold">
            {formatDate(event.date)}
          </div>
        </div>
      </div>
      <div className="mt-6 flex flex-wrap items-center gap-4 border-t border-notion-gray-light/10 pt-4 dark:border-notion-gray-dark/10">
        <div className="flex items-center gap-2 text-sm text-notion-text-light/70 dark:text-notion-text-dark/70">
          <Clock size={16} />
          {event.time}
        </div>
        <div className="flex items-center gap-2 text-sm text-notion-text-light/70 dark:text-notion-text-dark/70">
          <UserCircle2 size={16} />
          Hosted by {event.host}
        </div>
      </div>
      <button className="font-geist hover:shadow-notion group-hover:shadow-notion mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-notion-pink px-4 py-2.5 text-sm font-medium text-notion-text-dark shadow-sm transition-all hover:bg-notion-pink-dark">
        Register Now
        <ChevronRight
          size={16}
          className="transition-transform group-hover:translate-x-0.5"
        />
      </button>
    </div>
  );
}

export function EventPreview() {
  const [filter, setFilter] = useState<
    "all" | "workshop" | "networking" | "webinar"
  >("all");

  const filteredEvents = upcomingEvents.filter(
    (event) => filter === "all" || event.type === filter,
  );

  return (
    <section className="bg-notion-background dark:bg-notion-background-dark relative overflow-hidden py-24">
      {/* Background Pattern */}
      <div className="absolute inset-0" aria-hidden="true">
        <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern
              id="event-grid"
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
                className="stroke-notion-pink/[0.03]"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#event-grid)" />
        </svg>
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="font-geist text-4xl font-bold tracking-tight text-notion-text-light dark:text-notion-text-dark sm:text-5xl">
            Upcoming Events
          </h2>
          <p className="font-geist mx-auto mt-3 max-w-2xl text-lg text-notion-text-light/70 dark:text-notion-text-dark/70">
            Join our community events and grow your network
          </p>
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
          <Filter size={16} className="mr-2 text-notion-pink" />
          {["all", "workshop", "networking", "webinar"].map((type) => (
            <button
              key={type}
              onClick={() => setFilter(type as typeof filter)}
              className={`font-geist flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium transition-all ${
                filter === type
                  ? "shadow-notion bg-notion-pink text-notion-text-dark"
                  : "bg-notion-gray-light/10 text-notion-text-light/70 hover:bg-notion-pink/10 hover:text-notion-pink dark:bg-notion-gray-dark/10 dark:text-notion-text-dark/70"
              }`}
            >
              {type === "all" && <Users size={14} />}
              {type === "workshop" && <Presentation size={14} />}
              {type === "networking" && <Network size={14} />}
              {type === "webinar" && <Laptop size={14} />}
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          ))}
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredEvents.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      </div>
    </section>
  );
}
