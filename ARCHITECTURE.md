# Virtual Coach - Architecture & Implementation Plan

## Executive Summary

A conversational AI cycling coach that analyzes training data, provides honest feedback, generates personalized training plans, and exports workouts to Zwift and Garmin devices.

## Core Requirements

1. **Data Integration**: Pull training history from Intervals.icu, Strava, or Garmin
2. **AI Coaching**: Conversational interface with Claude API for feedback and "tough love"
3. **Training Planning**: Generate plans based on user availability and fitness level
4. **Workout Export**: Transfer training to Zwift and Garmin devices
5. **Performance Analysis**: Track progress, fitness trends, and provide honest assessments

## Technology Stack

### Frontend
- **Next.js 14+** (App Router)
  - Modern React framework with server/client components
  - API routes for backend functionality
  - Excellent Vercel deployment integration
  - TypeScript for type safety

### Backend
- **Next.js API Routes** (for simple endpoints)
- **Node.js/Express** (if we need separate backend service)
  - RESTful API design
  - JWT authentication
  - Deployed on Render

### Database
- **Supabase** (PostgreSQL)
  - Built-in authentication
  - Row Level Security (RLS)
  - Real-time subscriptions
  - Free tier: 500MB database, 2GB bandwidth

### AI/ML
- **Claude API (Anthropic)**
  - Claude 3.5 Sonnet for coaching conversations
  - System prompts for coach personality
  - Context management for conversation history

### External Integrations
- **Intervals.icu API** (Primary data source)
- **Strava API** (Secondary/optional)
- **Zwift** (.zwo file generation)
- **Garmin** (via Intervals.icu or direct API if approved)

### Hosting & Deployment
- **Frontend**: Vercel (free tier, automatic deployments)
- **Backend**: Render (free tier with limitations, $7/mo for always-on)
- **Database**: Supabase (free tier sufficient for MVP)

## API Research Findings

### 1. Intervals.icu API ✅ RECOMMENDED PRIMARY SOURCE
- **Documentation**: Full Swagger API at https://intervals.icu/api/v1/docs/swagger-ui/index.html
- **Authentication**: API key (generate in /settings under "Developer Settings")
- **Capabilities**:
  - ✅ Get completed activities (already aggregates from Garmin, Strava, Zwift, etc.)
  - ✅ Download planned workouts
  - ✅ Read/update wellness data (sleep, HRV, weight, etc.)
  - ✅ Access training metrics (FTP, power curves, fitness/fatigue)
- **Advantages**:
  - Single integration point for all data sources
  - User has Premium account with advanced features
  - Native training plan support
  - **Can push workouts to both Garmin AND Zwift automatically** (no manual steps!)
  - Bi-directional sync: read activities, write workouts

### 2. Strava API v3
- **Documentation**: https://developers.strava.com/docs/reference/
- **Authentication**: OAuth 2.0
- **Rate Limits**: 200 requests/15min, 2,000 requests/day
- **Capabilities**:
  - ✅ Read athlete activities (requires activity:read_all scope)
  - ✅ Activity details (laps, zones, power data)
  - ⚠️ Create activities (requires activity:write, but manual only)
- **Usage**: Optional secondary source, mainly if user wants Strava-specific social features

### 3. Garmin Connect API
- **Documentation**: https://developer.garmin.com/gc-developer-program/training-api/
- **Authentication**: Requires approval as business developer
- **Capabilities**:
  - ✅ Training API: Push workouts to Garmin Connect calendar
  - ✅ Activity API: Read completed activities
  - ⚠️ Requires business developer approval (may take time)
- **Strategy**: Use Intervals.icu to push to Garmin initially, apply for API access later

### 4. Zwift & Garmin Integration via Intervals.icu ✅ RECOMMENDED
- **Documentation**: https://intervals.icu/api/v1/docs/swagger-ui/index.html
- **Integration Method**: Push workouts to Intervals.icu calendar
- **Capabilities**:
  - ✅ Create/update workouts on Intervals.icu calendar
  - ✅ Automatic sync to Zwift (no manual file handling)
  - ✅ Automatic sync to Garmin Connect (no API approval needed)
  - ✅ Structured workouts with intervals, power zones, text instructions
  - ✅ Single API call pushes to both platforms
