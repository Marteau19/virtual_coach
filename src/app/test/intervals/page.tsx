'use client';

import { useState } from 'react';

export default function IntervalsTestPage() {
  const [activities, setActivities] = useState<any>(null);
  const [fitness, setFitness] = useState<any>(null);
  const [loading, setLoading] = useState<Record<string, boolean>>({});
  const [error, setError] = useState<Record<string, string>>({});

  const fetchActivities = async (days: number = 90) => {
    setLoading({ ...loading, activities: true });
    setError({ ...error, activities: '' });

    try {
      const response = await fetch(`/api/intervals/activities?days=${days}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch activities');
      }

      setActivities(data);
    } catch (err) {
      setError({ ...error, activities: err instanceof Error ? err.message : 'Unknown error' });
    } finally {
      setLoading({ ...loading, activities: false });
    }
  };

  const fetchFitness = async (days: number = 30) => {
    setLoading({ ...loading, fitness: true });
    setError({ ...error, fitness: '' });

    try {
      const response = await fetch(`/api/intervals/fitness?days=${days}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch fitness data');
      }

      setFitness(data);
    } catch (err) {
      setError({ ...error, fitness: err instanceof Error ? err.message : 'Unknown error' });
    } finally {
      setLoading({ ...loading, fitness: false });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Intervals.icu API Test</h1>
          <p className="mt-2 text-gray-600">
            Test fetching data from Intervals.icu API
          </p>
          <a href="/" className="mt-2 inline-block text-blue-600 hover:text-blue-800">
            ← Back to Home
          </a>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Activities Section */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              📊 Activities
            </h2>

            <div className="space-y-4 mb-6">
              <button
                onClick={() => fetchActivities(7)}
                disabled={loading.activities}
                className="w-full rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {loading.activities ? 'Loading...' : 'Fetch Last 7 Days'}
              </button>
              <button
                onClick={() => fetchActivities(30)}
                disabled={loading.activities}
                className="w-full rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {loading.activities ? 'Loading...' : 'Fetch Last 30 Days'}
              </button>
              <button
                onClick={() => fetchActivities(90)}
                disabled={loading.activities}
                className="w-full rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {loading.activities ? 'Loading...' : 'Fetch Last 90 Days'}
              </button>
            </div>

            {error.activities && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                <p className="text-red-800 text-sm font-medium">Error</p>
                <p className="text-red-600 text-sm">{error.activities}</p>
              </div>
            )}

            {activities && (
              <div className="bg-gray-50 rounded-lg p-4 overflow-auto max-h-[600px]">
                <pre className="text-xs">
                  {JSON.stringify(activities, null, 2)}
                </pre>
              </div>
            )}
          </div>

          {/* Fitness Section */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              💪 Fitness Data (CTL/ATL/TSB)
            </h2>

            <div className="space-y-4 mb-6">
              <button
                onClick={() => fetchFitness(7)}
                disabled={loading.fitness}
                className="w-full rounded-lg bg-green-600 px-4 py-2 text-white hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {loading.fitness ? 'Loading...' : 'Fetch Last 7 Days'}
              </button>
              <button
                onClick={() => fetchFitness(30)}
                disabled={loading.fitness}
                className="w-full rounded-lg bg-green-600 px-4 py-2 text-white hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {loading.fitness ? 'Loading...' : 'Fetch Last 30 Days'}
              </button>
              <button
                onClick={() => fetchFitness(90)}
                disabled={loading.fitness}
                className="w-full rounded-lg bg-green-600 px-4 py-2 text-white hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {loading.fitness ? 'Loading...' : 'Fetch Last 90 Days'}
              </button>
            </div>

            {error.fitness && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                <p className="text-red-800 text-sm font-medium">Error</p>
                <p className="text-red-600 text-sm">{error.fitness}</p>
              </div>
            )}

            {fitness && (
              <div className="bg-gray-50 rounded-lg p-4 overflow-auto max-h-[600px]">
                <pre className="text-xs">
                  {JSON.stringify(fitness, null, 2)}
                </pre>
              </div>
            )}
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-8 bg-blue-50 rounded-lg p-6 border border-blue-200">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">
            📝 Instructions
          </h3>
          <div className="text-blue-800 text-sm space-y-2">
            <p>
              <strong>To test this:</strong>
            </p>
            <ol className="list-decimal list-inside space-y-1 ml-4">
              <li>Make sure you've added <code className="bg-blue-100 px-1 rounded">INTERVALS_ICU_API_KEY</code> to Render</li>
              <li>Make sure you've added <code className="bg-blue-100 px-1 rounded">INTERVALS_ICU_ATHLETE_ID</code> to Render</li>
              <li>Redeploy your app on Render after adding the variables</li>
              <li>Click the buttons above to fetch your data</li>
            </ol>
            <p className="mt-4">
              <strong>Where to get your Intervals.icu credentials:</strong>
            </p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>Go to <a href="https://intervals.icu/settings" target="_blank" rel="noopener noreferrer" className="underline">intervals.icu/settings</a></li>
              <li>Scroll to "Developer Settings"</li>
              <li>Generate an API key</li>
              <li>Your Athlete ID is in the URL: <code className="bg-blue-100 px-1 rounded">intervals.icu/athlete/i123456</code></li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
