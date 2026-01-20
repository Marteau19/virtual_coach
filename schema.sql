-- Virtual Coach Database Schema
-- PostgreSQL / Supabase
-- Version: 1.0
-- Date: 2026-01-20

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- USERS & PROFILES
-- ============================================================================

-- Users table (managed by Supabase Auth)
-- This is just for reference; Supabase creates auth.users automatically

-- User profiles with training-specific data
CREATE TABLE user_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT,
    ftp INTEGER, -- Functional Threshold Power (watts)
    max_hr INTEGER, -- Maximum Heart Rate (bpm)
    weight_kg DECIMAL(5,2),
    timezone TEXT DEFAULT 'UTC',

    -- Coach personality preferences
    coach_personality JSONB DEFAULT '{
        "toughness": 7,
        "encouragement": 8,
        "detail_level": "medium",
        "communication_style": "direct"
    }'::jsonb,

    -- API Integration credentials (encrypted at application level)
    intervals_icu_athlete_id TEXT,
    intervals_icu_api_key TEXT, -- Store encrypted
    strava_athlete_id TEXT,
    strava_access_token TEXT, -- Store encrypted
    strava_refresh_token TEXT, -- Store encrypted
    strava_token_expires_at TIMESTAMP,

    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),

    UNIQUE(user_id)
);

-- Index for faster lookups
CREATE INDEX idx_user_profiles_user_id ON user_profiles(user_id);
CREATE INDEX idx_user_profiles_intervals_athlete ON user_profiles(intervals_icu_athlete_id);

-- ============================================================================
-- ACTIVITIES
-- ============================================================================

-- Cached activity data from external sources
CREATE TABLE activities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

    -- External system reference
    external_id TEXT NOT NULL, -- ID from source system
    source TEXT NOT NULL, -- 'intervals_icu', 'strava', 'garmin'

    -- Basic activity info
    activity_type TEXT NOT NULL, -- 'Ride', 'Run', 'Workout', 'VirtualRide'
    name TEXT,
    description TEXT,
    start_date TIMESTAMP NOT NULL,

    -- Duration and distance
    duration_seconds INTEGER NOT NULL,
    distance_meters INTEGER,

    -- Training load metrics
    tss INTEGER, -- Training Stress Score
    intensity_factor DECIMAL(4,3),

    -- Power metrics
    avg_power INTEGER,
    normalized_power INTEGER,
    max_power INTEGER,

    -- Heart rate
    avg_hr INTEGER,
    max_hr INTEGER,

    -- Other metrics
    elevation_gain INTEGER,
    avg_cadence INTEGER,
    calories INTEGER,

    -- Full data from source (for future use)
    raw_data JSONB,

    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),

    UNIQUE(user_id, external_id, source)
);

-- Indexes for common queries
CREATE INDEX idx_activities_user_date ON activities(user_id, start_date DESC);
CREATE INDEX idx_activities_type ON activities(user_id, activity_type);
CREATE INDEX idx_activities_source ON activities(user_id, source);

-- ============================================================================
-- TRAINING PLANS
-- ============================================================================