- **Implementation**: POST to `/api/v1/athlete/{id}/events` endpoint with workout structure
- **Advantages**:
  - Zero manual steps for user
  - Works immediately without Garmin API approval
  - Intervals.icu handles all sync complexity
  - Single source of truth for planned workouts

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         Frontend (Next.js)                   │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │ Chat UI      │  │ Dashboard    │  │ Calendar     │      │
│  │ (Coach)      │  │ (Analytics)  │  │ (Training)   │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│                         │                                     │
│                         │ API Routes / REST API              │
└─────────────────────────┼─────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│                    Backend Services (Node.js)                │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │ Auth Service │  │ Coach Service│  │ Training     │      │
│  │ (Supabase)   │  │ (Claude API) │  │ Plan Service │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│                                                               │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │ Data Sync    │  │ Export       │  │ Analytics    │      │
│  │ Service      │  │ Service      │  │ Service      │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│                    Data Layer (Supabase)                     │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │ Users        │  │ Activities   │  │ Training     │      │
│  │ Profiles     │  │ (Cached)     │  │ Plans        │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│                                                               │
│  ┌──────────────┐  ┌──────────────┐                         │
│  │ Conversations│  │ Workouts     │                         │
│  └──────────────┘  └──────────────┘                         │
└─────────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│                    External Services                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │Intervals.icu │  │ Claude API   │  │ Strava API   │      │
│  │ (Primary)    │  │ (AI Coach)   │  │ (Optional)   │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
```

## Database Schema

### Core Tables

#### users
```sql
- id (uuid, PK)
- email (text, unique)
- created_at (timestamp)
- updated_at (timestamp)
```

#### user_profiles
```sql
- id (uuid, PK)
- user_id (uuid, FK -> users.id)
- name (text)
- ftp (integer) -- Functional Threshold Power
- max_hr (integer) -- Maximum Heart Rate
- weight_kg (decimal)
- timezone (text)
- coach_personality (jsonb) -- preferences for coaching style
- intervals_icu_athlete_id (text)
- intervals_icu_api_key (text, encrypted)
- strava_athlete_id (text, nullable)
- strava_access_token (text, encrypted, nullable)
- created_at (timestamp)
- updated_at (timestamp)
```

#### activities (cached from Intervals.icu)
```sql
- id (uuid, PK)
- user_id (uuid, FK -> users.id)
- external_id (text) -- ID from source system
- source (text) -- 'intervals_icu', 'strava', etc.
- activity_type (text) -- 'Ride', 'Run', 'Workout'
- start_date (timestamp)
- duration_seconds (integer)
- distance_meters (integer)
- tss (integer) -- Training Stress Score
- intensity_factor (decimal)
- avg_power (integer, nullable)
- normalized_power (integer, nullable)
- avg_hr (integer, nullable)
- elevation_gain (integer, nullable)
- raw_data (jsonb) -- full activity data
- created_at (timestamp)
- updated_at (timestamp)
- UNIQUE(user_id, external_id, source)
```

#### training_plans
```sql
- id (uuid, PK)
- user_id (uuid, FK -> users.id)
- name (text)
- description (text)
- start_date (date)
- end_date (date)
- goal (text) -- 'century', 'race', 'fitness', etc.
- status (text) -- 'active', 'completed', 'archived'
- generated_by (text) -- 'ai', 'manual'
- plan_data (jsonb) -- structured plan details
- created_at (timestamp)
- updated_at (timestamp)
```

#### workouts
```sql
- id (uuid, PK)
- training_plan_id (uuid, FK -> training_plans.id, nullable)
- user_id (uuid, FK -> users.id)
- scheduled_date (date)
- workout_type (text) -- 'interval', 'endurance', 'recovery', etc.
- duration_minutes (integer)
- description (text)
- instructions (text)
- workout_data (jsonb) -- structured workout (intervals, zones, etc.)
- completed (boolean)
- completed_activity_id (uuid, FK -> activities.id, nullable)
- zwo_file_url (text, nullable) -- if exported to Zwift
- created_at (timestamp)
- updated_at (timestamp)
```

#### coach_conversations
```sql
- id (uuid, PK)
- user_id (uuid, FK -> users.id)
- message (text)
- role (text) -- 'user' or 'assistant'
- context (jsonb) -- relevant data (recent activities, current plan, etc.)
- created_at (timestamp)
```

#### user_availability
```sql
- id (uuid, PK)
- user_id (uuid, FK -> users.id)
- day_of_week (integer) -- 0-6 (Sunday-Saturday)
- time_slot (text) -- 'morning', 'afternoon', 'evening'
- duration_minutes (integer)
- is_available (boolean)
- created_at (timestamp)
- updated_at (timestamp)
- UNIQUE(user_id, day_of_week, time_slot)
```

#### fitness_metrics (cached/computed)
```sql
- id (uuid, PK)
- user_id (uuid, FK -> users.id)
- date (date)
- ctl (decimal) -- Chronic Training Load (Fitness)
- atl (decimal) -- Acute Training Load (Fatigue)
- tsb (decimal) -- Training Stress Balance (Form)
- ramp_rate (decimal)
- computed_ftp (integer, nullable)
- created_at (timestamp)
- UNIQUE(user_id, date)
```

## Coach Personality & AI Implementation

### Claude System Prompt Structure

```
You are a professional cycling coach with 20+ years of experience. Your coaching style is:
- Honest and direct - you don't sugarcoat poor performance
- Supportive but demanding - you push athletes to their potential
- Data-driven - you base feedback on power metrics, TSS, and training load
- Adaptive - you adjust plans based on life circumstances and recovery

