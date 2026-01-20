# Architecture Decision Records (ADRs)

This document captures key architectural decisions made for the Virtual Coach project, along with the context and rationale.

## Decision Log

### ADR-001: Use Intervals.icu as Primary Data Source

**Date**: 2026-01-20
**Status**: Accepted
**Deciders**: Project Team

#### Context
We need to integrate with training platforms to fetch activity data. Options include:
- Intervals.icu API
- Strava API
- Garmin Connect API
- Direct integration with multiple sources

#### Decision
Use Intervals.icu as the primary data source for all training data.

#### Rationale

**Pros:**
- Single integration point instead of 3+ separate integrations
- Intervals.icu already aggregates data from Garmin, Strava, Zwift, Wahoo, etc.
- Excellent API with comprehensive Swagger documentation
- Advanced metrics calculated automatically (CTL/ATL/TSB, power curves, etc.)
- Free API access (no approval process like Garmin)
- User has Premium account with full features
- Training-focused platform (not social media like Strava)
- Can push workouts back to Garmin via Intervals.icu

**Cons:**
- Dependency on third-party service
- Requires users to have Intervals.icu account
- If Intervals.icu is down, can't fetch new data (mitigated by local caching)

#### Consequences
- Simpler architecture with fewer integration points
- Faster development timeline
- Users must connect Intervals.icu account during onboarding
- We cache activities locally to reduce dependency
- Can add Strava/Garmin direct integrations later if needed

---

### ADR-002: Use Next.js for Full-Stack Application

**Date**: 2026-01-20
**Status**: Accepted
**Deciders**: Project Team

#### Context
We need to choose between:
- Separate frontend (React) + backend (Node.js/Express or Python/FastAPI)
- Full-stack framework (Next.js, Remix, etc.)

#### Decision
Use Next.js 14+ (App Router) as a full-stack framework for both frontend and backend.

#### Rationale

**Pros:**
- Single codebase - easier to maintain for non-developer
- Excellent developer experience (hot reload, TypeScript support)
- API routes handle backend logic without separate service
- Server components for better performance
- Trivial deployment to Vercel
- Strong ecosystem and community
- Can extract backend later if needed
- Edge functions for fast API responses

**Cons:**
- Tighter coupling between frontend and backend
- Some Vercel lock-in (though Next.js runs anywhere)
- Serverless function limitations (10s timeout on hobby tier)

#### Consequences
- Faster development and deployment
- Lower operational complexity
- Need to be mindful of function timeouts for long operations
- May need to extract data sync to background jobs later
- Easier for project owner to understand and maintain

---

### ADR-003: Use Claude API Instead of OpenAI

**Date**: 2026-01-20
**Status**: Accepted
**Deciders**: Project Team

#### Context
Need to choose an LLM provider for AI coaching conversations:
- OpenAI GPT-4
- Anthropic Claude
- Google Gemini
- Open source models (Llama, etc.)

#### Decision
Use Claude (Anthropic) API for AI coaching functionality.

#### Rationale

**Pros:**
- Larger context window (200K tokens) - can include more training data
- Better at nuanced, empathetic responses while being direct
- Excellent instruction following
- User already has Claude Pro subscription (familiar with quality)
- Competitive pricing ($3 per million tokens for Haiku, $15 for Sonnet)
- Strong safety features
- Good for extended conversations with context

**Cons:**
- Smaller ecosystem compared to OpenAI
- Less third-party tooling
- Newer platform (though rapidly improving)

#### Consequences
- Can include extensive training history in context
- Better coaching conversations with personality
- May add GPT-4 as alternative option later
- Need to manage context window carefully to control costs

---

### ADR-004: Use Supabase for Database and Authentication

**Date**: 2026-01-20
**Status**: Accepted
**Deciders**: Project Team

#### Context
Need database and authentication solution. Options:
- Supabase (PostgreSQL + Auth)
- Firebase (NoSQL + Auth)
- Raw PostgreSQL + Auth0/Clerk
- PlanetScale (MySQL) + NextAuth

#### Decision
Use Supabase for both database (PostgreSQL) and authentication.

#### Rationale

**Pros:**
- User has prior experience with Supabase
- PostgreSQL is excellent for relational data (activities, plans, workouts)
- Built-in authentication (no separate service needed)
- Row Level Security (RLS) for data protection
- Real-time subscriptions (useful for future features)
- Generous free tier (500MB DB, 2GB bandwidth)
- Easy backup and restore
- SQL familiarity

