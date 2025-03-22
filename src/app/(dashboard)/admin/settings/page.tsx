import { ChevronLeft, Settings } from "lucide-react";
import Link from "next/link";

export default async function AdminSettingsPage() {
  return (
    <main className="min-h-screen space-y-8 px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div>
        <Link
          href="/admin"
          className="mb-6 inline-flex items-center gap-2 font-geist text-sm text-notion-text-light/70 transition-colors hover:text-notion-pink dark:text-notion-text-dark/70"
        >
          <ChevronLeft size={16} />
          Back to Dashboard
        </Link>

        <div className="flex flex-col gap-1">
          <h1 className="font-geist text-2xl font-semibold text-notion-text-light dark:text-notion-text-dark sm:text-3xl">
            Platform Settings
          </h1>
          <p className="font-geist text-notion-text-light/70 dark:text-notion-text-dark/70">
            Configure and manage platform-wide settings
          </p>
        </div>
      </div>

      {/* Settings Sections */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Quick Actions and Info */}
        <div className="space-y-6 lg:col-span-1">
          <div className="rounded-lg border border-notion-gray-light/20 bg-white p-6 shadow-sm dark:border-notion-gray-dark/30 dark:bg-notion-gray-dark/50">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-geist text-lg font-semibold text-notion-text-light dark:text-notion-text-dark">
                Quick Actions
              </h2>
              <Settings className="text-notion-text-light/50 dark:text-notion-text-dark/50" />
            </div>
            <div className="space-y-3">
              <button className="w-full rounded-lg border border-notion-gray-light/20 bg-white px-4 py-2 font-geist text-sm text-notion-text-light transition-all hover:border-notion-pink hover:text-notion-pink dark:border-notion-gray-dark/30 dark:bg-notion-gray-dark/30 dark:text-notion-text-dark dark:hover:border-notion-pink dark:hover:text-notion-pink">
                Clear Cache
              </button>
              <button className="w-full rounded-lg border border-notion-gray-light/20 bg-white px-4 py-2 font-geist text-sm text-notion-text-light transition-all hover:border-notion-pink hover:text-notion-pink dark:border-notion-gray-dark/30 dark:bg-notion-gray-dark/30 dark:text-notion-text-dark dark:hover:border-notion-pink dark:hover:text-notion-pink">
                Sync Storage
              </button>
              <button className="w-full rounded-lg border border-red-200 bg-white px-4 py-2 font-geist text-sm text-red-600 transition-all hover:bg-red-50 dark:border-red-900/30 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/30">
                Reset Platform
              </button>
            </div>
          </div>

          <div className="rounded-lg border border-notion-gray-light/20 bg-white p-6 shadow-sm dark:border-notion-gray-dark/30 dark:bg-notion-gray-dark/50">
            <h2 className="mb-4 font-geist text-lg font-semibold text-notion-text-light dark:text-notion-text-dark">
              System Information
            </h2>
            <div className="space-y-3">
              <div>
                <p className="font-geist text-sm font-medium text-notion-text-light/70 dark:text-notion-text-dark/70">
                  Version
                </p>
                <p className="font-geist text-notion-text-light dark:text-notion-text-dark">
                  1.0.0
                </p>
              </div>
              <div>
                <p className="font-geist text-sm font-medium text-notion-text-light/70 dark:text-notion-text-dark/70">
                  Last Updated
                </p>
                <p className="font-geist text-notion-text-light dark:text-notion-text-dark">
                  {new Date().toLocaleDateString()}
                </p>
              </div>
              <div>
                <p className="font-geist text-sm font-medium text-notion-text-light/70 dark:text-notion-text-dark/70">
                  Environment
                </p>
                <p className="font-geist text-notion-text-light dark:text-notion-text-dark">
                  Production
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