PERSONALITY TRAITS:
- Tough Love: When user skips workouts or underperforms, call it out directly
- Encouraging: Celebrate genuine progress and PRs
- Strategic: Always explain the "why" behind training decisions
- Realistic: Don't let athletes overtrain or set unrealistic goals

CONTEXT YOU HAVE:
{user_profile}
{recent_activities}
{current_training_plan}
{fitness_metrics}
{user_question}

RULES:
- Always reference specific data when giving feedback
- If user hasn't trained in 3+ days, address it directly
- Adjust intensity recommendations based on TSB (form)
- Don't create plans that increase CTL too quickly (>5-7 TSS/day)
```

### Conversation Context Management

For each coach interaction, include:
1. **Recent Activities** (last 7-14 days)
2. **Current Fitness State** (CTL, ATL, TSB)
3. **Training Plan Status** (adherence %, upcoming workouts)
4. **User Profile** (FTP, goals, availability)
5. **Conversation History** (last 5-10 messages)

This gives Claude full context to provide personalized, data-driven coaching.

## Phased Implementation Roadmap

### Phase 1: MVP (Weeks 1-3) 🎯 START HERE
**Goal**: Get a working coach that can analyze training data and have conversations

**Features**:
- ✅ User authentication (Supabase)
- ✅ Intervals.icu API integration
  - Connect user account
  - Fetch activity history (last 90 days)
  - Sync daily automatically
- ✅ Basic chat interface with Claude
  - View conversation history
  - Send messages to coach
  - Receive personalized feedback
- ✅ Activity history view
  - List recent activities
  - Show key metrics (TSS, power, duration)
- ✅ Simple dashboard
  - Current fitness metrics (CTL, ATL, TSB)
  - Last 7 days summary

**Technical Setup**:
- Initialize Next.js project with TypeScript
- Setup Supabase project and database
- Implement authentication flow
- Create Intervals.icu API client
- Integrate Claude API for chat
- Deploy to Vercel

**Why This Phase?**: Proves the core concept - can we create an AI coach that gives useful feedback? If this works, everything else is enhancement.

### Phase 2: Training Plans & Automatic Sync to Zwift/Garmin (Weeks 4-6)
**Goal**: Coach can create plans and automatically sync to Zwift and Garmin

**Features**:
- ✅ Training plan generation
  - User inputs: goal, availability, current fitness
  - AI generates structured plan (4-12 weeks)
  - Plans stored in database
- ✅ Calendar view
  - Show scheduled workouts
  - Mark workouts as completed
  - Match completed activities to planned workouts
- ✅ Automatic workout sync to Zwift & Garmin
  - Push workouts to Intervals.icu calendar
  - Intervals.icu automatically syncs to Zwift (appears in workout list)
  - Intervals.icu automatically syncs to Garmin Connect (appears on calendar)
  - Zero manual steps - fully automatic
- ✅ Plan adherence tracking
  - Compare planned vs. actual
  - Coach feedback on adherence
- ✅ Enhanced analytics
  - Fitness trends over time
  - Power curve analysis
  - Training distribution (zones)

**Technical**:
- Build training plan generation logic
- Implement Intervals.icu workout push API integration
- Calendar UI component
- Data visualization library (Recharts or Chart.js)

### Phase 3: Advanced Features (Weeks 7-9)
**Goal**: Polish and power-user features

**Features**:
- ✅ Strava integration (optional)
  - OAuth flow
  - Fetch Strava-specific data (segments, social features)
  - Alternative data source option
- ✅ Advanced coach features
  - Weekly performance reviews
  - Automated check-ins ("How are you feeling?")
  - Injury prevention warnings
  - Pre-workout readiness assessment
- ✅ Mobile optimization
  - Responsive design
  - PWA capabilities
  - Offline mode for recent data
- ✅ Customization
  - Adjust coach personality (toughness, encouragement levels)
  - Set notification preferences
  - Configure auto-sync schedule
- ✅ Enhanced workout features
  - Workout library/templates
  - Quick adjustments to planned workouts
  - Workout notes and post-workout analysis

**Technical**:
- Strava OAuth flow (optional)
- Scheduled jobs (cron) for auto-sync and check-ins
- PWA manifest and service worker
- Workout template system

### Phase 4: Polish & Growth (Weeks 11+)
**Goal**: Production-ready and delightful to use

**Features**:
- ✅ Onboarding flow
  - Welcome wizard
  - FTP test scheduling
  - Goal setting
- ✅ Performance optimizations
  - Data caching strategies
  - Optimistic UI updates
- ✅ Testing & reliability
  - Unit tests for critical paths
  - Integration tests for APIs
  - Error handling and retry logic
- ✅ Documentation
  - User guide
  - API documentation
  - Contribution guidelines (if open-sourcing)

## Key Architectural Decisions & Rationale

### 1. Why Intervals.icu as Primary Data Source?
**Decision**: Use Intervals.icu API as the primary source for activity data.

**Rationale**:
- **Aggregation**: Already syncs with Garmin, Strava, Zwift, etc. - one API instead of many
- **Premium Features**: User has premium account with advanced metrics
- **Training Focus**: Built for serious training (CTL/ATL/TSB calculated automatically)
- **API Quality**: Well-documented REST API with Swagger docs
- **Cost**: Free API access (unlike Garmin which requires business approval)

**Trade-offs**:
- Dependency on third-party service
- If Intervals.icu is down, app can't fetch new data (mitigated by caching)

### 2. Why Next.js for Full-Stack?
**Decision**: Use Next.js for both frontend and API routes instead of separate frontend/backend.

**Rationale**:
- **Simplicity**: Single codebase, single deployment
- **Developer Experience**: Hot reload, TypeScript, modern React
- **Deployment**: Vercel makes deployment trivial
- **Flexibility**: Can always extract backend later if needed
- **Edge Functions**: Fast API routes at edge locations

**Trade-offs**:
- Coupled frontend/backend (but can separate later)
- Vercel lock-in (but Next.js runs anywhere)

### 3. Why Claude API Over OpenAI?
**Decision**: Use Claude (Anthropic) for AI coaching instead of GPT-4.

**Rationale**:
- **Context Window**: Claude has 200k token context (more data per conversation)
- **Personality**: Better at nuanced, empathetic responses while being direct
- **Cost**: Competitive pricing
- **User Preference**: User has Claude Pro (familiar with quality)

**Trade-offs**:
- Smaller ecosystem than OpenAI
- Could add GPT-4 as alternative later

### 4. Why File-Based Zwift Export?
**Decision**: Generate .zwo files for download instead of direct API integration.

**Rationale**:
- **No API**: Zwift doesn't have a public API for workout uploads
- **Simple**: XML file format is well-documented
- **User Control**: Users manually place files (more control)
- **Future-Proof**: Works regardless of Zwift app changes

**Trade-offs**:
- Extra step for users (download + move file)
- Could improve with Dropbox sync later

### 5. Why Cache Activities Locally?
**Decision**: Store activities in our Supabase database instead of always fetching from Intervals.icu.

**Rationale**:
- **Performance**: Fast queries without API latency
- **Reliability**: Works even if Intervals.icu is down
- **Custom Analytics**: Run complex queries and aggregations
- **Cost**: Reduce API calls to external services

**Trade-offs**:
- Data sync complexity (need background jobs)
- Storage costs (minimal - activities are small)

## Cost Analysis (Monthly)

### Free Tier (MVP Phase)
- **Vercel**: Free (hobby plan, 100GB bandwidth)
- **Supabase**: Free (500MB DB, 2GB bandwidth, 50MB file storage)
- **Claude API**: ~$10-30 (depends on usage, ~$3 per 1M tokens)
- **Render**: Free (with sleep after 15min inactivity)
- **Total**: ~$10-30/month

### Production (100 active users)
- **Vercel**: Free or $20/month (Pro if needed)
- **Supabase**: Free or $25/month (if exceed limits)
- **Claude API**: ~$50-150 (depends on conversation volume)
- **Render**: $7/month (always-on instance)
- **Total**: ~$57-202/month

## Security Considerations

1. **API Keys**: Store encrypted in Supabase, never expose to frontend
2. **Authentication**: Use Supabase Auth with JWT tokens
3. **Rate Limiting**: Implement on API routes to prevent abuse
4. **CORS**: Whitelist only your frontend domain
5. **Data Privacy**: User data never shared, GDPR-compliant deletion
6. **OAuth Scopes**: Request minimal scopes needed for Strava/Garmin

## Development Workflow

1. **Git Branching**: Feature branches → PR → main
2. **Deployments**: Automatic on push to main (Vercel)
3. **Testing**: Jest for unit tests, Playwright for E2E
4. **Code Quality**: ESLint, Prettier, TypeScript strict mode
5. **Monitoring**: Vercel Analytics + Sentry for errors

## Success Metrics

### Phase 1 (MVP)
- ✅ User can connect Intervals.icu account
- ✅ User can see their activity history
- ✅ User can chat with coach and receive relevant feedback
- ✅ Coach references actual user data in responses

### Phase 2
- ✅ User can generate a training plan
- ✅ User can download workouts for Zwift
- ✅ Plans show realistic progression (safe CTL ramp rate)

### Phase 3
- ✅ 90%+ uptime
- ✅ API response times <500ms
- ✅ User reports coach feedback is valuable
- ✅ Users complete more planned workouts

## Resources

### API Documentation
- [Intervals.icu API Docs](https://intervals.icu/api-docs.html)
- [Intervals.icu Swagger UI](https://intervals.icu/api/v1/docs/swagger-ui/index.html)
- [Strava API v3](https://developers.strava.com/docs/reference/)
- [Garmin Training API](https://developer.garmin.com/gc-developer-program/training-api/)
- [Zwift Workout File Format](https://github.com/h4l/zwift-workout-file-reference)

### Tools & Libraries
- **Next.js**: https://nextjs.org/docs
- **Supabase**: https://supabase.com/docs
- **Claude API**: https://docs.anthropic.com/
- **TypeScript**: https://www.typescriptlang.org/
- **Recharts**: https://recharts.org/ (data visualization)

## Next Steps

1. ✅ Review and approve this architecture
2. ⏭️ Setup development environment
3. ⏭️ Initialize Next.js project with TypeScript
4. ⏭️ Create Supabase project and setup database
5. ⏭️ Implement authentication flow
6. ⏭️ Build Intervals.icu integration
7. ⏭️ Create chat UI and Claude integration
8. ⏭️ Deploy MVP to Vercel

---

**Last Updated**: 2026-01-20
**Status**: Architecture Design Complete - Ready for Implementation