**Cons:**
- Additional service to manage
- Free tier has limits (but sufficient for MVP)
- Potential cold starts on free tier

#### Consequences
- Robust relational data model
- Strong security with RLS
- Simple authentication setup
- May need to upgrade tier as user base grows
- Can self-host PostgreSQL if needed later

---

### ADR-005: Cache Activities Locally in Supabase

**Date**: 2026-01-20
**Status**: Accepted
**Deciders**: Project Team

#### Context
We could either:
- Always fetch activities from Intervals.icu on demand
- Cache activities in our own database

#### Decision
Cache all activities in Supabase database, syncing periodically from Intervals.icu.

#### Rationale

**Pros:**
- Much faster queries (no API latency)
- Works even if Intervals.icu is temporarily down
- Can run complex analytics and aggregations
- Reduces API calls to external service
- Enables offline functionality (future PWA)
- Full control over data schema

**Cons:**
- Data sync complexity (need background jobs)
- Storage costs (minimal - activities are small)
- Potential staleness (mitigated by regular sync)
- Duplicate data storage

#### Consequences
- Need to implement sync service
- Need cron job for automatic daily sync
- Manual sync button for on-demand updates
- Much better performance for dashboard and analytics
- Need to handle sync conflicts and errors

---

### ADR-006: File-Based Export for Zwift (.zwo files)

**Date**: 2026-01-20
**Status**: Accepted
**Deciders**: Project Team

#### Context
Zwift doesn't have a public API for uploading workouts. Options:
- Generate .zwo files for manual upload
- Reverse engineer unofficial API (risky)
- Use Dropbox/cloud sync (complex)
- Wait for official API (may never come)

#### Decision
Generate .zwo XML files that users download and manually place in their Zwift directory.

#### Rationale

**Pros:**
- Simple and reliable
- No reverse engineering needed
- Works regardless of Zwift app updates
- Users maintain control
- .zwo format is well-documented
- Can export multiple workouts at once

**Cons:**
- Extra manual step for users
- Less seamless experience
- Users need to know where to place files

#### Consequences
- Need to implement .zwo XML generator
- Need clear instructions/documentation for users
- Can enhance later with Dropbox sync if desired
- Works immediately without waiting for Zwift API
- Acceptable trade-off for MVP

---

### ADR-007: Garmin via Intervals.icu, Direct API as Phase 3

**Date**: 2026-01-20
**Status**: Accepted
**Deciders**: Project Team

#### Context
Garmin has official Training API but requires business developer approval. Options:
- Apply for API access immediately
- Use Intervals.icu's Garmin push feature
- Both (use Intervals.icu initially, add direct later)

#### Decision
Use Intervals.icu's Garmin integration for MVP, apply for direct API access in Phase 3.

#### Rationale

**Pros (Intervals.icu route):**
- Works immediately without approval
- User already connected Garmin to Intervals.icu
- Proven and reliable
- Zero setup required

**Cons:**
- Depends on Intervals.icu as middleman
- Less control over sync timing

**Pros (Direct API - later):**
- More control
- Can push workouts directly
- No intermediary

**Cons:**
- Requires business approval (takes time)
- More complex integration
- Additional OAuth flow

#### Consequences
- MVP works immediately with Garmin devices
- Apply for Garmin API access during Phase 1
- If approved, add direct integration in Phase 3
- If not approved, Intervals.icu route still works fine
- Best of both worlds: fast MVP + potential enhancement

---

### ADR-008: Monorepo with Single Next.js Application

**Date**: 2026-01-20
**Status**: Accepted
**Deciders**: Project Team

#### Context
Project structure options:
- Monorepo with separate frontend/backend packages
- Separate repositories for frontend/backend
- Single Next.js application (frontend + API routes)

#### Decision
Single Next.js application with all code in one repository.

#### Rationale

**Pros:**
- Simplest structure for solo/small team development
- Shared TypeScript types between frontend and backend
- Single deployment
- Easier to understand for non-developer
- Can refactor to monorepo later if needed

**Cons:**
- Less separation of concerns
- Could become harder to manage if project grows very large

#### Consequences
- All code in `src/` directory
- API routes in `src/app/api/`
- Shared utilities in `src/lib/`
- Single deployment pipeline
- Can extract services later if needed

---

### ADR-009: TypeScript Strict Mode

**Date**: 2026-01-20
**Status**: Accepted
**Deciders**: Project Team

#### Context
TypeScript configuration:
- Strict mode (all strict checks enabled)
- Loose mode (allow implicit any, etc.)