-- Training plans (AI-generated or manual)
CREATE TABLE training_plans (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

    name TEXT NOT NULL,
    description TEXT,

    -- Plan timeline
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,

    -- Plan details
    goal TEXT, -- 'century', 'crit_race', 'gran_fondo', 'base_fitness', etc.
    goal_description TEXT,

    -- Status
    status TEXT DEFAULT 'active', -- 'active', 'completed', 'archived', 'paused'

    -- Generation metadata
    generated_by TEXT DEFAULT 'ai', -- 'ai' or 'manual'
    generation_prompt TEXT, -- What the user asked for

    -- Structured plan data
    plan_data JSONB, -- Detailed week-by-week structure

    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_training_plans_user ON training_plans(user_id);
CREATE INDEX idx_training_plans_status ON training_plans(user_id, status);
CREATE INDEX idx_training_plans_dates ON training_plans(user_id, start_date, end_date);

-- ============================================================================
-- WORKOUTS
-- ============================================================================

-- Individual workouts (planned or completed)
CREATE TABLE workouts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    training_plan_id UUID REFERENCES training_plans(id) ON DELETE SET NULL,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

    -- Scheduling
    scheduled_date DATE NOT NULL,

    -- Workout details
    workout_type TEXT NOT NULL, -- 'interval', 'endurance', 'tempo', 'recovery', 'race'
    name TEXT NOT NULL,
    description TEXT,
    instructions TEXT, -- Detailed instructions for athlete

    -- Duration/intensity
    duration_minutes INTEGER NOT NULL,
    target_tss INTEGER,

    -- Structured workout data (intervals, zones, etc.)
    workout_data JSONB, -- { intervals: [...], warmup: {...}, cooldown: {...} }

    -- Completion tracking
    completed BOOLEAN DEFAULT FALSE,
    completed_at TIMESTAMP,
    completed_activity_id UUID REFERENCES activities(id) ON DELETE SET NULL,
    completion_notes TEXT,

    -- Export tracking
    zwo_file_url TEXT, -- If exported to Zwift
    exported_to_garmin BOOLEAN DEFAULT FALSE,
    exported_to_garmin_at TIMESTAMP,

    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_workouts_user_date ON workouts(user_id, scheduled_date);
CREATE INDEX idx_workouts_plan ON workouts(training_plan_id);
CREATE INDEX idx_workouts_completed ON workouts(user_id, completed);

-- ============================================================================
-- COACH CONVERSATIONS
-- ============================================================================

-- Chat history with AI coach
CREATE TABLE coach_conversations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

    -- Message content
    message TEXT NOT NULL,
    role TEXT NOT NULL, -- 'user' or 'assistant'

    -- Context provided to AI (for debugging/transparency)
    context JSONB, -- { recent_activities: [...], fitness_metrics: {...}, etc. }

    -- Metadata
    tokens_used INTEGER,
    model_version TEXT,

    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_conversations_user ON coach_conversations(user_id, created_at DESC);

-- ============================================================================
-- USER AVAILABILITY
-- ============================================================================

-- When user is available to train
CREATE TABLE user_availability (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

    day_of_week INTEGER NOT NULL, -- 0=Sunday, 1=Monday, ..., 6=Saturday
    time_slot TEXT NOT NULL, -- 'early_morning', 'morning', 'midday', 'afternoon', 'evening'

    -- Duration in minutes
    duration_minutes INTEGER NOT NULL,

    -- Is this slot available?
    is_available BOOLEAN DEFAULT TRUE,

    -- Preferences
    preferred_workout_type TEXT, -- 'indoor', 'outdoor', 'any'

    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),

    UNIQUE(user_id, day_of_week, time_slot)
);

CREATE INDEX idx_availability_user ON user_availability(user_id);

-- ============================================================================
-- FITNESS METRICS
-- ============================================================================

-- Computed or cached fitness metrics over time
CREATE TABLE fitness_metrics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

    date DATE NOT NULL,

    -- Chronic Training Load (Fitness) - 42-day exponential average of TSS
    ctl DECIMAL(6,2),

    -- Acute Training Load (Fatigue) - 7-day exponential average of TSS
    atl DECIMAL(6,2),

    -- Training Stress Balance (Form) - CTL - ATL
    tsb DECIMAL(6,2),

    -- Ramp rate (change in CTL per day)
    ramp_rate DECIMAL(5,2),

    -- Computed FTP based on recent efforts
    computed_ftp INTEGER,

    -- Weight tracking
    weight_kg DECIMAL(5,2),

    -- Wellness data
    resting_hr INTEGER,
    hrv INTEGER, -- Heart Rate Variability
    sleep_hours DECIMAL(3,1),
    sleep_quality INTEGER, -- 1-10 scale

    -- Subjective feeling
    soreness INTEGER, -- 1-10 scale
    fatigue INTEGER, -- 1-10 scale
    mood INTEGER, -- 1-10 scale

    created_at TIMESTAMP DEFAULT NOW(),

    UNIQUE(user_id, date)
);

CREATE INDEX idx_fitness_metrics_user_date ON fitness_metrics(user_id, date DESC);

-- ============================================================================
-- SYNC STATUS
-- ============================================================================

-- Track last sync from external services
CREATE TABLE sync_status (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

    source TEXT NOT NULL, -- 'intervals_icu', 'strava', 'garmin'

    last_sync_at TIMESTAMP,
    last_sync_status TEXT, -- 'success', 'error', 'partial'
    last_sync_error TEXT,

    activities_synced INTEGER DEFAULT 0,

    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),

    UNIQUE(user_id, source)
);

CREATE INDEX idx_sync_status_user ON sync_status(user_id);

-- ============================================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE training_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE workouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE coach_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_availability ENABLE ROW LEVEL SECURITY;
ALTER TABLE fitness_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE sync_status ENABLE ROW LEVEL SECURITY;

-- Policies: Users can only access their own data

-- User Profiles
CREATE POLICY "Users can view their own profile"
    ON user_profiles FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile"
    ON user_profiles FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile"
    ON user_profiles FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Activities
CREATE POLICY "Users can view their own activities"
    ON activities FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own activities"
    ON activities FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own activities"
    ON activities FOR UPDATE
    USING (auth.uid() = user_id);

-- Training Plans
CREATE POLICY "Users can view their own training plans"
    ON training_plans FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own training plans"
    ON training_plans FOR ALL
    USING (auth.uid() = user_id);

-- Workouts
CREATE POLICY "Users can view their own workouts"
    ON workouts FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own workouts"
    ON workouts FOR ALL
    USING (auth.uid() = user_id);

