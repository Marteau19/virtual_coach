/**
 * API Route: Fetch activities from Strava
 * GET /api/strava/activities?access_token=xxx&days=30
 */

import { NextResponse } from 'next/server';
import { StravaClient, getUnixDateRange } from '@/lib/strava/client';

export async function GET(request: Request) {
  try {
    // Get query parameters
    const { searchParams } = new URL(request.url);
    const accessToken = searchParams.get('access_token');
    const daysParam = searchParams.get('days');
    const days = daysParam ? parseInt(daysParam, 10) : 30;

    // Validate access token
    if (!accessToken) {
      return NextResponse.json(
        {
          error: 'Missing access token',
          message: 'Please provide a Strava access token via ?access_token=xxx query parameter',
          howToGetToken: 'Go to https://www.strava.com/settings/api and create an app to get your access token',
        },
        { status: 400 }
      );
    }

    // Create Strava client
    const client = new StravaClient(accessToken);

    // Get date range
    const { after, before } = getUnixDateRange(days);

    console.log(`Fetching Strava activities from last ${days} days`);

    // Fetch activities
    const activities = await client.getActivities(1, 200, before, after);

    // Return response
    return NextResponse.json({
      success: true,
      count: activities.length,
      dateRange: {
        after: new Date(after * 1000).toISOString(),
        before: new Date(before * 1000).toISOString(),
        days,
      },
      activities: activities,
    });

  } catch (error: any) {
    console.error('Error fetching activities from Strava:', error);

    // Handle specific Strava errors
    if (error.response) {
      const status = error.response.status;
      const data = error.response.data;

      if (status === 401) {
        return NextResponse.json(
          {
            error: 'Unauthorized',
            message: 'Invalid or expired Strava access token',
            details: data,
          },
          { status: 401 }
        );
      }

      if (status === 429) {
        return NextResponse.json(
          {
            error: 'Rate limit exceeded',
            message: 'Strava API rate limit exceeded. Try again later.',
            details: data,
          },
          { status: 429 }
        );
      }

      return NextResponse.json(
        {
          error: 'Strava API error',
          message: data.message || 'Unknown error from Strava',
          status,
          details: data,
        },
        { status }
      );
    }

    const errorMessage = error instanceof Error ? error.message : 'Unknown error';

    return NextResponse.json(
      {
        error: 'Failed to fetch activities',
        message: errorMessage,
      },
      { status: 500 }
    );
  }
}
