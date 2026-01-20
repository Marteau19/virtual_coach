# Virtual Coach - Implementation Roadmap

This document provides a detailed, step-by-step guide for implementing the Virtual Coach application.

## Phase 1: MVP - Core Coaching Experience (Weeks 1-3)

### Goal
Build a working AI coach that can:
- Connect to Intervals.icu to fetch training data
- Have conversations with users about their training
- Provide data-driven feedback and insights

### Week 1: Project Setup & Authentication

#### 1.1 Initialize Project (Day 1)
```bash
# Create Next.js project with TypeScript
npx create-next-app@latest virtual-coach-app \
  --typescript \
  --tailwind \
  --app \
  --src-dir \
  --import-alias "@/*"

cd virtual-coach-app

# Install core dependencies
npm install @supabase/supabase-js @supabase/auth-helpers-nextjs
npm install @anthropic-ai/sdk
npm install axios date-fns zod
npm install -D @types/node

# Setup environment variables
cp .env.example .env.local
```

**`.env.local` structure:**
```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Claude API
ANTHROPIC_API_KEY=your_anthropic_api_key

# Intervals.icu (for testing)
INTERVALS_ICU_API_KEY=your_personal_key
INTERVALS_ICU_ATHLETE_ID=your_athlete_id
```

#### 1.2 Setup Supabase Project (Day 1)
1. Create new Supabase project at https://app.supabase.com
2. Copy `schema.sql` to Supabase SQL Editor
3. Execute schema to create all tables
4. Configure authentication:
   - Enable Email/Password auth
   - Configure email templates
   - Setup redirect URLs

#### 1.3 Implement Authentication (Days 2-3)
**Files to create:**

`src/lib/supabase/client.ts` - Client-side Supabase instance
```typescript
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
export const createClient = () => createClientComponentClient()
```

`src/lib/supabase/server.ts` - Server-side Supabase instance
```typescript
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
export const createClient = () => createServerComponentClient({ cookies })
```

`src/app/auth/login/page.tsx` - Login page
`src/app/auth/signup/page.tsx` - Signup page
`src/app/auth/callback/route.ts` - OAuth callback handler

**Protected routes middleware:**
`src/middleware.ts` - Protect authenticated routes

**Test authentication flow:**
- Sign up new user
- Verify email
- Login
- Session persistence

### Week 2: Intervals.icu Integration & Data Sync

#### 2.1 Intervals.icu API Client (Days 1-2)
**Files to create:**

`src/lib/intervals/client.ts` - API client wrapper
```typescript
import axios from 'axios';

export class IntervalsIcuClient {
  constructor(private apiKey: string, private athleteId: string) {}

  async getActivities(oldest?: string, newest?: string) {
    // GET /api/v1/athlete/{athleteId}/activities
  }

  async getActivity(activityId: string) {
    // GET /api/v1/activity/{activityId}
  }

  async getFitnessData(oldest?: string, newest?: string) {
    // GET /api/v1/athlete/{athleteId}/fitness
  }

  async getWellness(oldest?: string, newest?: string) {
    // GET /api/v1/athlete/{athleteId}/wellness
  }
}
```

`src/lib/intervals/types.ts` - TypeScript types for API responses
```typescript
export interface IntervalsActivity {
  id: string;
  start_date_local: string;
  type: string;
  name: string;
  distance: number;
  moving_time: number;
  // ... all other fields
}
```

#### 2.2 Data Sync Service (Days 3-4)
**Files to create:**

`src/lib/services/sync.ts` - Sync activities from Intervals.icu to Supabase
```typescript
export async function syncActivities(userId: string) {
  // 1. Get user's Intervals.icu credentials from DB
  // 2. Fetch recent activities (last 90 days)
  // 3. Transform to our schema
  // 4. Upsert to activities table
  // 5. Update sync_status table
  // 6. Return sync result
}

export async function syncFitnessMetrics(userId: string) {
  // Similar for fitness metrics (CTL/ATL/TSB)
}
```

#### 2.3 Sync API Endpoints (Day 5)
**Files to create:**

`src/app/api/sync/activities/route.ts` - POST endpoint to trigger sync
```typescript
export async function POST(request: Request) {
  const user = await getUser();
  const result = await syncActivities(user.id);
  return NextResponse.json(result);
}
```

