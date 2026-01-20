# Virtual Coach - AI-Powered Cycling Coach

An intelligent training companion that analyzes your cycling data, creates personalized training plans, provides honest feedback, and helps you reach your goals.

## What is Virtual Coach?

Virtual Coach is a conversational AI cycling coach that:

- **Analyzes Your Training**: Pulls data from Intervals.icu (which aggregates Garmin, Strava, Zwift, and more)
- **Provides Honest Feedback**: Uses Claude AI to give you data-driven, no-nonsense coaching with "tough love" when needed
- **Creates Custom Plans**: Generates training plans based on your fitness level, goals, and availability
- **Exports Workouts**: Seamlessly transfers workouts to Zwift and Garmin devices
- **Tracks Progress**: Monitors fitness trends (CTL/ATL/TSB), adherence, and performance over time

## Why Build This?

Traditional coaching is expensive ($200-500/month), and generic training plans don't adapt to your life. Virtual Coach combines:
- Real coaching knowledge and personality (via AI)
- Your actual training data and metrics
- Smart planning around your schedule
- Affordable price point (API costs only)

## Project Status

**Current Phase**: Planning & Architecture Complete ✅

We have completed:
- ✅ API research (Intervals.icu, Strava, Garmin, Zwift)
- ✅ System architecture design
- ✅ Database schema definition
- ✅ Phased implementation roadmap

**Next Step**: Begin Phase 1 implementation (MVP)

## Documentation

This project includes comprehensive planning documentation:

1. **[ARCHITECTURE.md](./ARCHITECTURE.md)** - Complete system architecture, technology decisions, and rationale
2. **[ROADMAP.md](./ROADMAP.md)** - Detailed implementation plan with week-by-week tasks
3. **[schema.sql](./schema.sql)** - Complete database schema with tables, indexes, and RLS policies
4. **[DECISIONS.md](./DECISIONS.md)** - Architecture decision records (ADRs)

Read these documents in order to understand the full project scope.

## Tech Stack

### Frontend
- **Next.js 14+** with TypeScript
- **Tailwind CSS** for styling
- **React** for UI components

### Backend
- **Next.js API Routes** (Node.js)
- **Supabase** (PostgreSQL + Auth)
- **Claude API** for AI coaching

### Integrations
- **Intervals.icu** (primary data source)
- **Strava** (optional)
- **Garmin** (via Intervals.icu or direct API)
- **Zwift** (.zwo file export)

### Hosting
- **Vercel** (frontend + API routes)
- **Supabase** (database + auth)
- **Render** (optional backend services)

## Key Features

### Phase 1 (MVP)
- User authentication
- Intervals.icu integration
- AI coach chat interface
- Activity history display
- Current fitness metrics (CTL/ATL/TSB)

### Phase 2
- Training plan generation
- Calendar view of workouts
- Zwift workout export (.zwo files)
- Plan adherence tracking

### Phase 3
- Garmin integration
- Advanced analytics
- Weekly performance reviews
- Injury prevention warnings
- Mobile PWA

### Phase 4
- Production polish
- Testing & monitoring
- Documentation
- Launch

## Getting Started

### Prerequisites

You'll need accounts for:
- [Supabase](https://supabase.com) (free tier)
- [Anthropic](https://anthropic.com) (Claude API)
- [Intervals.icu](https://intervals.icu) (Premium recommended)
- [Vercel](https://vercel.com) (free tier)

### Installation (Coming Soon)

Once implementation begins, this section will include:
```bash
# Clone the repository
git clone https://github.com/Marteau19/virtual_coach.git
cd virtual_coach

# Install dependencies
npm install

# Setup environment variables
cp .env.example .env.local
# Edit .env.local with your keys

# Run database migrations
npm run db:migrate

# Start development server
npm run dev
```

## Architecture Overview

```
┌─────────────────────────────────────────────────┐
│         Frontend (Next.js + React)              │
│  Chat UI | Dashboard | Calendar | Analytics     │
└─────────────────┬───────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────┐
│         Backend (Next.js API Routes)            │
│  Auth | Sync | AI Coach | Plan Generator        │
└─────────────────┬───────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────┐
│              Data Layer (Supabase)              │
│  Users | Activities | Plans | Conversations     │
└─────────────────┬───────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────┐
│            External Services                    │
│  Intervals.icu | Claude API | Strava | Garmin   │
└─────────────────────────────────────────────────┘
```

## Core Concepts

### Fitness Metrics (CTL/ATL/TSB)

- **CTL (Chronic Training Load)**: Your fitness - 42-day average of training stress
- **ATL (Acute Training Load)**: Your fatigue - 7-day average of training stress
- **TSB (Training Stress Balance)**: Your form - CTL minus ATL
  - Positive TSB = Fresh/Recovered
  - Negative TSB = Tired/Building Fitness

### Training Stress Score (TSS)

A metric that combines duration and intensity:
- 1 hour at FTP = 100 TSS
- Easy ride = 30-60 TSS
- Hard interval workout = 80-120 TSS
- Long endurance ride = 150-250 TSS

### Coach Personality

The AI coach is designed to be:
- **Honest**: Calls out skipped workouts and poor performance
- **Data-Driven**: References your actual metrics
- **Strategic**: Explains the "why" behind training decisions
- **Supportive but Demanding**: Pushes you to improve

## Cost Estimates

### Development Phase (per month)
- Vercel: Free
- Supabase: Free (500MB DB)
- Claude API: ~$10-30 (testing)
- Total: ~$10-30/month

### Production (100 active users)
- Vercel: Free or $20/month
- Supabase: Free or $25/month
- Claude API: ~$50-150/month
- Render: $7/month
- Total: ~$57-202/month

## Contributing

This is a personal project in active development. Contributions, ideas, and feedback are welcome!

### Development Workflow
1. Read the architecture and roadmap docs
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Make your changes
4. Test thoroughly
5. Submit a pull request

### Code Standards
- TypeScript strict mode
- ESLint + Prettier
- Functional components with hooks
- Clear, descriptive commit messages

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- **Intervals.icu** - Excellent training platform with a generous API
- **Claude (Anthropic)** - Powerful AI for coaching conversations
- **Strava** - Community and activity tracking
- **Zwift** - Indoor training platform

## Support

For questions or issues:
- Open an issue on GitHub
- Review the documentation in this repo
- Check the [Intervals.icu Forum](https://forum.intervals.icu/) for API questions

## Roadmap

See [ROADMAP.md](./ROADMAP.md) for detailed implementation timeline.

**Current Sprint**: Preparing to start Phase 1, Week 1
**Estimated MVP**: 3 weeks
**Estimated Full Release**: 12 weeks

---

Built with ❤️ for cyclists who want to train smarter, not just harder.

**Last Updated**: 2026-01-20