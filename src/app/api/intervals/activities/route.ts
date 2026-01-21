/**
 * API Route: Fetch activities from Intervals.icu
 * GET /api/intervals/activities?days=90
 */

import { NextResponse } from 'next/server';
import { createIntervalsClient, getDateRange } from '@/lib/intervals/client';

export async function GET(request: Request) {
  try {
    // Get query parameters
    const { searchParams } = new URL(request.url);
    const daysParam = searchParams.get('days');
    const days = daysParam ? parseInt(daysParam, 10) : 90;

    // Create Intervals.icu client
    const client = createIntervalsClient();

    if (!client) {
      return NextResponse.json(
        {
          error: 'Intervals.icu not configured',
          message: 'Please add INTERVALS_ICU_API_KEY and INTERVALS_ICU_ATHLETE_ID environment variables',
        },
        { status: 503 }
      );
    }

    // Get date range
    const { oldest, newest } = getDateRange(days);

    console.log(`Fetching activities from ${oldest} to ${newest}`);

    // Fetch activities
    const activities = await client.getActivities(oldest, newest);

    // Return response
    return NextResponse.json({
      success: true,
      count: activities.length,
      dateRange: { oldest, newest },
      activities: activities,
    });

  } catch (error: unknown) {
    console.error('Error fetching activities from Intervals.icu:', error);

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
