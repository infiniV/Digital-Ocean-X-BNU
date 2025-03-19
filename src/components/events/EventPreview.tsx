"use client";

import { useState } from "react";

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
  const typeColors = {
    workshop: "bg-notion-pink text-notion-text-light",
    networking: "bg-notion-accent text-white",
    webinar: "bg-notion-gray-light dark:bg-notion-gray-dark",
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
    }).format(date);
  };

  return (
    <div className="group relative overflow-hidden rounded-lg border border-notion-gray-light bg-white p-6 transition-shadow hover:shadow-md dark:border-notion-gray-dark dark:bg-notion-dark">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <span
            className={`inline-block rounded-full px-3 py-1 text-xs font-medium ${
              typeColors[event.type]
            }`}
          >
            {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
          </span>
          <h3 className="mt-2 text-lg font-semibold">{event.title}</h3>
          <p className="mt-1 text-sm text-notion-text-light/70 dark:text-notion-text-dark/70">
            {event.description}
          </p>
        </div>
        <div className="ml-4 text-center text-notion-pink">
          <div className="text-2xl font-bold">{formatDate(event.date)}</div>
        </div>
      </div>
      <div className="mt-4 flex items-center justify-between">
        <div className="text-sm text-notion-text-light/70 dark:text-notion-text-dark/70">
          {event.time}
        </div>
        <div className="text-sm text-notion-text-light/70 dark:text-notion-text-dark/70">
          Hosted by {event.host}
        </div>
      </div>
      <button className="mt-4 w-full rounded-lg bg-notion-pink px-4 py-2 text-sm font-medium text-notion-text-light transition-colors hover:bg-notion-pink-dark">
        Register Now
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
    <section className="py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-4xl font-bold">Upcoming Events</h2>
          <p className="mt-2 text-notion-text-light/70 dark:text-notion-text-dark/70">
            Join our community events and grow your network
          </p>
        </div>

        <div className="mt-8 flex justify-center gap-2">
          {["all", "workshop", "networking", "webinar"].map((type) => (
            <button
              key={type}
              onClick={() => setFilter(type as typeof filter)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                filter === type
                  ? "bg-notion-pink text-notion-text-light"
                  : "text-notion-text-light/70 hover:bg-notion-pink/10 dark:text-notion-text-dark/70"
              }`}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          ))}
        </div>

        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredEvents.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      </div>
    </section>
  );
}