`src/app/api/sync/status/route.ts` - GET sync status

**Test sync:**
- Connect Intervals.icu account
- Trigger manual sync
- Verify activities appear in database
- Check error handling

### Week 3: AI Coach & Chat Interface

#### 3.1 Claude API Integration (Days 1-2)
**Files to create:**

`src/lib/ai/claude.ts` - Claude API wrapper
```typescript
import Anthropic from '@anthropic-ai/sdk';

export class CoachAI {
  private client: Anthropic;

  constructor() {
    this.client = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    });
  }

  async chat(messages: Message[], context: CoachContext) {
    const systemPrompt = this.buildSystemPrompt(context);

    const response = await this.client.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 2000,
      system: systemPrompt,
      messages: messages,
    });

    return response;
  }

  private buildSystemPrompt(context: CoachContext): string {
    // Build prompt with user profile, recent activities, fitness metrics
  }
}
```

`src/lib/ai/prompts.ts` - System prompt templates
```typescript
export const COACH_SYSTEM_PROMPT = `
You are a professional cycling coach with 20+ years of experience...
[Full prompt from ARCHITECTURE.md]

USER PROFILE:
{{userProfile}}

RECENT ACTIVITIES (Last 7 days):
{{recentActivities}}

CURRENT FITNESS:
{{fitnessMetrics}}
`;
```

#### 3.2 Chat API Endpoint (Day 2)
**Files to create:**

`src/app/api/chat/route.ts` - POST endpoint for chat messages
```typescript
export async function POST(request: Request) {
  const { message } = await request.json();
  const user = await getUser();

  // 1. Fetch conversation history
  // 2. Fetch coach context (profile, activities, fitness)
  // 3. Call Claude API
  // 4. Save both user message and AI response
  // 5. Return AI response

  return NextResponse.json({ response: aiMessage });
}
```

#### 3.3 Chat UI (Days 3-5)
**Files to create:**

`src/app/dashboard/chat/page.tsx` - Main chat interface
```typescript
'use client';

export default function ChatPage() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = async () => {
    // POST to /api/chat
    // Update UI with response
  };

  return (
    <div className="flex flex-col h-screen">
      <ChatMessages messages={messages} />
      <ChatInput
        value={input}
        onChange={setInput}
        onSend={sendMessage}
        isLoading={isLoading}
      />
    </div>
  );
}
```

`src/components/chat/ChatMessages.tsx` - Message list component
`src/components/chat/ChatInput.tsx` - Input component
`src/components/chat/Message.tsx` - Individual message component

**Test chat:**
- Send message to coach
- Receive personalized response
- Verify coach mentions actual user data
- Test conversation history

#### 3.4 Dashboard & Activity History (Day 5)
**Files to create:**

`src/app/dashboard/page.tsx` - Main dashboard
```typescript
export default async function DashboardPage() {
  const user = await getUser();
  const profile = await getUserProfile(user.id);
  const recentActivities = await getRecentActivities(user.id, 7);
  const fitnessMetrics = await getLatestFitnessMetrics(user.id);

  return (
    <div>
      <FitnessSummary metrics={fitnessMetrics} />
      <RecentActivities activities={recentActivities} />
      <QuickActions />
    </div>
  );
}
```

`src/app/dashboard/activities/page.tsx` - Full activity list
`src/components/dashboard/FitnessSummary.tsx` - CTL/ATL/TSB display
`src/components/dashboard/ActivityCard.tsx` - Activity item

#### 3.5 Onboarding Flow (Bonus if time)
**Files to create:**

`src/app/onboarding/page.tsx` - Multi-step onboarding
- Step 1: Basic info (name, FTP, weight)
- Step 2: Connect Intervals.icu
- Step 3: Set availability
- Step 4: Initial sync

### Week 3 End: MVP Testing & Deployment

#### Deploy to Vercel
```bash
# Connect to GitHub
git init
git add .
git commit -m "Initial MVP implementation"
git branch -M main
git remote add origin <your-repo>
git push -u origin main

# Deploy on Vercel
# 1. Import project from GitHub
# 2. Add environment variables
# 3. Deploy
```

