/**
 * Intervals.icu API Client
 * Documentation: https://intervals.icu/api-docs.html
 * Swagger: https://intervals.icu/api/v1/docs/swagger-ui/index.html
 */

import axios, { AxiosInstance } from 'axios';
import { IntervalsActivity, IntervalsEvent, IntervalsFitnessData } from '@/types';

export class IntervalsIcuClient {
  private client: AxiosInstance;
  private athleteId: string;

  constructor(apiKey: string, athleteId: string) {
    this.athleteId = athleteId;

    // Create axios instance with base configuration
    this.client = axios.create({
      baseURL: 'https://intervals.icu/api/v1',
      headers: {
        'Authorization': `Basic ${Buffer.from(`API_KEY:${apiKey}`).toString('base64')}`,
        'Content-Type': 'application/json',
      },
      timeout: 30000, // 30 second timeout
    });
  }

  /**
   * Get activities for athlete
   * @param oldest ISO date string (optional) - default is 90 days ago
   * @param newest ISO date string (optional) - default is today
   */
  async getActivities(oldest?: string, newest?: string): Promise<IntervalsActivity[]> {
    const params: Record<string, string> = {};

    if (oldest) params.oldest = oldest;
    if (newest) params.newest = newest;

    const response = await this.client.get<IntervalsActivity[]>(
      `/athlete/${this.athleteId}/activities`,
      { params }
    );

    return response.data;
  }

  /**
   * Get a single activity by ID
   */
  async getActivity(activityId: string): Promise<IntervalsActivity> {
    const response = await this.client.get<IntervalsActivity>(
      `/activity/${activityId}`
    );
    return response.data;
  }

  /**
   * Get fitness data (CTL, ATL, TSB)
   * @param oldest ISO date string (optional)
   * @param newest ISO date string (optional)
   */
  async getFitnessData(oldest?: string, newest?: string): Promise<IntervalsFitnessData[]> {
    const params: Record<string, string> = {};

    if (oldest) params.oldest = oldest;
    if (newest) params.newest = newest;

    const response = await this.client.get<IntervalsFitnessData[]>(
      `/athlete/${this.athleteId}/fitness`,
      { params }
    );

    return response.data;
  }

  /**
   * Get wellness data (sleep, HRV, etc.)
   */
  async getWellness(oldest?: string, newest?: string): Promise<unknown[]> {
    const params: Record<string, string> = {};

    if (oldest) params.oldest = oldest;
    if (newest) params.newest = newest;

    const response = await this.client.get(
      `/athlete/${this.athleteId}/wellness`,
      { params }
    );

    return response.data;
  }

  /**
   * Get events (workouts, races, notes)
   */
  async getEvents(oldest?: string, newest?: string): Promise<IntervalsEvent[]> {
    const params: Record<string, string> = {};

    if (oldest) params.oldest = oldest;
    if (newest) params.newest = newest;

    const response = await this.client.get<IntervalsEvent[]>(
      `/athlete/${this.athleteId}/events`,
      { params }
    );

    return response.data;
  }

  /**
   * Create a new event (workout/race/note)
   */
  async createEvent(event: Partial<IntervalsEvent>): Promise<IntervalsEvent> {
    const response = await this.client.post<IntervalsEvent>(
      `/athlete/${this.athleteId}/events`,
      event
    );
    return response.data;
  }

  /**
   * Update an existing event
   */
  async updateEvent(eventId: string, event: Partial<IntervalsEvent>): Promise<IntervalsEvent> {
    const response = await this.client.put<IntervalsEvent>(
      `/athlete/${this.athleteId}/events/${eventId}`,
      event
    );
    return response.data;
  }

  /**
   * Delete an event
   */
  async deleteEvent(eventId: string): Promise<void> {
    await this.client.delete(`/athlete/${this.athleteId}/events/${eventId}`);
  }

  /**
   * Get athlete information
   */
  async getAthleteInfo(): Promise<unknown> {
    const response = await this.client.get(`/athlete/${this.athleteId}`);
    return response.data;
  }
}

/**
 * Helper function to create client from environment variables (server-side only)
 */
export function createIntervalsClient(): IntervalsIcuClient | null {
  const apiKey = process.env.INTERVALS_ICU_API_KEY;
  const athleteId = process.env.INTERVALS_ICU_ATHLETE_ID;

  if (!apiKey || !athleteId) {
    console.warn('Intervals.icu credentials not configured');
    return null;
  }

  return new IntervalsIcuClient(apiKey, athleteId);
}

/**
 * Helper to get date range for queries
 */
export function getDateRange(daysAgo: number = 90): { oldest: string; newest: string } {
  const newest = new Date();
  const oldest = new Date();
  oldest.setDate(oldest.getDate() - daysAgo);

  return {
    oldest: oldest.toISOString().split('T')[0],
    newest: newest.toISOString().split('T')[0],
  };
}