#### Decision
Use TypeScript strict mode from the start.

#### Rationale

**Pros:**
- Catches bugs at compile time
- Better IDE autocomplete and refactoring
- Self-documenting code
- Easier maintenance long-term
- Forces good practices

**Cons:**
- Slower initial development (more type definitions)
- Steeper learning curve for non-TypeScript developers

#### Consequences
- All files must be properly typed
- No `any` types (use `unknown` if needed)
- Null/undefined checks required
- Better code quality and maintainability
- Easier to onboard AI assistants for development

---

### ADR-010: Coach Personality via System Prompts

**Date**: 2026-01-20
**Status**: Accepted
**Deciders**: Project Team

#### Context
How to implement coach personality:
- Fine-tune a custom model (expensive, complex)
- Use system prompts with pre-trained model
- Retrieval Augmented Generation (RAG) with coaching knowledge base

#### Decision
Use carefully crafted system prompts with Claude API, including user data as context.

#### Rationale

**Pros:**
- No fine-tuning costs
- Easier to iterate and improve prompts
- Can adjust personality on-the-fly
- Works immediately
- Claude is already excellent at following instructions

**Cons:**
- Prompt engineering required
- Personality consistency depends on prompt quality
- Token costs for including context

#### Consequences
- Create detailed system prompt with coaching style
- Include user profile, recent activities, fitness metrics as context
- Store prompts in code for easy modification
- Monitor coach responses and refine prompts
- Can add RAG later for more advanced knowledge

---

### ADR-011: Deploy Frontend to Vercel

**Date**: 2026-01-20
**Status**: Accepted
**Deciders**: Project Team

#### Context
Hosting options:
- Vercel (Next.js creators)
- Netlify
- AWS (EC2, Lambda, Amplify)
- DigitalOcean/Heroku
- Self-hosted VPS

#### Decision
Deploy frontend (Next.js app) to Vercel.

#### Rationale

**Pros:**
- Best Next.js integration (built by same team)
- Automatic deployments from GitHub
- Edge network for fast global performance
- Preview deployments for PRs
- Generous free tier
- Zero configuration
- Built-in analytics

**Cons:**
- Some lock-in to Vercel platform
- Serverless limitations (10s timeout on free tier)
- Can get expensive at scale (unlikely for this project)

#### Consequences
- Seamless deployment experience
- Need to handle long-running tasks differently (background jobs)
- Excellent performance out of the box
- Can migrate to self-hosted if needed later

---

### ADR-012: Phased Implementation Approach

**Date**: 2026-01-20
**Status**: Accepted
**Deciders**: Project Team

#### Context
Development approach:
- Build all features before launch
- MVP first, then iterate
- Feature flags for gradual rollout

#### Decision
Phased implementation: MVP → Core Features → Advanced → Polish

#### Rationale

**Pros:**
- Get working product faster (3 weeks for MVP)
- Validate core concept before investing more time
- User feedback drives next features
- Reduces risk of building wrong thing
- Manageable scope for solo development

**Cons:**
- Initial version has fewer features
- Need to plan for extensibility
- May need refactoring between phases

#### Consequences
- Phase 1: Chat with coach + activity sync (3 weeks)
- Phase 2: Training plans + Zwift export (3 weeks)
- Phase 3: Advanced features + Garmin (4 weeks)
- Phase 4: Polish and launch (2+ weeks)
- Total estimated timeline: 12 weeks to production
- Can adjust priorities based on Phase 1 feedback

---

## Future Decisions to Make

These decisions will be made during implementation:

1. **State Management**: React Context vs. Zustand vs. Redux
2. **Data Fetching**: SWR vs. React Query vs. native fetch
3. **UI Component Library**: Shadcn/ui vs. custom components
4. **Chart Library**: Recharts vs. Chart.js vs. D3
5. **Testing Framework**: Jest + React Testing Library vs. Vitest
6. **Background Jobs**: Vercel Cron vs. Render Cron vs. Supabase Functions
7. **File Storage**: Supabase Storage vs. Vercel Blob vs. S3

These will be documented as they are decided during development.

---

## How to Use This Document

When making architectural decisions:

1. **Document the Context** - What problem are we solving?
2. **List Options** - What are the alternatives?
3. **State Decision** - What did we choose?
4. **Explain Rationale** - Why did we choose this?
5. **Note Consequences** - What are the implications?

This helps future contributors (and future you!) understand why things are built the way they are.

---

**Last Updated**: 2026-01-20
**Next Review**: After Phase 1 MVP completion
