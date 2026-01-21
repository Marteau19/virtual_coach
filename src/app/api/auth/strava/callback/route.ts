/**
 * Strava OAuth Callback
 * Handles the redirect from Strava after user authorizes
 */

import { NextResponse } from 'next/server';
import { STRAVA_CONFIG } from '@/lib/strava/oauth';
import axios from 'axios';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');
    const error = searchParams.get('error');
    const scope = searchParams.get('scope');

    // Check for authorization errors
    if (error) {
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_APP_URL}/connect/strava?error=${error}`
      );
    }

    if (!code) {
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_APP_URL}/connect/strava?error=no_code`
      );
    }

    console.log('Exchanging authorization code for tokens...');
    console.log('Scope granted:', scope);

    // Exchange code for tokens
    const tokenResponse = await axios.post(STRAVA_CONFIG.tokenUrl, {
      client_id: STRAVA_CONFIG.clientId,
      client_secret: STRAVA_CONFIG.clientSecret,
      code,
      grant_type: 'authorization_code',
    });

    const {
      access_token,
      refresh_token,
      expires_at,
      athlete,
    } = tokenResponse.data;

    console.log('Token exchange successful!');
    console.log('Athlete:', athlete.id, athlete.firstname, athlete.lastname);

    // TODO: Store tokens in Supabase user_profiles table
    // For now, we'll redirect with tokens in URL (temporary, not secure for production)

    // Encode tokens for URL
    const params = new URLSearchParams({
      access_token,
      refresh_token,
      expires_at: expires_at.toString(),
      athlete_id: athlete.id.toString(),
      athlete_name: `${athlete.firstname} ${athlete.lastname}`,
      success: 'true',
    });

    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_APP_URL}/connect/strava?${params.toString()}`
    );

  } catch (error: any) {
    console.error('Strava OAuth error:', error.response?.data || error.message);

    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_APP_URL}/connect/strava?error=token_exchange_failed`
    );
  }
}