#### MVP Success Criteria
- ✅ User can sign up and authenticate
- ✅ User can connect Intervals.icu account
- ✅ Activities sync and display correctly
- ✅ Chat with coach works and provides relevant feedback
- ✅ Coach references actual user data in responses
- ✅ Dashboard shows current fitness status

---

## Phase 2: Training Plans & Zwift Export (Weeks 4-6)

### Week 4: Training Plan Generation

#### 4.1 Availability Configuration (Days 1-2)
**Files to create:**

`src/app/dashboard/settings/availability/page.tsx` - Configure training schedule
```typescript
// Weekly calendar UI for setting availability
// Morning/Afternoon/Evening slots
// Duration for each slot
```

`src/app/api/availability/route.ts` - CRUD for user_availability

#### 4.2 Plan Generation Logic (Days 3-5)
**Files to create:**

`src/lib/ai/plan-generator.ts` - AI-powered plan generation
```typescript
export async function generateTrainingPlan(params: PlanParams) {
  // 1. Analyze current fitness (CTL/ATL/TSB)
  // 2. Get user availability
  // 3. Build prompt for Claude with constraints
  // 4. Generate week-by-week plan
  // 5. Validate plan (TSS progression, recovery weeks)
  // 6. Save to training_plans and workouts tables
  // 7. Return plan
}
```

`src/app/api/plans/generate/route.ts` - POST endpoint to generate plan

`src/app/dashboard/plans/new/page.tsx` - Plan creation wizard
- Select goal (race, century, base fitness, etc.)
- Set duration (4-16 weeks)
- Review and confirm

#### 4.3 Plan Display & Management (Day 5)
**Files to create:**

`src/app/dashboard/plans/[id]/page.tsx` - View plan details
`src/app/dashboard/plans/page.tsx` - List all plans
`src/components/plans/PlanSummary.tsx` - Plan overview card

### Week 5: Calendar & Workout Management

#### 5.1 Calendar View (Days 1-3)
**Files to create:**

`src/app/dashboard/calendar/page.tsx` - Monthly/weekly calendar
```typescript
// Use a calendar library like react-big-calendar or build custom
// Show scheduled workouts
// Click workout to view details
// Drag-and-drop to reschedule
```

`src/components/calendar/WorkoutCalendar.tsx` - Calendar component
`src/components/calendar/WorkoutModal.tsx` - Workout detail modal

#### 5.2 Workout Completion Tracking (Days 3-4)
**Files to create:**

`src/app/api/workouts/[id]/complete/route.ts` - Mark workout complete
```typescript
export async function POST(request: Request, { params }) {
  // 1. Find matching activity in activities table
  // 2. Link activity to workout
  // 3. Mark workout as completed
  // 4. Calculate adherence metrics
}
```

**Auto-matching logic:**
- Match by date (±1 day)
- Match by duration (±15 minutes)
- Match by TSS (±20%)
- Match by type (Ride, Run, etc.)

#### 5.3 Plan Adherence Analytics (Day 5)
**Files to create:**

`src/app/dashboard/plans/[id]/analytics/page.tsx` - Plan progress
- Adherence percentage
- Planned vs. actual TSS chart
- Missed workouts
- Coach commentary on adherence

### Week 6: Automatic Workout Sync to Zwift & Garmin

#### 6.1 Intervals.icu Workout Push Integration (Days 1-3)
**Files to create:**

`src/lib/intervals/workout-sync.ts` - Push workouts to Intervals.icu
```typescript
import { IntervalsIcuClient } from './client';

export async function pushWorkoutToIntervals(
  client: IntervalsIcuClient,
  workout: Workout
): Promise<void> {
  // Convert our workout format to Intervals.icu event structure
  const event = {
    category: 'WORKOUT',
    start_date_local: workout.scheduled_date,
    name: workout.name,
    description: workout.description,
    workout_doc: buildWorkoutDoc(workout), // Structured intervals
  };

  // POST to /api/v1/athlete/{id}/events
  await client.createEvent(event);

  // Intervals.icu automatically syncs to:
  // - Zwift (appears in workout list)
  // - Garmin Connect (appears on calendar)
}

function buildWorkoutDoc(workout: Workout): object {
  // Convert workout.workout_data to Intervals.icu format
  // Supports: warmup, intervals, cooldown, power zones, etc.
}
```

