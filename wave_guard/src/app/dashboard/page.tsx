import { ProfileSidebar } from '@/components/dashboard/ProfileSidebar';
import { MetricsSection } from '@/components/dashboard/MetricsSection';
import { RecentReports } from '@/components/dashboard/RecentReports';
import { AlertsHistory } from '@/components/dashboard/AlertsHistory';

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-sky-50 dark:from-dark-2 dark:via-dark dark:to-dark-3">
      <div className="container mx-auto px-6 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            User Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Monitor coastal threats, view your reports, and track system activities
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Sidebar - 25% */}
          <div className="lg:col-span-1">
            <ProfileSidebar />
          </div>

          {/* Right Content - 75% */}
          <div className="lg:col-span-3 space-y-6">
            {/* Metrics Section - Top 60% */}
            <div className="h-[400px]">
              <MetricsSection />
            </div>

            {/* Bottom Panels - Bottom 40% */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[300px]">
              <RecentReports />
              <AlertsHistory />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
