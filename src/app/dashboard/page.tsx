export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-600 to-orange-500" />
              <span className="text-xl font-bold text-gray-900">Virtual Coach</span>
            </div>
            <nav className="flex items-center gap-6">
              <a href="/" className="text-gray-600 hover:text-gray-900">Home</a>
              <a href="/dashboard" className="text-blue-600 font-semibold">Dashboard</a>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Banner */}
        <div className="bg-gradient-to-r from-blue-600 to-orange-500 rounded-xl p-8 text-white mb-8">
          <h1 className="text-3xl font-bold mb-2">Welcome to Your Virtual Coach</h1>
          <p className="text-blue-100">
            Your personal AI cycling coach is being built. Phase 1 in progress!
          </p>
        </div>

        {/* Status Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 text-xl">
                ⚙️
              </div>
              <h3 className="font-semibold text-gray-900">System Status</h3>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Next.js App</span>
                <span className="text-green-600 font-semibold">✓ Running</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Database</span>
                <span className="text-yellow-600 font-semibold">⏳ Pending Setup</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">AI Coach</span>
                <span className="text-yellow-600 font-semibold">⏳ Coming Soon</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center text-orange-600 text-xl">
                📊
              </div>
              <h3 className="font-semibold text-gray-900">Development Progress</h3>
            </div>
            <div className="space-y-3">
              <div>
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="text-gray-600">Phase 1 MVP</span>
                  <span className="text-gray-900 font-semibold">25%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full" style={{ width: '25%' }}></div>
                </div>
              </div>
              <p className="text-xs text-gray-500">
                Project initialized. Authentication and data sync coming next.
              </p>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center text-green-600 text-xl">
                🎯
              </div>
              <h3 className="font-semibold text-gray-900">Next Milestone</h3>
            </div>
            <div className="space-y-2 text-sm">
              <p className="text-gray-600">Week 1, Day 1-3:</p>
              <ul className="space-y-1 text-gray-700">
                <li>• Supabase setup</li>
                <li>• Authentication system</li>
                <li>• User profiles</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Feature Previews */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Coach Chat Preview */}
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              🤖 AI Coach Chat (Coming in Week 3)
            </h3>
            <div className="bg-gray-50 rounded-lg p-4 space-y-3">
              <div className="bg-white rounded-lg p-3 shadow-sm">
                <p className="text-sm text-gray-600 mb-1">You</p>
                <p className="text-gray-900">How did my ride yesterday look?</p>
              </div>
              <div className="bg-blue-50 rounded-lg p-3 shadow-sm">
                <p className="text-sm text-blue-600 mb-1">Coach</p>
                <p className="text-gray-900">
                  Your 2-hour endurance ride was solid! You held 220W normalized power (88% FTP)
                  and accumulated 145 TSS. Heart rate stayed in zone 2-3 as planned.
                  Good discipline on the pacing.
                </p>
              </div>
            </div>
          </div>

          {/* Activity Feed Preview */}
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              📈 Recent Activities (Coming in Week 2)
            </h3>
            <div className="space-y-3">
              {[
                { type: 'Ride', tss: 145, duration: '2h 15m', date: 'Jan 19' },
                { type: 'Workout', tss: 68, duration: '1h 00m', date: 'Jan 17' },
                { type: 'Ride', tss: 198, duration: '3h 30m', date: 'Jan 14' },
              ].map((activity, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 font-semibold">
                      {activity.tss}
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">{activity.type}</div>
                      <div className="text-sm text-gray-600">{activity.duration}</div>
                    </div>
                  </div>
                  <div className="text-sm text-gray-500">{activity.date}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Fitness Metrics Preview */}
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              💪 Fitness Metrics (Coming in Week 2)
            </h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">72</div>
                <div className="text-xs text-gray-600 mt-1">CTL</div>
                <div className="text-xs text-gray-500">Fitness</div>
              </div>
              <div className="text-center p-4 bg-orange-50 rounded-lg">
                <div className="text-2xl font-bold text-orange-600">45</div>
                <div className="text-xs text-gray-600 mt-1">ATL</div>
                <div className="text-xs text-gray-500">Fatigue</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">+27</div>
                <div className="text-xs text-gray-600 mt-1">TSB</div>
                <div className="text-xs text-gray-500">Form</div>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-4 text-center">
              CTL = Chronic Training Load (fitness) • ATL = Acute Training Load (fatigue) • TSB = Training Stress Balance (form)
            </p>
          </div>

          {/* Training Plan Preview */}
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              📅 Training Plan (Coming in Phase 2)
            </h3>
            <div className="space-y-3">
              {[
                { day: 'Mon', workout: 'Rest Day', duration: '-' },
                { day: 'Tue', workout: 'Sweet Spot Intervals', duration: '1h 15m' },
                { day: 'Wed', workout: 'Easy Endurance', duration: '1h 30m' },
                { day: 'Thu', workout: 'VO2 Max Intervals', duration: '1h 00m' },
                { day: 'Fri', workout: 'Recovery Spin', duration: '45m' },
                { day: 'Sat', workout: 'Long Endurance Ride', duration: '3h 00m' },
                { day: 'Sun', workout: 'Optional Easy Ride', duration: '1h 30m' },
              ].map((day, i) => (
                <div key={i} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-3">
                    <div className="w-10 text-center font-semibold text-gray-600">{day.day}</div>
                    <div className="text-gray-900">{day.workout}</div>
                  </div>
                  <div className="text-gray-500">{day.duration}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Development Info */}
        <div className="mt-8 bg-blue-50 rounded-lg p-6 border border-blue-200">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">
            🚧 Development Mode
          </h3>
          <p className="text-blue-800 text-sm mb-4">
            This is a preview of the Virtual Coach dashboard. Features shown above are mockups
            and will be implemented during Phase 1 and Phase 2 of development.
          </p>
          <div className="flex gap-4">
            <a
              href="https://github.com/Marteau19/virtual_coach"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium text-blue-700 hover:text-blue-900"
            >
              View on GitHub →
            </a>
            <a
              href="/"
              className="text-sm font-medium text-blue-700 hover:text-blue-900"
            >
              Back to Home →
            </a>
          </div>
        </div>
      </main>
    </div>
  );
}