`src/lib/intervals/client.ts` - Add createEvent method
```typescript
async createEvent(athleteId: string, event: IntervalsEvent) {
  return this.post(`/api/v1/athlete/${athleteId}/events`, event);
}

async updateEvent(athleteId: string, eventId: string, event: IntervalsEvent) {
  return this.put(`/api/v1/athlete/${athleteId}/events/${eventId}`, event);
}

async deleteEvent(athleteId: string, eventId: string) {
  return this.delete(`/api/v1/athlete/${athleteId}/events/${eventId}`);
}
```

#### 6.2 Sync API Endpoints (Days 3-4)
**Files to create:**

`src/app/api/workouts/[id]/sync/route.ts` - Push single workout to Intervals.icu
```typescript
export async function POST(request: Request, { params }) {
  const user = await getUser();
  const workout = await getWorkout(params.id);

  // Get user's Intervals.icu credentials
  const profile = await getUserProfile(user.id);
  const client = new IntervalsIcuClient(
    profile.intervals_icu_api_key,
    profile.intervals_icu_athlete_id
  );

  // Push to Intervals.icu
  await pushWorkoutToIntervals(client, workout);

  return NextResponse.json({
    success: true,
    message: 'Workout synced to Intervals.icu, Zwift, and Garmin'
  });
}
```

`src/app/api/plans/[id]/sync/route.ts` - Push entire training plan

#### 6.3 UI & Automatic Sync (Day 5)
**Files to create:**

`src/components/workouts/SyncButton.tsx` - Manual sync button
```typescript
'use client';

export function SyncButton({ workoutId }: { workoutId: string }) {
  const [isSyncing, setIsSyncing] = useState(false);

  const handleSync = async () => {
    setIsSyncing(true);
    await fetch(`/api/workouts/${workoutId}/sync`, { method: 'POST' });
    setIsSyncing(false);
    toast.success('Workout synced to Zwift and Garmin!');
  };

  return (
    <button onClick={handleSync} disabled={isSyncing}>
      {isSyncing ? 'Syncing...' : 'Push to Zwift & Garmin'}
    </button>
  );
}
```

**Features:**
- Push single workout to Intervals.icu (auto-syncs to Zwift & Garmin)
- Push entire week of workouts
- Push full training plan
- Automatic sync when plan is created or modified
- Status indicator showing sync state
- Zero manual steps for user!

### Week 6 End: Phase 2 Testing & Release

#### Test Cases
- ✅ Generate 12-week training plan
- ✅ Plan respects user availability
- ✅ TSS progression is safe (<7 TSS/day increase)
- ✅ Calendar displays correctly
- ✅ Workouts auto-match to completed activities
- ✅ Adherence metrics calculate correctly
- ✅ Workout successfully pushes to Intervals.icu
- ✅ Workout appears in Zwift workout list (check Zwift app)
- ✅ Workout appears on Garmin Connect calendar
- ✅ Bulk sync of training plan works
- ✅ Sync status updates correctly in UI

---

## Phase 3: Advanced Features (Weeks 7-9)

### Week 7: Advanced Coach Features

#### 7.1 Weekly Performance Reviews (Days 1-2)
**Files to create:**

`src/lib/ai/weekly-review.ts` - Generate weekly summary
```typescript
export async function generateWeeklyReview(userId: string) {
  // 1. Fetch last week's activities
  // 2. Calculate weekly TSS, duration, adherence
  // 3. Analyze performance trends
  // 4. Use Claude to write review
  // 5. Save as coach conversation
  // 6. Optionally send notification
}
```

**Trigger:** Cron job every Monday morning

#### 7.2 Automated Check-ins (Days 3-4)
**Features:**
- "How are you feeling?" prompts
- Pre-workout readiness check
- Post-workout feedback collection
- Update wellness data in fitness_metrics

`src/app/dashboard/checkin/page.tsx` - Check-in form

#### 7.3 Injury Prevention Warnings (Day 5)
**Logic:**
- Detect rapid CTL increase (>7 TSS/day ramp rate)
- Consecutive days without recovery
- Very low TSB (<-30) for extended period
- Spike in fatigue/soreness scores

