# Setup Guide

## 1. Supabase Setup

### Create a Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Create a new project
3. Wait for the database to be provisioned

### Run the Database Schema

1. In your Supabase dashboard, go to the SQL Editor
2. Copy the contents of `supabase-schema.sql`
3. Paste and run the SQL

This will create:
- All necessary tables (users, user_profile, jobs, applications)
- Enable pgvector extension for embeddings
- Create indexes for performance
- Set up triggers for updated_at timestamps
- Insert a default user for MVP

### Get Your API Keys

1. In Supabase dashboard, go to Settings > API
2. Copy the following:
   - Project URL → `NEXT_PUBLIC_SUPABASE_URL`
   - anon/public key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - service_role key → `SUPABASE_SERVICE_ROLE_KEY`

## 2. Environment Variables

1. Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

2. Fill in your API keys in `.env.local`:

```env
# Anthropic API Key
ANTHROPIC_API_KEY=sk-ant-...

# OpenAI API Key (for embeddings)
OPENAI_API_KEY=sk-...

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

## 3. Get API Keys

### Anthropic (Claude)
1. Go to [https://console.anthropic.com](https://console.anthropic.com)
2. Create an API key
3. Copy to `ANTHROPIC_API_KEY`

### OpenAI (for embeddings)
1. Go to [https://platform.openai.com](https://platform.openai.com)
2. Create an API key
3. Copy to `OPENAI_API_KEY`

## 4. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see your app.

## 5. Test the Setup

1. Visit the homepage
2. Click "Get Started" to begin onboarding
3. Upload a resume (PDF)
4. The app should extract your profile using Claude

## Troubleshooting

### Database Connection Issues
- Verify your Supabase URL and keys are correct
- Check that the database schema was run successfully
- Ensure pgvector extension is enabled

### API Issues
- Verify all API keys are set in `.env.local`
- Check that you have credits/quota on Anthropic and OpenAI

### Build Issues
- Delete `.next` folder and restart: `rm -rf .next && npm run dev`
- Clear node_modules: `rm -rf node_modules && npm install`
