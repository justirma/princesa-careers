# Quick Start Guide

Get your Job Search Assistant up and running in 5 minutes!

## 📋 What You'll Need

- Node.js 18+ installed
- A Supabase account (free tier works)
- An Anthropic API key
- An OpenAI API key

## 🚀 Setup Steps

### 1. Clone and Install

```bash
cd princesa-careers
npm install
```

### 2. Set Up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to SQL Editor
3. Copy and paste the entire `supabase-schema.sql` file
4. Click "Run" to create all tables and indexes

### 3. Configure Environment

```bash
cp .env.example .env.local
```

Edit `.env.local` and add your keys:

```env
ANTHROPIC_API_KEY=sk-ant-xxxxx
OPENAI_API_KEY=sk-xxxxx
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=xxxxx
SUPABASE_SERVICE_ROLE_KEY=xxxxx
```

### 4. Start the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## 🎯 First Time Use

### Step 1: Upload Your Resume
1. Click "Get Started"
2. Upload a PDF resume
3. Claude will extract your profile automatically
4. Review and confirm the extracted information

### Step 2: Set Preferences
1. Enter desired job titles (e.g., "Software Engineer, Full Stack Developer")
2. Set your location preferences
3. Toggle "Remote Only" if applicable
4. Optionally set salary range
5. Click "Save & Continue"

### Step 3: Load Jobs
1. Go to "Job Recommendations"
2. Click "Refresh Jobs" button
3. Wait 2-5 minutes for jobs to load from Greenhouse and RemoteOK
4. Browse your personalized recommendations!

### Step 4: Start Tracking
1. Click "Save to Tracker" on jobs you like
2. Go to "Application Tracker"
3. Move jobs between columns (Saved → Applied → Interviewing → Offer)
4. Add notes to each application

### Step 5: Get Career Guidance
1. Go to "Career Assistant"
2. Ask questions like:
   - "What are my top job matches?"
   - "Help me prepare for an interview"
   - "How can I improve my resume?"
   - "What skills should I focus on?"

## 💡 Pro Tips

1. **Refresh jobs daily** - New opportunities are posted every day
2. **Keep your tracker updated** - Move applications as your status changes
3. **Use the chat assistant** - It knows your profile and can give tailored advice
4. **Check "Hidden Gems"** - These are great matches you might not have considered

## 🔧 Troubleshooting

### Resume upload fails
- Make sure the file is a PDF
- Check that it's under 10MB
- Verify your Anthropic API key is set

### No jobs showing up
- Click "Refresh Jobs" in recommendations
- Wait a few minutes for jobs to load
- Check browser console for errors
- Verify OpenAI API key is set (needed for embeddings)

### Database errors
- Verify Supabase URL and keys are correct
- Make sure you ran the SQL schema
- Check that pgvector extension is enabled

### Chat not working
- Verify Anthropic API key
- Check you have API credits
- Upload a resume first (the chat uses your profile)

## 📚 What's Next?

Once you're set up:
- Explore the dashboard to see your application stats
- Try different job search preferences
- Use the chat to get resume tailoring advice
- Track your job search progress in the Kanban board

## 🎓 Learning More

- Read `PRODUCT_SPEC.md` for full feature details
- See `SETUP_GUIDE.md` for advanced configuration
- Check `DEPLOYMENT.md` to deploy to production

## ❓ Need Help?

- Check the troubleshooting section above
- Review the API logs in your browser console
- Verify all environment variables are set correctly

Happy job hunting! 🎉
