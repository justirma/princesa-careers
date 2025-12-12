# Job Search Assistant

AI-powered job search and career assistant built with Next.js, Anthropic Claude, and Supabase.

## Features

- Resume parsing and profile extraction using Claude
- Job ingestion from Greenhouse and RemoteOK APIs
- AI-powered job matching with semantic embeddings
- Job application tracker (Kanban-style)
- Chat-based career assistant
- Resume tailoring and interview prep

## Tech Stack

- **Frontend:** Next.js 15, React 19, Tailwind CSS
- **Backend:** Next.js API Routes
- **Database:** Supabase (Postgres with pgvector)
- **AI:** Anthropic Claude, OpenAI Embeddings
- **Deployment:** Vercel

## Getting Started

1. Clone the repository
2. Copy `.env.example` to `.env.local` and fill in your API keys
3. Install dependencies:

```bash
npm install
```

4. Run the development server:

```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000)

## Environment Variables

See `.env.example` for required environment variables.

## Database Setup

See `SETUP_GUIDE.md` for detailed database setup instructions.

## Product Spec

See `PRODUCT_SPEC.md` for the complete product specification.
