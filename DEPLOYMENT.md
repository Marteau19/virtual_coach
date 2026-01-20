# Deploying Virtual Coach to Render

This guide will walk you through deploying the Virtual Coach application to Render.

## Prerequisites

1. GitHub repository with your Virtual Coach code (already done ✓)
2. Free Render account at [render.com](https://render.com)

## Step-by-Step Deployment

### 1. Create a Render Account

1. Go to [render.com](https://render.com)
2. Click "Get Started" or "Sign Up"
3. Sign up using your GitHub account (recommended) or email

### 2. Deploy from GitHub

1. Once logged in, click **"New +"** in the top right
2. Select **"Web Service"**
3. Click **"Connect account"** to link your GitHub
4. Find and select your **virtual_coach** repository
5. Click **"Connect"**

### 3. Configure the Web Service

Render will auto-detect your Next.js app. Configure these settings:

**Basic Settings:**
- **Name**: `virtual-coach` (or your preferred name)
- **Region**: Choose closest to you (e.g., Oregon, Frankfurt)
- **Branch**: `claude/plan-project-architecture-M5YSY` (or `main` once you merge)
- **Root Directory**: Leave empty
- **Environment**: `Node`
- **Build Command**: `npm install && npm run build`
- **Start Command**: `npm start`

**Instance Type:**
- Select **"Free"** (perfect for development and testing)
- Note: Free tier sleeps after 15 min of inactivity

### 4. Environment Variables (Optional for Now)

Click **"Advanced"** and add environment variables:

**For Now (Skip These):**
You can add these later when we implement authentication and AI features:
```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
ANTHROPIC_API_KEY=
```

**Optional Testing Variables:**
```
INTERVALS_ICU_API_KEY=your_key
INTERVALS_ICU_ATHLETE_ID=your_id
```

### 5. Deploy!

1. Click **"Create Web Service"**
2. Render will start building your app
3. Watch the logs as it builds (takes 2-5 minutes)
4. Once complete, you'll get a URL like: `https://virtual-coach.onrender.com`

### 6. Test Your Deployment

1. Open your Render URL in a browser
2. You should see the Virtual Coach landing page
3. Click "View Dashboard" to see the dashboard preview
4. Verify all sections load correctly

## What You'll See

### Landing Page Features:
- ✓ Hero section with branding
- ✓ Feature cards
- ✓ "How It Works" section
- ✓ Development roadmap
- ✓ Tech stack showcase

### Dashboard Features:
- ✓ System status
- ✓ Development progress (25% Phase 1)
- ✓ Feature previews (mockups)
  - AI Coach chat
  - Activity feed
  - Fitness metrics
  - Training plan

## Auto-Deploy on Push

Render automatically deploys when you push to your connected branch!

**Workflow:**
1. Make changes locally
2. Commit: `git add . && git commit -m "your message"`
3. Push: `git push origin claude/plan-project-architecture-M5YSY`
4. Render automatically rebuilds (check dashboard for progress)
5. Changes live in 2-5 minutes!

## Troubleshooting

### Build Fails

**Check these:**
1. Build logs in Render dashboard
2. Ensure `package.json` has correct scripts:
   ```json
   {
     "scripts": {
       "dev": "next dev",
       "build": "next build",
       "start": "next start"
     }
   }
   ```
3. Node version compatible (v18+)

### App Won't Start

**Common fixes:**
1. Verify Start Command: `npm start`
2. Check environment variables (though none required yet)
3. Review deploy logs for errors

### Site is Slow

**Expected on free tier:**
- Free instances sleep after 15 min of inactivity
- First request "wakes up" the app (takes 30-60 seconds)
- Subsequent requests are fast
- Upgrade to paid tier ($7/mo) for always-on

### Pages Not Loading

**Check:**
1. Clear browser cache
2. Check Render logs for errors
3. Ensure build completed successfully
4. Try incognito/private window

## Monitoring Your App

### Render Dashboard

View in real-time:
- Deploy status
- Build logs
- Runtime logs
- Metrics (requests, response time, memory)

### Access Logs

1. Go to Render dashboard
2. Select your service
3. Click "Logs" tab
4. See real-time and historical logs

## Updating Your Deployment

### Method 1: Auto-Deploy (Recommended)

Just push to GitHub:
```bash
git add .
git commit -m "Update landing page"
git push origin claude/plan-project-architecture-M5YSY
```

Render automatically detects and deploys!

### Method 2: Manual Deploy

1. Go to Render dashboard
2. Select your service
3. Click "Manual Deploy" → "Deploy latest commit"

## Custom Domain (Optional)

Want your own domain instead of `.onrender.com`?

1. In Render dashboard, go to your service
2. Click "Settings"
3. Scroll to "Custom Domain"
4. Add your domain (e.g., `coach.yourdomain.com`)
5. Update DNS records (Render provides instructions)

Free on all Render tiers!

## Next Steps

### When Ready for Production Features:

1. **Create Supabase Project**
   - Follow SETUP.md instructions
   - Run schema.sql
   - Get API keys

2. **Add Environment Variables in Render**
   - Go to Settings → Environment
   - Add Supabase and Anthropic keys
   - Save and redeploy

3. **Implement Authentication**
   - Follow Phase 1 Week 1 roadmap
   - Users can sign up/login
   - Protect dashboard with auth

4. **Enable AI Coach**
   - Add Anthropic API key
   - Implement chat functionality
   - Connect to user's training data

## Cost Estimates

### Free Tier (Current)
- **Cost**: $0/month
- **Limitations**:
  - Sleeps after 15 min inactive
  - 750 hours/month (enough for development)
  - Shared resources

### Starter Tier (Production)
- **Cost**: $7/month
- **Benefits**:
  - Always-on (no sleeping)
  - Better performance
  - More memory/CPU

## Support

### Render Issues
- [Render Docs](https://render.com/docs)
- [Render Community](https://community.render.com)
- [Render Status](https://status.render.com)

### Virtual Coach Issues
- Check project documentation (ARCHITECTURE.md, ROADMAP.md)
- Review [SETUP.md](./SETUP.md) for local development
- Open issue on GitHub

---

## Quick Reference

**Your App URL**: `https://your-service-name.onrender.com`

**Useful Commands:**
```bash
# Build locally (test before deploy)
npm run build

# Start production server locally
npm run build && npm start

# Check if ready to deploy
git status
git log --oneline -5
```

**Render Dashboard**: https://dashboard.render.com

---

**Congratulations!** 🎉 Your Virtual Coach is now live on the web!

Share your URL and start showing off your AI cycling coach project!
