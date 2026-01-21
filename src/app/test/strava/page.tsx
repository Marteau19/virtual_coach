'use client';

import { useState, useEffect } from 'react';

export default function StravaTestPage() {
  const [accessToken, setAccessToken] = useState<string>('');
  const [activities, setActivities] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [isConnected, setIsConnected] = useState<boolean>(false);

  // Check for stored token on mount
  useEffect(() => {
    const storedToken = sessionStorage.getItem('strava_access_token');
    if (storedToken) {
      setAccessToken(storedToken);
      setIsConnected(true);
    }
  }, []);

  const fetchActivities = async (days: number = 30) => {
    if (!accessToken.trim()) {
      setError('Please enter your Strava access token');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch(
        `/api/strava/activities?access_token=${encodeURIComponent(accessToken)}&days=${days}`
      );
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch activities');
      }

      setActivities(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Strava API Test</h1>
          <p className="mt-2 text-gray-600">
            Test fetching data directly from Strava API
          </p>
          <a href="/" className="mt-2 inline-block text-blue-600 hover:text-blue-800">
            ← Back to Home
          </a>
        </div>

        {/* Connection Status */}
        {isConnected ? (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <p className="text-green-900 font-semibold">Connected to Strava</p>
                  <p className="text-green-700 text-sm">Using OAuth token from session</p>
                </div>
              </div>
              <a
                href="/connect/strava"
                className="text-sm text-green-700 hover:text-green-900 underline"
              >
                Reconnect
              </a>
            </div>
          </div>
        ) : (
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <svg className="w-6 h-6 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <div>
                  <p className="text-orange-900 font-semibold">Not Connected</p>
                  <p className="text-orange-700 text-sm">Connect with OAuth for automatic authentication</p>
                </div>
              </div>
              <a
                href="/connect/strava"
                className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors font-medium"
              >
                Connect Strava
              </a>
            </div>
          </div>
        )}

        {/* Access Token Input */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            🔑 Strava Access Token
          </h2>
          <p className="text-sm text-gray-600 mb-4">
            Enter your Strava access token to fetch your activities. Your token is only used for this session and is not stored.
          </p>
          <input
            type="text"
            value={accessToken}
            onChange={(e) => setAccessToken(e.target.value)}
            placeholder="Paste your Strava access token here..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 font-mono text-sm"
          />
          <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-900 font-semibold mb-2">How to get your access token:</p>
            <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
              <li>Go to <a href="https://www.strava.com/settings/api" target="_blank" rel="noopener noreferrer" className="underline">strava.com/settings/api</a></li>
              <li>Create an app (or use an existing one)</li>
              <li>Use the "Access Token" shown on the app page</li>
              <li>
                Or use the OAuth flow (more secure, coming soon) - for now, the API token works for testing
              </li>
            </ol>
          </div>
        </div>

        {/* Activities Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            🚴 Your Activities
          </h2>

          <div className="space-y-4 mb-6">
            <button
              onClick={() => fetchActivities(7)}
              disabled={loading || !accessToken.trim()}
              className="w-full rounded-lg bg-orange-600 px-4 py-2 text-white hover:bg-orange-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {loading ? 'Loading...' : 'Fetch Last 7 Days'}
            </button>
            <button
              onClick={() => fetchActivities(30)}
              disabled={loading || !accessToken.trim()}
              className="w-full rounded-lg bg-orange-600 px-4 py-2 text-white hover:bg-orange-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {loading ? 'Loading...' : 'Fetch Last 30 Days'}
            </button>
            <button
              onClick={() => fetchActivities(90)}
              disabled={loading || !accessToken.trim()}
              className="w-full rounded-lg bg-orange-600 px-4 py-2 text-white hover:bg-orange-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {loading ? 'Loading...' : 'Fetch Last 90 Days'}
            </button>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
              <p className="text-red-800 text-sm font-medium">Error</p>
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          {activities && (
            <div>
              {/* Summary */}
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                <p className="text-green-800 font-semibold">
                  ✅ Successfully fetched {activities.count} activities!
                </p>
                <p className="text-green-700 text-sm mt-1">
                  Date range: {new Date(activities.dateRange.after).toLocaleDateString()} to{' '}
                  {new Date(activities.dateRange.before).toLocaleDateString()}
                </p>
              </div>

              {/* Activity Cards */}
              <div className="space-y-4 mb-6">
                {activities.activities.slice(0, 5).map((activity: any) => (
                  <div key={activity.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">{activity.name}</h3>
                        <p className="text-sm text-gray-500">
                          {new Date(activity.start_date_local).toLocaleString()}
                        </p>
                      </div>
                      <span className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-xs font-medium">
                        {activity.type}
                      </span>
                    </div>
                    <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-gray-500">Distance</p>
                        <p className="font-semibold text-gray-900">
                          {(activity.distance / 1000).toFixed(2)} km
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500">Duration</p>
                        <p className="font-semibold text-gray-900">
                          {Math.floor(activity.moving_time / 60)} min
                        </p>
                      </div>
                      {activity.average_watts && (
                        <div>
                          <p className="text-gray-500">Avg Power</p>
                          <p className="font-semibold text-gray-900">
                            {Math.round(activity.average_watts)} W
                          </p>
                        </div>
                      )}
                      {activity.average_heartrate && (
                        <div>
                          <p className="text-gray-500">Avg HR</p>
                          <p className="font-semibold text-gray-900">
                            {Math.round(activity.average_heartrate)} bpm
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Full JSON */}
              <details className="bg-gray-50 rounded-lg p-4">
                <summary className="cursor-pointer font-medium text-gray-900">
                  View Full JSON Response
                </summary>
                <div className="mt-4 overflow-auto max-h-[600px]">
                  <pre className="text-xs">
                    {JSON.stringify(activities, null, 2)}
                  </pre>
                </div>
              </details>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="mt-8 bg-orange-50 rounded-lg p-6 border border-orange-200">
          <h3 className="text-lg font-semibold text-orange-900 mb-2">
            📝 About Strava Integration
          </h3>
          <div className="text-orange-800 text-sm space-y-2">
            <p>
              This test page uses Strava's API directly to fetch your activity data with full details including:
            </p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>Distance, duration, and elevation gain</li>
              <li>Power data (average and normalized power)</li>
              <li>Heart rate data</li>
              <li>Cadence, speed, and more</li>
            </ul>
            <p className="mt-4">
              <strong>Next steps:</strong> Once we verify this works, we'll add OAuth authentication so you don't need to manually paste your token.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
