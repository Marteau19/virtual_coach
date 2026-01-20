# Virtual Coach - Setup Guide

This guide will help you get the Virtual Coach development environment up and running.

## Prerequisites

Before you begin, make sure you have:

1. **Node.js** (v18 or higher) and npm installed
2. **Git** for version control
3. Active accounts on:
   - [Supabase](https://supabase.com) - Database and authentication
   - [Anthropic](https://console.anthropic.com) - Claude API for AI coaching
   - [Intervals.icu](https://intervals.icu) - Training data platform (Premium recommended)
   - [Vercel](https://vercel.com) - Deployment (optional for now)

## Local Development Setup

### 1. Clone the Repository

```bash
git clone https://github.com/Marteau19/virtual_coach.git
cd virtual_coach
```

### 2. Install Dependencies

```bash
npm install
```

This will install all required packages including:
- Next.js 14+
- Supabase client libraries
- Anthropic AI SDK (Claude)
- Axios, date-fns, zod, and other utilities

### 3. Set Up Supabase Database

1. Create a new project at [app.supabase.com](https://app.supabase.com)
2. Go to **SQL Editor** in your Supabase dashboard
3. Copy the contents of `schema.sql` from this repository
4. Paste and execute the SQL in the editor
5. This will create all tables, indexes, RLS policies, and functions

### 4. Configure Environment Variables

1. Copy the example environment file:
   ```bash
   cp .env.example .env.local
   ```

2. Fill in your actual credentials in `.env.local`:

   **Supabase** (from Settings → API):
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
   ```

   **Claude API** (from console.anthropic.com):
   ```
   ANTHROPIC_API_KEY=sk-ant-api03-...
   ```

   **Intervals.icu** (from intervals.icu/settings - Developer Settings):
   ```
   INTERVALS_ICU_API_KEY=your_api_key_here
   INTERVALS_ICU_ATHLETE_ID=i12345
   ```

   **App URL**:
   ```
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

3. **Never commit `.env.local`** - it's already in `.gitignore`

### 5. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
virtual_coach/
├── src/
│   ├── app/              # Next.js app directory (pages & API routes)
│   │   └── api/          # API endpoints
│   ├── components/       # React components
│   │   ├── ui/          # Reusable UI components
│   │   ├── chat/        # Chat interface components
│   │   ├── dashboard/   # Dashboard components
│   │   ├── calendar/    # Calendar components
│   │   ├── plans/       # Training plan components
│   │   └── workouts/    # Workout components
│   ├── lib/             # Utilities and services
│   │   ├── supabase/   # Supabase client setup
│   │   ├── ai/         # Claude AI integration
│   │   ├── intervals/  # Intervals.icu API client
│   │   └── services/   # Business logic
│   └── types/          # TypeScript type definitions
├── public/             # Static assets
├── schema.sql          # Database schema
├── ARCHITECTURE.md     # System architecture docs
├── ROADMAP.md         # Implementation roadmap
└── DECISIONS.md       # Architecture decision records
```

## Development Workflow

### Making Changes

1. Create a feature branch:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. Make your changes

3. Test locally:
   ```bash
   npm run dev
   ```

4. Lint and type-check:
   ```bash
   npm run lint
   npx tsc --noEmit
   ```

5. Commit your changes:
   ```bash
   git add .
   git commit -m "feat: your change description"
   ```

6. Push and create PR:
   ```bash
   git push -u origin feature/your-feature-name
   ```

### Commit Message Format

Use conventional commits:
- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation changes
- `refactor:` - Code refactoring
- `test:` - Adding tests
- `chore:` - Maintenance tasks

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Testing the Setup

### 1. Test Supabase Connection

Once Phase 1 is implemented, you can test the database connection:
```bash
# This will be available after auth implementation
curl http://localhost:3000/api/health
```

### 2. Test Intervals.icu API

Try fetching your activities:
```bash
curl -H "Authorization: Bearer YOUR_API_KEY" \
     https://intervals.icu/api/v1/athlete/YOUR_ATHLETE_ID/activities
```

### 3. Test Claude API

After chat implementation:
```bash
# Send a test message to the coach
curl -X POST http://localhost:3000/api/chat \
     -H "Content-Type: application/json" \
     -d '{"message": "Hello coach!"}'
```

## Troubleshooting

### Port Already in Use

If port 3000 is taken:
```bash
PORT=3001 npm run dev
```

### Environment Variables Not Loading

1. Make sure `.env.local` exists in the project root
2. Restart the dev server after changing env vars
3. Check for typos in variable names

### Supabase Connection Issues

1. Verify your Supabase URL and keys in `.env.local`
2. Check that RLS policies are set up correctly
3. Ensure tables were created from `schema.sql`

### TypeScript Errors

```bash
# Type check without building
npx tsc --noEmit

# If errors persist, try clearing cache
rm -rf .next
npm run dev
```

## Next Steps

- Review [ARCHITECTURE.md](./ARCHITECTURE.md) for system design
- Check [ROADMAP.md](./ROADMAP.md) for implementation phases
- Read [DECISIONS.md](./DECISIONS.md) for architectural rationale

## Getting Help

- Check existing documentation in this repo
- Review [Intervals.icu API docs](https://intervals.icu/api-docs.html)
- See [Supabase docs](https://supabase.com/docs)
- Read [Claude API docs](https://docs.anthropic.com/)

---

Ready to start building? Check the [ROADMAP.md](./ROADMAP.md) for Phase 1 tasks!