`src/lib/services/injury-prevention.ts` - Warning logic

### Week 8: Strava Integration (Optional)

#### 8.1 Strava OAuth (Days 1-2)
**Files to create:**

`src/app/api/auth/strava/route.ts` - Strava OAuth flow
`src/lib/strava/client.ts` - Strava API client

#### 8.2 Activity Sync from Strava (Days 3-5)
- Fetch activities from Strava
- Merge with existing activities from Intervals.icu
- Deduplicate by activity date/time/duration

**Why add Strava?**
- Access to segments and KOMs
- Social features (kudos, comments)
- Users who prefer Strava over Intervals.icu

### Week 9: Mobile Optimization & PWA

#### 9.1 Responsive Design (Days 1-3)
- Audit all pages for mobile responsiveness
- Optimize chat UI for mobile
- Mobile-friendly calendar
- Bottom navigation for mobile
- Touch-friendly controls

#### 9.2 PWA Setup (Days 4-5)
**Files to create:**

`public/manifest.json` - PWA manifest
`src/app/sw.ts` - Service worker for offline support

**Features:**
- Install as app on mobile
- Offline access to recent activities
- Push notifications (future)
- Faster load times with caching

---

## Phase 4: Polish & Production (Weeks 11+)

### Testing & Quality

#### Unit Tests
```bash
npm install -D jest @testing-library/react @testing-library/jest-dom
```

**Priority test coverage:**
- `src/lib/intervals/client.ts` - API client
- `src/lib/zwift/zwo-generator.ts` - File generation
- `src/lib/services/sync.ts` - Data sync logic
- `src/lib/ai/plan-generator.ts` - Plan validation

#### Integration Tests
- Auth flow (signup, login, logout)
- Complete onboarding
- Sync activities end-to-end
- Generate and export training plan

#### E2E Tests (Optional)
```bash
npm install -D @playwright/test
```

- Full user journey from signup to first workout

### Performance Optimization

#### Database Indexing
- Add indexes for slow queries
- Analyze query performance
- Consider materialized views for analytics

#### Caching
- Cache Intervals.icu API responses (15min TTL)
- Cache rendered activities in dashboard
- Use SWR or React Query for client-side caching

#### Image Optimization
- Use Next.js Image component
- Lazy load activity maps
- Optimize SVG charts

### Monitoring & Observability

#### Error Tracking
```bash
npm install @sentry/nextjs
```

Setup Sentry for:
- Frontend errors
- API errors
- Performance monitoring

#### Analytics
```bash
npm install @vercel/analytics
```

Track:
- Page views
- User engagement
- Feature usage
- Conversion funnel

### Documentation

#### User Documentation
`docs/user-guide.md`:
- Getting started
- Connecting Intervals.icu
- Understanding fitness metrics (CTL/ATL/TSB)
- Creating training plans
- Exporting to Zwift/Garmin
- FAQs

#### Developer Documentation
`docs/developer-guide.md`:
- Setup instructions
- Architecture overview
- API documentation
- Contributing guidelines

### Security Audit

#### Checklist
- ✅ API keys encrypted in database
- ✅ Row Level Security (RLS) enabled
- ✅ Rate limiting on API endpoints
- ✅ CORS properly configured
- ✅ Input validation on all forms
- ✅ SQL injection prevention (use parameterized queries)
- ✅ XSS prevention (sanitize user input)
- ✅ CSRF protection
- ✅ Secure session management

### Launch Checklist

#### Pre-Launch
- ✅ All features tested and working
- ✅ Error handling in place
- ✅ Loading states for all async operations
- ✅ Mobile responsive
- ✅ SEO metadata added
- ✅ Analytics configured
- ✅ Error tracking setup
- ✅ User documentation complete
- ✅ Terms of Service and Privacy Policy
- ✅ Backup strategy for database

#### Launch Day
1. Deploy to production
2. Smoke test all critical paths
3. Monitor error rates
4. Watch performance metrics
5. Be ready to rollback if issues

#### Post-Launch
- Gather user feedback
- Monitor usage patterns
- Fix bugs quickly
- Plan next features based on feedback

