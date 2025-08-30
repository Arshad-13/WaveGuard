import { ChatInterface } from '@/components/chatbot/ChatInterface';

export default function ChatbotPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-100 to-blue-50 dark:from-dark-2 dark:to-dark">
      <div className="container mx-auto px-6 py-12">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            AI Coastal Assistant
          </h1>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Ask questions about coastal threats, get real-time updates, and receive expert guidance 
            on marine safety and emergency preparedness.
          </p>
        </div>
        
        <ChatInterface />
      </div>
    </div>
  );
}
