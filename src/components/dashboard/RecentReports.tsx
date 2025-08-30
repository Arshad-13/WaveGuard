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

const mockReports: Report[] = [];

const statusConfig = {
  pending: {
    icon: Clock,
    color: 'text-yellow-600',
    bg: 'bg-yellow-100',
    label: 'Under Review'
  },
  verified: {
    icon: CheckCircle,
    color: 'text-green-600',
    bg: 'bg-green-100',
    label: 'Verified'
  },
  rejected: {
    icon: XCircle,
    color: 'text-red-600',
    bg: 'bg-red-100',
    label: 'Rejected'
  }
};

const urgencyConfig = {
  low: 'bg-green-100 text-green-800',
  medium: 'bg-yellow-100 text-yellow-800',
  high: 'bg-red-100 text-red-800'
};

export function RecentReports() {
  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-xl border border-gray-200/50 p-6 flex flex-col h-full shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">
          Recent Reports
        </h3>
        <button className="text-ocean-600 hover:text-ocean-700 text-sm font-medium">
          View All →
        </button>
      </div>

      <div className="space-y-3 overflow-y-auto flex-1">
        {mockReports.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-gray-500">
            <Clock className="w-12 h-12 mb-3 text-gray-300" />
            <p className="text-sm font-medium">No recent reports</p>
            <p className="text-xs text-gray-400 mt-1">Your submitted reports will appear here</p>
          </div>
        ) : (
          mockReports.map((report) => {
            const StatusIcon = statusConfig[report.status].icon;
            
            return (
              <div
                key={report.id}
                className="p-3 rounded-lg border border-gray-200/50 hover:bg-gray-50/50 transition-colors cursor-pointer"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-gray-900 text-sm truncate">
                      {report.title}
                    </h4>
                    <div className="flex items-center text-xs text-gray-500 mt-1">
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
                    <span className="text-xs text-gray-500">
                      {report.type}
                    </span>
                    <span className={clsx(
                      'px-2 py-0.5 rounded-full text-xs font-medium',
                      urgencyConfig[report.urgency]
                    )}>
                      {report.urgency}
                    </span>
                  </div>
                  <span className="text-xs text-gray-400">
                    {report.submittedAt}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>

      <div className="mt-4 pt-4 border-t border-gray-200/50 flex-shrink-0">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">
            Total Submitted: <span className="font-semibold">0</span>
          </span>
          <div className="flex items-center space-x-4">
            <span className="text-green-600">
              ✓ 0 Verified
            </span>
            <span className="text-yellow-600">
              ⏳ 0 Pending
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
