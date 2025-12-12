# Deployment Guide - Vercel

This guide will walk you through deploying the Job Search Assistant to Vercel.

## Prerequisites

1. A Vercel account ([sign up here](https://vercel.com))
2. A Supabase project with the schema set up
3. API keys for Anthropic and OpenAI

## Step 1: Prepare Your Environment Variables

Before deploying, make sure you have these environment variables ready:

```
ANTHROPIC_API_KEY=your_anthropic_api_key
OPENAI_API_KEY=your_openai_api_key
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

## Step 2: Deploy to Vercel

### Option A: Deploy via Vercel CLI

1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. Deploy:
```bash
vercel
```

3. Follow the prompts and add your environment variables when asked

### Option B: Deploy via Vercel Dashboard

1. Go to [vercel.com/new](https://vercel.com/new)
2. Import your Git repository
3. Vercel will auto-detect Next.js
4. Add your environment variables in the "Environment Variables" section
5. Click "Deploy"

## Step 3: Add Environment Variables in Vercel

In your Vercel project settings:

1. Go to Settings → Environment Variables
2. Add each variable from your `.env.local`:
   - `ANTHROPIC_API_KEY`
   - `OPENAI_API_KEY`
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
3. Make sure to add them for all environments (Production, Preview, Development)

## Step 4: Verify Deployment

1. Once deployed, visit your app URL
2. Test the onboarding flow:
   - Upload a resume
   - Check if profile extraction works
3. Load jobs:
   - Go to recommendations
   - Click "Refresh Jobs"
   - Wait for jobs to load
4. Test the tracker and chat features

## Important Notes

### Rate Limits
- The job refresh endpoint can take several minutes
- Consider setting up a cron job for daily refreshes instead of manual triggers
- You may want to add rate limiting to prevent abuse

### Function Timeout
- Vercel has a 10-second timeout on Hobby plan
- The `/api/jobs/refresh` endpoint may timeout on free plan
- Consider upgrading to Pro plan or using background jobs

### Database
- Make sure your Supabase database has the pgvector extension enabled
- Run the `supabase-schema.sql` before deploying
- Check that the default user exists

### Scaling Considerations
For production use:
1. Add authentication (Supabase Auth or NextAuth.js)
2. Implement proper error tracking (Sentry)
3. Add rate limiting middleware
4. Set up cron jobs for job refreshing
5. Add analytics (Vercel Analytics)
6. Implement caching for recommendations

## Troubleshooting

### Build Fails
- Check that all environment variables are set
- Verify TypeScript has no errors: `npm run build`
- Check the build logs in Vercel dashboard

### API Errors
- Verify all API keys are correct
- Check Supabase connection
- Review function logs in Vercel dashboard

### Slow Performance
- Enable Vercel Analytics to identify bottlenecks
- Consider caching recommendations
- Optimize database queries with proper indexes

## Next Steps

After successful deployment:

1. Test all features thoroughly
2. Upload your resume and set preferences
3. Refresh jobs to populate the database
4. Try the job recommendations
5. Test the application tracker
6. Chat with the career assistant

## Support

If you encounter issues:
- Check Vercel function logs
- Review Supabase logs
- Verify API key quotas (Anthropic/OpenAI)

Enjoy your Job Search Assistant! 🎉
