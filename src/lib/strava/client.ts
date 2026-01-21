/**
 * Strava API Client
 * Documentation: https://developers.strava.com/docs/reference/
 */

import axios, { AxiosInstance } from 'axios';

export interface StravaActivity {
  id: number;
  name: string;
  distance: number; // meters
  moving_time: number; // seconds
  elapsed_time: number; // seconds
  total_elevation_gain: number; // meters
  type: string; // 'Ride', 'Run', etc.
  sport_type: string;
  start_date: string;
  start_date_local: string;
  timezone: string;
  achievement_count: number;
  kudos_count: number;
  comment_count: number;
  athlete_count: number;
  photo_count: number;
  trainer: boolean;
  commute: boolean;
  manual: boolean;
  private: boolean;
  flagged: boolean;
  average_speed: number;
  max_speed: number;
  average_watts?: number;
  weighted_average_watts?: number;
  kilojoules?: number;
  device_watts?: boolean;
  average_heartrate?: number;
  max_heartrate?: number;
  average_cadence?: number;
  [key: string]: unknown;
}

export interface StravaDetailedActivity extends StravaActivity {
  description: string;
  calories: number;
  segment_efforts: unknown[];
  splits_metric: unknown[];
  laps: unknown[];
  gear: unknown;
  [key: string]: unknown;
}

export interface StravaAthlete {
  id: number;
  username: string;
  firstname: string;
  lastname: string;
  city: string;
  state: string;
  country: string;
  sex: string;
  premium: boolean;
  created_at: string;
  updated_at: string;
  [key: string]: unknown;
}

export class StravaClient {
  private client: AxiosInstance;

  constructor(accessToken: string) {
    this.client = axios.create({
      baseURL: 'https://www.strava.com/api/v3',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      timeout: 30000,
    });
  }

  /**
   * Get authenticated athlete
   */
  async getAthlete(): Promise<StravaAthlete> {
    const response = await this.client.get<StravaAthlete>('/athlete');
    return response.data;
  }

  /**
   * Get athlete activities
   * @param page Page number (default 1)
   * @param perPage Results per page (default 30, max 200)
   * @param before Unix timestamp (optional)
   * @param after Unix timestamp (optional)
   */
  async getActivities(
    page: number = 1,
    perPage: number = 30,
    before?: number,
    after?: number
  ): Promise<StravaActivity[]> {
    const params: Record<string, number> = {
      page,
      per_page: perPage,
    };

    if (before) params.before = before;
    if (after) params.after = after;

    const response = await this.client.get<StravaActivity[]>('/athlete/activities', {
      params,
    });

    return response.data;
  }

  /**
   * Get detailed activity by ID
   * @param activityId Activity ID
   * @param includeAllEfforts Include all segment efforts
   */
  async getActivity(
    activityId: number,
    includeAllEfforts: boolean = false
  ): Promise<StravaDetailedActivity> {
    const params = includeAllEfforts ? { include_all_efforts: true } : {};

    const response = await this.client.get<StravaDetailedActivity>(
      `/activities/${activityId}`,
      { params }
    );

    return response.data;
  }

  /**
   * Get activity zones (power, heart rate)
   */
  async getActivityZones(activityId: number): Promise<unknown> {
    const response = await this.client.get(`/activities/${activityId}/zones`);
    return response.data;
  }

  /**
   * Get activity streams (detailed data like power, HR, GPS)
   * @param activityId Activity ID
   * @param keys Array of stream types: 'time', 'latlng', 'distance', 'altitude', 'velocity_smooth', 'heartrate', 'cadence', 'watts', 'temp', 'moving', 'grade_smooth'
   * @param keyByType Return streams keyed by type
   */
  async getActivityStreams(
    activityId: number,
    keys: string[] = ['time', 'watts', 'heartrate', 'cadence'],
    keyByType: boolean = true
  ): Promise<unknown> {
    const response = await this.client.get(
      `/activities/${activityId}/streams`,
      {
        params: {
          keys: keys.join(','),
          key_by_type: keyByType,
        },
      }
    );

    return response.data;
  }
}

/**
 * Helper to get date range in Unix timestamps
 */
export function getUnixDateRange(daysAgo: number = 30): { after: number; before: number } {
  const before = Math.floor(Date.now() / 1000);
  const after = before - (daysAgo * 24 * 60 * 60);

  return { after, before };
}

/**
 * Calculate Training Stress Score (TSS) from Strava activity
 * TSS = (seconds * NP * IF) / (FTP * 3600) * 100
 * where IF = NP / FTP
 */
export function calculateTSS(
  normalizedPower: number,
  duration: number,
  ftp: number
): number {
  if (!normalizedPower || !duration || !ftp) return 0;

  const intensityFactor = normalizedPower / ftp;
  const tss = (duration * normalizedPower * intensityFactor) / (ftp * 3600) * 100;

  return Math.round(tss);
}
