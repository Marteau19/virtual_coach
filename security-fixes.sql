-- ============================================================================
-- SECURITY FIXES for Virtual Coach Database
-- Run this migration to fix Supabase Security Advisor warnings
-- ============================================================================

-- ============================================================================
-- FIX 1: Update function with proper search_path
-- ============================================================================

-- Drop and recreate the function with SECURITY INVOKER and explicit search_path
DROP FUNCTION IF EXISTS update_updated_at_column() CASCADE;

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER
SECURITY INVOKER  -- Run with caller's permissions, not owner's
SET search_path = public  -- Explicitly set search path to prevent SQL injection
LANGUAGE plpgsql
AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$;

-- Recreate all triggers (they were dropped with CASCADE above)
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
-- FIX 2: Recreate views with SECURITY INVOKER
-- ============================================================================

-- Drop existing views
DROP VIEW IF EXISTS recent_activities_summary CASCADE;
DROP VIEW IF EXISTS training_plan_adherence CASCADE;
DROP VIEW IF EXISTS current_fitness_status CASCADE;

-- Recreate recent_activities_summary with SECURITY INVOKER
CREATE VIEW recent_activities_summary
WITH (security_invoker = true)  -- Use caller's permissions
AS
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

-- Recreate training_plan_adherence with SECURITY INVOKER
CREATE VIEW training_plan_adherence
WITH (security_invoker = true)
AS
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

-- Recreate current_fitness_status with SECURITY INVOKER
CREATE VIEW current_fitness_status
WITH (security_invoker = true)
AS
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
-- VERIFICATION
-- ============================================================================

-- You can verify the fixes by checking:
-- 1. Function search_path: SELECT prosrc FROM pg_proc WHERE proname = 'update_updated_at_column';
-- 2. View security: SELECT relname, reloptions FROM pg_class WHERE relkind = 'v' AND relname LIKE '%_summary' OR relname LIKE '%_adherence' OR relname LIKE '%_status';

-- ============================================================================
-- DONE
-- ============================================================================

COMMENT ON FUNCTION update_updated_at_column() IS 'Automatically updates updated_at timestamp. SECURITY INVOKER with explicit search_path for safety.';
COMMENT ON VIEW recent_activities_summary IS 'Summary of activities with computed metrics. Uses caller permissions via security_invoker.';
COMMENT ON VIEW training_plan_adherence IS 'Training plan completion statistics. Uses caller permissions via security_invoker.';
COMMENT ON VIEW current_fitness_status IS 'Current fitness metrics for last 7 days. Uses caller permissions via security_invoker.';