-- Coach Conversations
CREATE POLICY "Users can view their own conversations"
    ON coach_conversations FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own messages"
    ON coach_conversations FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- User Availability
CREATE POLICY "Users can manage their own availability"
    ON user_availability FOR ALL
    USING (auth.uid() = user_id);

-- Fitness Metrics
CREATE POLICY "Users can view their own fitness metrics"
    ON fitness_metrics FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own fitness metrics"
    ON fitness_metrics FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Sync Status
CREATE POLICY "Users can view their own sync status"
    ON sync_status FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own sync status"
    ON sync_status FOR ALL
    USING (auth.uid() = user_id);

-- ============================================================================
-- FUNCTIONS & TRIGGERS
-- ============================================================================

-- Update updated_at timestamp automatically
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply to all tables with updated_at
CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON user_profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_activities_updated_at BEFORE UPDATE ON activities
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_training_plans_updated_at BEFORE UPDATE ON training_plans
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_workouts_updated_at BEFORE UPDATE ON workouts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_availability_updated_at BEFORE UPDATE ON user_availability
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_sync_status_updated_at BEFORE UPDATE ON sync_status
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- SAMPLE DATA (for development)
-- ============================================================================

-- Uncomment to insert sample data for testing
-- This assumes a user with UUID exists in auth.users

/*
-- Insert sample user profile
INSERT INTO user_profiles (
    user_id,
    name,
    ftp,
    max_hr,
    weight_kg,
    timezone,
    intervals_icu_athlete_id
) VALUES (
    'YOUR_USER_UUID_HERE',
    'Test Rider',
    250,
    185,
    75.0,
    'America/New_York',
    'i12345'
);

-- Insert sample availability
INSERT INTO user_availability (user_id, day_of_week, time_slot, duration_minutes, is_available)
VALUES
    ('YOUR_USER_UUID_HERE', 1, 'morning', 90, true),  -- Monday morning
    ('YOUR_USER_UUID_HERE', 3, 'morning', 90, true),  -- Wednesday morning
    ('YOUR_USER_UUID_HERE', 5, 'morning', 90, true),  -- Friday morning
    ('YOUR_USER_UUID_HERE', 6, 'morning', 180, true); -- Saturday morning (long ride)
*/

-- ============================================================================
-- VIEWS (for common queries)
-- ============================================================================

-- Recent activities with computed metrics
CREATE VIEW recent_activities_summary AS
SELECT
    a.id,
    a.user_id,
    a.activity_type,
    a.name,
    a.start_date,
    a.duration_seconds,
    a.distance_meters,
    a.tss,
    a.avg_power,
    a.normalized_power,
    a.avg_hr,
    a.elevation_gain,
    -- Computed fields
    ROUND(a.distance_meters / 1609.34, 2) AS distance_miles,
    ROUND(a.duration_seconds / 3600.0, 2) AS duration_hours,
    CASE
        WHEN a.duration_seconds > 0 THEN ROUND((a.distance_meters / 1000.0) / (a.duration_seconds / 3600.0), 2)
        ELSE 0
    END AS avg_speed_kph
FROM activities a
ORDER BY a.start_date DESC;

-- Training plan adherence
CREATE VIEW training_plan_adherence AS
SELECT
    tp.id AS plan_id,
    tp.user_id,
    tp.name AS plan_name,
    tp.start_date,
    tp.end_date,
    COUNT(w.id) AS total_workouts,
    SUM(CASE WHEN w.completed THEN 1 ELSE 0 END) AS completed_workouts,
    ROUND(
        (SUM(CASE WHEN w.completed THEN 1 ELSE 0 END)::DECIMAL / NULLIF(COUNT(w.id), 0)) * 100,
        1
    ) AS adherence_percentage
FROM training_plans tp
LEFT JOIN workouts w ON w.training_plan_id = tp.id
GROUP BY tp.id, tp.user_id, tp.name, tp.start_date, tp.end_date;

-- Current fitness status (last 7 days of metrics)
CREATE VIEW current_fitness_status AS
SELECT
    user_id,
    date,
    ctl,
    atl,
    tsb,
    ramp_rate,
    computed_ftp,
    weight_kg,
    CASE
        WHEN tsb > 10 THEN 'Fresh'
        WHEN tsb > 0 THEN 'Recovered'
        WHEN tsb > -10 THEN 'Neutral'
        WHEN tsb > -20 THEN 'Tired'
        ELSE 'Very Tired'
    END AS form_status
FROM fitness_metrics
WHERE date >= CURRENT_DATE - INTERVAL '7 days'
ORDER BY date DESC;

-- ============================================================================
-- DONE!
-- ============================================================================

-- Grant necessary permissions (adjust as needed for your setup)
-- GRANT USAGE ON SCHEMA public TO authenticated;
-- GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
-- GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;
