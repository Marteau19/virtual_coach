/**
 * Core TypeScript types for Virtual Coach application
 * Based on schema.sql database design
 */

// ============================================================================
// Database Types (matching Supabase schema)
// ============================================================================

export interface UserProfile {
  id: string;
  user_id: string;
  name: string | null;
  ftp: number | null; // Functional Threshold Power (watts)
  max_hr: number | null; // Maximum Heart Rate (bpm)
  weight_kg: number | null;
  timezone: string;
  coach_personality: CoachPersonality;
  intervals_icu_athlete_id: string | null;
  intervals_icu_api_key: string | null; // Encrypted
  strava_athlete_id: string | null;
  strava_access_token: string | null; // Encrypted
  strava_refresh_token: string | null; // Encrypted
  strava_token_expires_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface CoachPersonality {
  toughness: number; // 1-10 scale
  encouragement: number; // 1-10 scale
  detail_level: 'low' | 'medium' | 'high';
  communication_style: 'direct' | 'gentle' | 'motivational';
}

export interface Activity {
  id: string;
  user_id: string;
  external_id: string;
  source: 'intervals_icu' | 'strava' | 'garmin';
  activity_type: string; // 'Ride', 'Run', 'Workout', 'VirtualRide'
  name: string | null;
  description: string | null;
  start_date: string;
  duration_seconds: number;
  distance_meters: number | null;
  tss: number | null; // Training Stress Score
  intensity_factor: number | null;
  avg_power: number | null;
  normalized_power: number | null;
  max_power: number | null;
  avg_hr: number | null;
  max_hr: number | null;
  elevation_gain: number | null;
  avg_cadence: number | null;
  calories: number | null;
  raw_data: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export interface TrainingPlan {
  id: string;
  user_id: string;
  name: string;
  description: string | null;
  start_date: string;
  end_date: string;
  goal: string | null;
  goal_description: string | null;
  status: 'active' | 'completed' | 'archived' | 'paused';
  generated_by: 'ai' | 'manual';
  generation_prompt: string | null;
  plan_data: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export interface Workout {
  id: string;
  training_plan_id: string | null;
  user_id: string;
  scheduled_date: string;
  workout_type: string; // 'interval', 'endurance', 'tempo', 'recovery', 'race'
  name: string;
  description: string | null;
  instructions: string | null;
  duration_minutes: number;
  target_tss: number | null;
  workout_data: WorkoutStructure;
  completed: boolean;
  completed_at: string | null;
  completed_activity_id: string | null;
  completion_notes: string | null;
  zwo_file_url: string | null;
  exported_to_garmin: boolean;
  exported_to_garmin_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface WorkoutStructure {
  warmup?: WorkoutSegment;
  intervals?: WorkoutInterval[];
  cooldown?: WorkoutSegment;
  notes?: string;
}

export interface WorkoutSegment {
  duration_minutes: number;
  power_low?: number; // % of FTP
  power_high?: number; // % of FTP
  cadence?: number;
  description?: string;
}

export interface WorkoutInterval {
  repeat: number;
  on_duration_minutes: number;
  on_power: number; // % of FTP
  off_duration_minutes: number;
  off_power: number; // % of FTP
  description?: string;
}

export interface CoachConversation {
  id: string;
  user_id: string;
  message: string;
  role: 'user' | 'assistant';
  context: CoachContext | null;
  tokens_used: number | null;
  model_version: string | null;
  created_at: string;
}

export interface CoachContext {
  recent_activities?: Activity[];
  fitness_metrics?: FitnessMetrics;
  current_plan?: TrainingPlan;
  user_profile?: UserProfile;
}

export interface FitnessMetrics {
  id: string;
  user_id: string;
  date: string;
  ctl: number | null; // Chronic Training Load (Fitness)
  atl: number | null; // Acute Training Load (Fatigue)
  tsb: number | null; // Training Stress Balance (Form)
  ramp_rate: number | null;
  computed_ftp: number | null;
  weight_kg: number | null;
  resting_hr: number | null;
  hrv: number | null;
  sleep_hours: number | null;
  sleep_quality: number | null; // 1-10 scale
  soreness: number | null; // 1-10 scale
  fatigue: number | null; // 1-10 scale
  mood: number | null; // 1-10 scale
  created_at: string;
}

export interface UserAvailability {
  id: string;
  user_id: string;
  day_of_week: number; // 0=Sunday, 1=Monday, ..., 6=Saturday
  time_slot: 'early_morning' | 'morning' | 'midday' | 'afternoon' | 'evening';
  duration_minutes: number;
  is_available: boolean;
  preferred_workout_type: 'indoor' | 'outdoor' | 'any' | null;
  created_at: string;
  updated_at: string;
}

export interface SyncStatus {
  id: string;
  user_id: string;
  source: 'intervals_icu' | 'strava' | 'garmin';
  last_sync_at: string | null;
  last_sync_status: 'success' | 'error' | 'partial';
  last_sync_error: string | null;
  activities_synced: number;
  created_at: string;
  updated_at: string;
}

// ============================================================================
// Intervals.icu API Types
// ============================================================================

export interface IntervalsActivity {
  id: string;
  start_date_local: string;
  type: string;
  name: string;
  distance: number;
  moving_time: number;
  elapsed_time: number;
  total_elevation_gain: number;
  icu_training_load: number; // TSS
  icu_intensity: number;
  avg_watts: number;
  weighted_avg_watts: number;
  max_watts: number;
  avg_hr: number;
  max_hr: number;
  avg_cadence: number;
  calories: number;
  [key: string]: unknown;
}

export interface IntervalsEvent {
  id?: string;
  category: 'WORKOUT' | 'NOTE' | 'RACE';
  start_date_local: string;
  name: string;
  description?: string;
  workout_doc?: IntervalsWorkoutDoc;
  [key: string]: unknown;
}

export interface IntervalsWorkoutDoc {
  // Intervals.icu workout structure
  // This will be filled in during Phase 2 implementation
  [key: string]: unknown;
}

export interface IntervalsFitnessData {
  date: string;
  ctl: number;
  atl: number;
  tsb: number;
  ramp_rate: number;
  [key: string]: unknown;
}

// ============================================================================
// Claude AI Types
// ============================================================================

export interface ClaudeMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface ClaudeResponse {
  content: string;
  tokens_used: number;
  model: string;
}

// ============================================================================
// Application Types
// ============================================================================

export interface PlanGenerationParams {
  goal: string;
  goal_description?: string;
  duration_weeks: number;
  start_date: string;
  availability: UserAvailability[];
  current_fitness?: FitnessMetrics;
}

export interface ActivitySummary {
  total_activities: number;
  total_duration_hours: number;
  total_distance_km: number;
  total_tss: number;
  avg_tss_per_week: number;
}

export interface FormStatus {
  tsb: number;
  status: 'Fresh' | 'Recovered' | 'Neutral' | 'Tired' | 'Very Tired';
  recommendation: string;
}
