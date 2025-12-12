export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-2xl mx-auto px-4 text-center">
        <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
          Job Search Assistant
        </h1>
        <p className="text-xl text-gray-700 dark:text-gray-300 mb-8">
          AI-powered career assistant to help you find your dream job
        </p>
        <div className="flex gap-4 justify-center">
          <a
            href="/onboarding"
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Get Started
          </a>
          <a
            href="/dashboard"
            className="px-6 py-3 bg-white text-blue-600 border-2 border-blue-600 rounded-lg hover:bg-blue-50 transition-colors font-medium"
          >
            Dashboard
          </a>
        </div>
      </div>
    </div>
  );
}
