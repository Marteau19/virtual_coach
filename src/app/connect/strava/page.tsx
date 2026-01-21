'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { getStravaAuthUrl } from '@/lib/strava/oauth';

export default function ConnectStravaPage() {
  const searchParams = useSearchParams();
  const [tokens, setTokens] = useState<any>(null);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    // Check for OAuth callback parameters
    const success = searchParams.get('success');
    const errorParam = searchParams.get('error');
    const accessToken = searchParams.get('access_token');
    const refreshToken = searchParams.get('refresh_token');
    const expiresAt = searchParams.get('expires_at');
    const athleteId = searchParams.get('athlete_id');
    const athleteName = searchParams.get('athlete_name');

    if (success && accessToken) {
      setTokens({
        accessToken,
        refreshToken,
        expiresAt: parseInt(expiresAt || '0'),
        athleteId,
        athleteName,
      });

      // Store in sessionStorage for test page
      sessionStorage.setItem('strava_access_token', accessToken);
      sessionStorage.setItem('strava_athlete_id', athleteId || '');
    }

    if (errorParam) {
      const errorMessages: Record<string, string> = {
        'access_denied': 'You denied access to Strava',
        'no_code': 'No authorization code received',
        'token_exchange_failed': 'Failed to exchange code for tokens',
      };
      setError(errorMessages[errorParam] || errorParam);
    }
  }, [searchParams]);

  const handleConnect = () => {
    window.location.href = getStravaAuthUrl();
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Connect Strava</h1>
          <p className="mt-2 text-gray-600">
            Connect your Strava account to fetch your training data automatically
          </p>
          <a href="/" className="mt-2 inline-block text-blue-600 hover:text-blue-800">
            ← Back to Home
          </a>
        </div>

        {/* Success State */}
        {tokens && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-8">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <svg className="h-12 w-12 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-semibold text-green-900 mb-2">
                  ✅ Successfully Connected!
                </h2>
                <p className="text-green-800 mb-4">
                  Your Strava account has been connected. Athlete: <strong>{tokens.athleteName}</strong>
                </p>
                <div className="bg-white rounded-lg p-4 mb-4">
                  <p className="text-sm text-gray-600 mb-2">Your access token (for testing):</p>
                  <code className="block text-xs bg-gray-100 p-2 rounded break-all">
                    {tokens.accessToken}
                  </code>
                  <p className="text-xs text-gray-500 mt-2">
                    Expires: {new Date(tokens.expiresAt * 1000).toLocaleString()}
                  </p>
                </div>
                <div className="flex gap-4">
                  <a
                    href="/test/strava"
                    className="inline-flex items-center px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
                  >
                    Test Integration →
                  </a>
                  <a
                    href="/dashboard"
                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Go to Dashboard →
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-8">
            <h2 className="text-xl font-semibold text-red-900 mb-2">
              ❌ Connection Failed
            </h2>
            <p className="text-red-800">{error}</p>
            <button
              onClick={handleConnect}
              className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Connection Card */}
        {!tokens && !error && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
            <div className="text-center">
              <div className="mx-auto w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mb-6">
                <svg className="w-12 h-12 text-orange-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M15.387 17.944l-2.089-4.116h-3.065L15.387 24l5.15-10.172h-3.066m-7.008-5.599l2.836 5.598h4.172L10.463 0l-7 13.828h4.169"/>
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Connect Your Strava Account
              </h2>
              <p className="text-gray-600 mb-8 max-w-lg mx-auto">
                Click the button below to authorize Virtual Coach to access your Strava activities.
                We'll request permission to read your activity data including power, heart rate, and other metrics.
              </p>

              <button
                onClick={handleConnect}
                className="inline-flex items-center px-8 py-4 bg-orange-600 text-white text-lg font-semibold rounded-lg hover:bg-orange-700 transition-colors shadow-lg hover:shadow-xl"
              >
                <svg className="w-6 h-6 mr-3" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M15.387 17.944l-2.089-4.116h-3.065L15.387 24l5.15-10.172h-3.066m-7.008-5.599l2.836 5.598h4.172L10.463 0l-7 13.828h4.169"/>
                </svg>
                Connect with Strava
              </button>

              <p className="mt-6 text-sm text-gray-500">
                You'll be redirected to Strava to authorize access
              </p>
            </div>
          </div>
        )}

        {/* What We'll Access */}
        <div className="mt-8 bg-blue-50 rounded-lg p-6 border border-blue-200">
          <h3 className="text-lg font-semibold text-blue-900 mb-4">
            📋 What We'll Access
          </h3>
          <ul className="space-y-2 text-blue-800 text-sm">
            <li className="flex items-start gap-2">
              <svg className="w-5 h-5 text-blue-600 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span><strong>Activity details:</strong> Distance, duration, elevation, route</span>
            </li>
            <li className="flex items-start gap-2">
              <svg className="w-5 h-5 text-blue-600 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span><strong>Performance metrics:</strong> Power data, heart rate, cadence</span>
            </li>
            <li className="flex items-start gap-2">
              <svg className="w-5 h-5 text-blue-600 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span><strong>Profile info:</strong> Name, athlete ID for identification</span>
            </li>
          </ul>
          <p className="mt-4 text-sm text-blue-700">
            We'll never modify or delete your activities without explicit permission.
            You can disconnect anytime from your Strava settings.
          </p>
        </div>

        {/* Instructions */}
        <div className="mt-8 bg-gray-100 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            🔧 Setup Required (First Time Only)
          </h3>
          <div className="text-gray-700 text-sm space-y-3">
            <p><strong>If you haven't set up your Strava API app yet:</strong></p>
            <ol className="list-decimal list-inside space-y-2 ml-4">
              <li>Go to <a href="https://www.strava.com/settings/api" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">strava.com/settings/api</a></li>
              <li>Create a new application with these settings:
                <ul className="list-disc list-inside ml-6 mt-1 space-y-1">
                  <li>Application Name: Virtual Coach</li>
                  <li>Website: {process.env.NEXT_PUBLIC_APP_URL}</li>
                  <li>Authorization Callback Domain: <code className="bg-white px-1 rounded">virtual-coach-ym5o.onrender.com</code></li>
                </ul>
              </li>
              <li>Add environment variables in Render:
                <ul className="list-disc list-inside ml-6 mt-1 space-y-1">
                  <li><code className="bg-white px-1 rounded">STRAVA_CLIENT_ID</code> = Your Client ID</li>
                  <li><code className="bg-white px-1 rounded">STRAVA_CLIENT_SECRET</code> = Your Client Secret</li>
                </ul>
              </li>
              <li>Save and redeploy your app</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}
