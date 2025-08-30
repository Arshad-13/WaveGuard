import { ProfileSidebar } from '@/components/dashboard/ProfileSidebar';
import { MetricsSection } from '@/components/dashboard/MetricsSection';
import { RecentReports } from '@/components/dashboard/RecentReports';
import { AlertsHistory } from '@/components/dashboard/AlertsHistory';

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-sky-50">
      <div className="container mx-auto px-6 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            User Dashboard
          </h1>
          <p className="text-gray-600">
            Monitor coastal threats, view your reports, and track system activities
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Left Column - Profile + Bottom Panels */}
          <div className="lg:col-span-1 space-y-8">
            {/* Profile Sidebar */}
            <ProfileSidebar />
            
            {/* Recent Reports and Alerts History - Full Width Below Profile */}
          </div>

          {/* Right Column - Metrics Section */}
          <div className="lg:col-span-3">
            {/* Metrics Section */}
            <div className="min-h-[500px]">
              <MetricsSection />
            </div>
          </div>
        </div>
        
        {/* Bottom Section - Recent Reports and Alerts History 50-50 */}
        <div className="mt-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="min-h-[400px]">
              <RecentReports />
            </div>
            <div className="min-h-[400px]">
              <AlertsHistory />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