---

## Future Enhancements (Beyond Phase 4)

### Potential Features

1. **Multi-Sport Support**
   - Full running and triathlon plans
   - Swim workouts
   - Gym/strength training

2. **Social Features**
   - Share training plans
   - Coach other athletes
   - Group challenges

3. **Advanced Analytics**
   - VO2max estimation
   - Power duration curves
   - Fatigue resistance index
   - Equipment tracking

4. **Integrations**
   - TrainingPeaks
   - Wahoo SYSTM
   - Peloton
   - Apple Health

5. **Nutrition Tracking**
   - Calorie goals based on training load
   - Hydration tracking
   - Fueling strategy recommendations

6. **Race Day Features**
   - Race simulation workouts
   - Pacing strategy
   - Taper planning
   - Race day weather and course analysis

7. **Team/Group Features**
   - Coach multiple athletes
   - Team training plans
   - Group rides/events

8. **AI Enhancements**
   - Voice interaction with coach
   - Video analysis of cycling form
   - Anomaly detection in power data
   - Predictive performance modeling

---

## Development Best Practices

### Code Organization
```
src/
├── app/                # Next.js app directory
│   ├── api/           # API routes
│   ├── auth/          # Auth pages
│   └── dashboard/     # Main app pages
├── components/        # React components
│   ├── ui/           # Reusable UI components
│   ├── chat/         # Chat-specific components
│   ├── calendar/     # Calendar components
│   └── dashboard/    # Dashboard components
├── lib/              # Utilities and services
│   ├── ai/          # AI/Claude integration
│   ├── intervals/   # Intervals.icu client
│   ├── zwift/       # Zwift export
│   ├── garmin/      # Garmin integration
│   ├── services/    # Business logic
│   └── supabase/    # Database clients
└── types/           # TypeScript type definitions
```

### Git Workflow
1. Feature branches: `feature/chat-ui`, `feature/plan-generator`
2. Always pull before starting work
3. Commit messages: `feat:`, `fix:`, `docs:`, `refactor:`, `test:`
4. PR review before merging to main
5. Main branch deploys automatically to production

### Environment Management
- `.env.local` - Local development
- `.env.preview` - Preview deployments (Vercel)
- `.env.production` - Production (Vercel)

Never commit `.env` files!

### Coding Standards
- Use TypeScript strict mode
- ESLint + Prettier for formatting
- Write JSDoc comments for complex functions
- Prefer functional components and hooks
- Use server components by default (Next.js 14+)
- Keep components small and focused

---

## Support & Maintenance Plan

### Regular Tasks

#### Daily
- Monitor error rates in Sentry
- Check API usage/costs
- Respond to user issues

#### Weekly
- Review user feedback
- Check database performance
- Update dependencies (security patches)
- Backup database

#### Monthly
- Review analytics
- Plan next features
- Dependency updates (minor versions)
- Cost optimization

---

## Estimated Timeline Summary

| Phase | Duration | Key Deliverable |
|-------|----------|----------------|
| Phase 1 | 3 weeks | MVP with AI coach chat |
| Phase 2 | 3 weeks | Training plans + Zwift export |
| Phase 3 | 4 weeks | Advanced features + Garmin |
| Phase 4 | 2+ weeks | Production polish + launch |
| **Total** | **12+ weeks** | **Full production app** |

---

## Resources & Tools

### Learning Resources
- **Next.js 14**: https://nextjs.org/docs
- **Supabase**: https://supabase.com/docs
- **Claude API**: https://docs.anthropic.com/
- **Intervals.icu API**: https://intervals.icu/api-docs.html
- **Zwift Workouts**: https://github.com/h4l/zwift-workout-file-reference

### Community & Support
- **Next.js Discord**: https://nextjs.org/discord
- **Supabase Discord**: https://discord.supabase.com/
- **Intervals.icu Forum**: https://forum.intervals.icu/

### Useful Tools
- **Postman**: API testing
- **DBeaver**: Database management
- **Vercel**: Hosting and deployment
- **GitHub Copilot**: AI code assistant

---

**Last Updated**: 2026-01-20
**Status**: Ready for Implementation - Start with Phase 1, Week 1
