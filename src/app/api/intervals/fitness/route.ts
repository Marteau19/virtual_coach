/**
 * API Route: Fetch fitness data from Intervals.icu
 * GET /api/intervals/fitness?days=30
 */

import { NextResponse } from 'next/server';
import { createIntervalsClient, getDateRange } from '@/lib/intervals/client';

export async function GET(request: Request) {
  try {
    // Get query parameters
    const { searchParams } = new URL(request.url);
    const daysParam = searchParams.get('days');
    const days = daysParam ? parseInt(daysParam, 10) : 30;

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

    console.log(`Fetching fitness data from ${oldest} to ${newest}`);

    // Fetch fitness data
    const fitnessData = await client.getFitnessData(oldest, newest);

    // Get latest metrics
    const latestMetrics = fitnessData.length > 0
      ? fitnessData[fitnessData.length - 1]
      : null;

    // Return response
    return NextResponse.json({
      success: true,
      count: fitnessData.length,
      dateRange: { oldest, newest },
      latest: latestMetrics,
      data: fitnessData,
    });

  } catch (error: unknown) {
    console.error('Error fetching fitness data from Intervals.icu:', error);

    const errorMessage = error instanceof Error ? error.message : 'Unknown error';

    return NextResponse.json(
      {
        error: 'Failed to fetch fitness data',
        message: errorMessage,
      },
      { status: 500 }
    );
  }
}
