/**
 * Strava OAuth Configuration
 */

export const STRAVA_CONFIG = {
  clientId: process.env.STRAVA_CLIENT_ID || '',
  clientSecret: process.env.STRAVA_CLIENT_SECRET || '',
  redirectUri: `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/strava/callback`,

  // Scopes we need
  scopes: [
    'read',
    'activity:read_all', // Required to read all activity details
    'activity:write',    // Required to create activities (future)
  ].join(','),

  // Strava OAuth URLs
  authorizeUrl: 'https://www.strava.com/oauth/authorize',
  tokenUrl: 'https://www.strava.com/oauth/token',
};

/**
 * Generate Strava authorization URL
 */
export function getStravaAuthUrl(): string {
  const params = new URLSearchParams({
    client_id: STRAVA_CONFIG.clientId,
    redirect_uri: STRAVA_CONFIG.redirectUri,
    response_type: 'code',
    scope: STRAVA_CONFIG.scopes,
    approval_prompt: 'auto', // 'force' to always show consent
  });

  return `${STRAVA_CONFIG.authorizeUrl}?${params.toString()}`;
}
