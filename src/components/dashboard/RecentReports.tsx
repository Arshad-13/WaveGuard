import { Clock, MapPin, CheckCircle, AlertCircle, XCircle } from 'lucide-react';
import { clsx } from 'clsx';

interface Report {
  id: string;
  title: string;
  location: string;
  status: 'pending' | 'verified' | 'rejected';
  urgency: 'low' | 'medium' | 'high';
  submittedAt: string;
  type: string;
}

const mockReports: Report[] = [
  {
    id: 'RPT-001',
    title: 'Illegal Garbage Dumping',
    location: 'Santa Monica Beach',
    status: 'verified',
    urgency: 'medium',
    submittedAt: '2 hours ago',
    type: 'Environmental'
  },
  {
    id: 'RPT-002',
    title: 'Unauthorized Fishing Activity',
    location: 'Monterey Bay',
    status: 'pending',
    urgency: 'high',
    submittedAt: '5 hours ago',
    type: 'Fishing'
  },
  {
    id: 'RPT-003',
    title: 'Coastal Erosion Damage',
    location: 'Big Sur Coastline',
    status: 'verified',
    urgency: 'low',
    submittedAt: '1 day ago',
    type: 'Structural'
  },
  {
    id: 'RPT-004',
    title: 'Oil Spill Detection',
    location: 'San Francisco Bay',
    status: 'rejected',
    urgency: 'high',
    submittedAt: '2 days ago',
    type: 'Environmental'
  },
  {
    id: 'RPT-005',
    title: 'Wildlife Disturbance',
    location: 'Carmel Beach',
    status: 'pending',
    urgency: 'medium',
    submittedAt: '3 days ago',
    type: 'Wildlife'
  }
];

const statusConfig = {
  pending: {
    icon: Clock,
    color: 'text-yellow-600 dark:text-yellow-400',
    bg: 'bg-yellow-100 dark:bg-yellow-900/30',
    label: 'Under Review'
  },
  verified: {
    icon: CheckCircle,
    color: 'text-green-600 dark:text-green-400',
    bg: 'bg-green-100 dark:bg-green-900/30',
    label: 'Verified'
  },
  rejected: {
    icon: XCircle,
    color: 'text-red-600 dark:text-red-400',
    bg: 'bg-red-100 dark:bg-red-900/30',
    label: 'Rejected'
  }
};

const urgencyConfig = {
  low: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
  medium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
  high: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
};

export function RecentReports() {
  return (
    <div className="bg-white/70 dark:bg-dark-2/70 backdrop-blur-sm rounded-xl border border-gray-200/50 dark:border-dark-3/50 p-6 h-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Recent Reports
        </h3>
        <button className="text-ocean-600 hover:text-ocean-700 dark:text-ocean-400 dark:hover:text-ocean-300 text-sm font-medium">
          View All →
        </button>
      </div>

      <div className="space-y-3 overflow-y-auto max-h-64">
        {mockReports.map((report) => {
          const StatusIcon = statusConfig[report.status].icon;
          
          return (
            <div
              key={report.id}
              className="p-3 rounded-lg border border-gray-200/50 dark:border-dark-4/50 hover:bg-gray-50/50 dark:hover:bg-dark-3/50 transition-colors cursor-pointer"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-gray-900 dark:text-white text-sm truncate">
                    {report.title}
                  </h4>
                  <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 mt-1">
                    <MapPin className="w-3 h-3 mr-1" />
                    <span className="truncate">{report.location}</span>
                  </div>
                </div>
                <div className={clsx(
                  'flex items-center px-2 py-1 rounded-full text-xs font-medium ml-2',
                  statusConfig[report.status].bg
                )}>
                  <StatusIcon className={clsx(
                    'w-3 h-3 mr-1',
                    statusConfig[report.status].color
                  )} />
                  <span className={statusConfig[report.status].color}>
                    {statusConfig[report.status].label}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {report.type}
                  </span>
                  <span className={clsx(
                    'px-2 py-0.5 rounded-full text-xs font-medium',
                    urgencyConfig[report.urgency]
                  )}>
                    {report.urgency}
                  </span>
                </div>
                <span className="text-xs text-gray-400 dark:text-gray-500">
                  {report.submittedAt}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-4 pt-4 border-t border-gray-200/50 dark:border-dark-3/50">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600 dark:text-gray-300">
            Total Submitted: <span className="font-semibold">47</span>
          </span>
          <div className="flex items-center space-x-4">
            <span className="text-green-600 dark:text-green-400">
              ✓ 38 Verified
            </span>
            <span className="text-yellow-600 dark:text-yellow-400">
              ⏳ 5 Pending
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
