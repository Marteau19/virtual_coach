export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-600 to-orange-500" />
              <span className="text-xl font-bold text-gray-900">Virtual Coach</span>
            </div>
            <nav className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-gray-600 hover:text-gray-900">Features</a>
              <a href="#how-it-works" className="text-gray-600 hover:text-gray-900">How It Works</a>
              <a href="#roadmap" className="text-gray-600 hover:text-gray-900">Roadmap</a>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h1 className="text-5xl font-bold tracking-tight text-gray-900 sm:text-6xl">
            Your AI-Powered
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-orange-500">
              Cycling Coach
            </span>
          </h1>
          <p className="mt-6 text-lg leading-8 text-gray-600 max-w-2xl mx-auto">
            Train smarter with personalized coaching powered by AI. Get honest feedback,
            custom training plans, and automatic workout sync to Zwift and Garmin.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <a
              href="/dashboard"
              className="rounded-lg bg-blue-600 px-6 py-3 text-base font-semibold text-white shadow-sm hover:bg-blue-500 transition-colors"
            >
              View Dashboard
            </a>
            <a
              href="/test/strava"
              className="rounded-lg bg-orange-600 px-6 py-3 text-base font-semibold text-white shadow-sm hover:bg-orange-700 transition-colors"
            >
              🧪 Test Strava
            </a>
            <a
              href="/test/intervals"
              className="rounded-lg bg-green-600 px-6 py-3 text-base font-semibold text-white shadow-sm hover:bg-green-500 transition-colors"
            >
              🧪 Test Intervals.icu
            </a>
            <a
              href="https://github.com/Marteau19/virtual_coach"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg bg-white px-6 py-3 text-base font-semibold text-gray-900 shadow-sm ring-1 ring-gray-300 hover:bg-gray-50 transition-colors"
            >
              View on GitHub
            </a>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="text-3xl font-bold text-blue-600">Phase 1</div>
            <div className="mt-2 text-sm text-gray-600">Currently Building</div>
            <div className="mt-4 text-gray-900">AI Coach Chat & Data Sync</div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="text-3xl font-bold text-orange-500">3 Weeks</div>
            <div className="mt-2 text-sm text-gray-600">To MVP</div>
            <div className="mt-4 text-gray-900">Full working coach system</div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="text-3xl font-bold text-green-600">$10-30</div>
            <div className="mt-2 text-sm text-gray-600">Per Month</div>
            <div className="mt-4 text-gray-900">vs $200-500 for real coach</div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
          What Makes Virtual Coach Different?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="text-2xl mb-4">🧠</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">AI-Powered Coaching</h3>
            <p className="text-gray-600">
              Uses Claude AI to analyze your training and provide personalized feedback with tough love when needed.
            </p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="text-2xl mb-4">📊</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Data-Driven Insights</h3>
            <p className="text-gray-600">
              Tracks CTL, ATL, TSB and other advanced metrics to optimize your training load.
            </p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="text-2xl mb-4">🔄</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Auto-Sync Everything</h3>
            <p className="text-gray-600">
              Workouts automatically sync to Zwift and Garmin via Intervals.icu. Zero manual steps.
            </p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="text-2xl mb-4">📅</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Smart Planning</h3>
            <p className="text-gray-600">
              Generates training plans based on your goals, availability, and current fitness level.
            </p>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            How It Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-xl mb-4">
                1
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Connect Your Data</h3>
              <p className="text-gray-600">
                Link your Intervals.icu account to pull in all your training data from Garmin, Strava, and Zwift.
              </p>
            </div>
            <div className="text-center">
              <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-xl mb-4">
                2
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Chat with Your Coach</h3>
              <p className="text-gray-600">
                Ask questions, get feedback on workouts, and receive personalized training advice based on your data.
              </p>
            </div>
            <div className="text-center">
              <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-xl mb-4">
                3
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Train & Improve</h3>
              <p className="text-gray-600">
                Follow your custom plan, complete workouts on Zwift or Garmin, and watch your fitness improve.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Roadmap Section */}
      <section id="roadmap" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
          Development Roadmap
        </h2>
        <div className="space-y-8 max-w-3xl mx-auto">
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
              ✓
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Phase 0: Planning (Complete)</h3>
              <p className="text-gray-600 mt-1">
                Architecture design, database schema, API research, and comprehensive documentation.
              </p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
              →
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Phase 1: MVP (3 weeks) - In Progress</h3>
              <p className="text-gray-600 mt-1">
                User authentication, Intervals.icu integration, AI coach chat, activity history, and fitness metrics.
              </p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center text-white font-bold">
              2
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Phase 2: Training Plans (3 weeks)</h3>
              <p className="text-gray-600 mt-1">
                AI-generated training plans, calendar view, automatic Zwift/Garmin sync, and adherence tracking.
              </p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center text-white font-bold">
              3
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Phase 3: Advanced Features (3 weeks)</h3>
              <p className="text-gray-600 mt-1">
                Weekly reviews, injury prevention, mobile PWA, and Strava integration.
              </p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center text-white font-bold">
              4
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Phase 4: Launch (2+ weeks)</h3>
              <p className="text-gray-600 mt-1">
                Testing, performance optimization, documentation, and production deployment.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Tech Stack */}
      <section className="bg-gray-50 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Built With Modern Tech
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="text-4xl mb-2">⚡</div>
              <div className="font-semibold text-gray-900">Next.js 14</div>
              <div className="text-sm text-gray-600">React Framework</div>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-2">🗄️</div>
              <div className="font-semibold text-gray-900">Supabase</div>
              <div className="text-sm text-gray-600">Database & Auth</div>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-2">🤖</div>
              <div className="font-semibold text-gray-900">Claude AI</div>
              <div className="text-sm text-gray-600">AI Coaching</div>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-2">📈</div>
              <div className="font-semibold text-gray-900">Intervals.icu</div>
              <div className="text-sm text-gray-600">Training Data</div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center text-gray-600">
            <p className="mb-4">
              Built with ❤️ for cyclists who want to train smarter, not just harder.
            </p>
            <div className="flex items-center justify-center gap-6">
              <a
                href="https://github.com/Marteau19/virtual_coach"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-gray-900"
              >
                GitHub
              </a>
              <a href="/ARCHITECTURE.md" className="hover:text-gray-900">
                Architecture
              </a>
              <a href="/ROADMAP.md" className="hover:text-gray-900">
                Roadmap
              </a>
            </div>
            <p className="mt-4 text-sm">
              © 2026 Virtual Coach. Open source project.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
