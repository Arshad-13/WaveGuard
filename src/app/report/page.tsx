import { ReportForm } from '@/components/report/ReportForm';

export default function ReportPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-cyan-700 text-white">
      <div className="container mx-auto max-w-3xl px-6 py-12">
        
        {/* Header */}
        <header className="mb-10">
          <h1 className="text-4xl font-extrabold tracking-tight">
            Report Coastal Activity
          </h1>
          <p className="mt-3 text-lg text-blue-100">
            Help us protect coastal ecosystems by reporting illegal activities and unsafe behavior. 
            Your voice keeps our coasts safe and thriving 🌊
          </p>
        </header>

        {/* Info Sections */}
        <div className="space-y-6 mb-10">
          {/* Awareness box */}
          <div className="rounded-xl bg-blue-600 p-6 shadow-lg">
            <h2 className="text-xl font-semibold">🌊 Help Protect Our Coasts</h2>
            <p className="mt-2 text-blue-100">
              Report activities like garbage dumping, illegal fishing, or pollution. 
              Every report contributes to environmental protection and community safety.
            </p>
          </div>

          {/* Emergency box */}
          <div className="rounded-xl bg-red-600 p-6 shadow-lg">
            <h2 className="text-xl font-semibold">🚨 Emergency?</h2>
            <p className="mt-2 text-red-100">
              For urgent emergencies, call local authorities immediately.  
              This form is for non-urgent reporting and documentation only.
            </p>
          </div>
        </div>

        {/* Report Form */}
        <div className="rounded-xl bg-white text-gray-900 shadow-xl p-8">
          <ReportForm />
        </div>
      </div>
    </div>
  );
}
