# 📘 **One-Week MVP Product Spec: Job Search Assistant**

## 1. **High-Level Overview**

Build a web-based "job search assistant" that:

* ingests a user's resume & preferences
* fetches job listings from simple public APIs
* uses embeddings + LLM to rank and recommend jobs
* stores job saves, application statuses, and notes
* provides a chat-based agent that helps with job recommendations, resume tailoring, and interview prep
* all application actions are manual (no auto-apply)

Technologies preferred:

* **Next.js + Tailwind** (frontend)
* **Supabase or Postgres** (database)
* **Node.js backend API routes (Next.js API or separate server)**
* **OpenAI or Anthropic for LLM + embeddings**
* **Greenhouse Job Board API + RemoteOK API** for job data
* Deploy on **Vercel**

---

## 2. **Core Features (MVP)**

### **2.1 Resume Upload + Profile Extraction**

User uploads a PDF resume.
Backend uses LLM to extract:

* skills (list)
* experience summary
* job titles
* industries
* soft skills
* location preferences
* remote/hybrid preferences (optional)

Store results in `user_profile` table.

**API Endpoint:**
`POST /api/profile/upload_resume`
**Output:** extracted JSON profile.

---

### **2.2 User Preferences Setup**

Simple form with:

* desired titles
* location
* remote-only toggle
* salary range (optional)
* industries of interest

**API Endpoint:**
`POST /api/profile/preferences`

---

### **2.3 Job Ingestion Pipeline (Read-Only)**

Daily (or on-demand) fetch jobs from:

1. **Greenhouse Job Board API**
   Example endpoint format:
   `https://boards-api.greenhouse.io/v1/boards/<company>/jobs`

2. **RemoteOK API**
   `https://remoteok.com/api`

Normalize job data.

**API Endpoint (manual trigger):**
`POST /api/jobs/refresh`

Store results in `jobs` table.

Fields to store:

* id
* title
* company
* location
* description
* requirements (if present)
* apply_url
* source ("greenhouse" / "remoteok")
* scraped_at
* job_embedding (vector)

---

### **2.4 Job Matching Engine**

When the user requests recommendations, compute:

* cosine similarity between user profile embedding & job embedding
* rule-based filters:

  * location
  * remote/hybrid
  * title keywords

Return:

* top matches
* "hidden gem" matches (semantic similarity but outside declared titles)

**API Endpoint:**
`GET /api/jobs/recommendations?user_id=<id>`

---

### **2.5 Job Tracker**

Simple CRUD board with statuses:

Statuses:

* SAVED
* APPLIED
* INTERVIEWING
* OFFER
* REJECTED

User can add optional notes.

**API Endpoints:**
`POST /api/tracker/add`
`POST /api/tracker/update_status`
`GET /api/tracker/list`

Stored in `applications` table.

---

### **2.6 Chat-Based Agent**

Chat interface that can:

* fetch job recommendations
* update application statuses
* explain why jobs match
* generate tailored resume bullet suggestions
* help prep for interviews
* generate short outreach messages

One system prompt powers the agent (I can write this too if you want).

**API Endpoint:**
`POST /api/agent/chat`

Input:

* message
* user_id

Output:

* assistant reply
* optional structured actions (e.g., `"action": "show_jobs"`)

---

## 3. **Database Schema (Minimal)**

### **3.1 users**

```
id (uuid)
email
created_at
```

### **3.2 user_profile**

```
id (uuid)
user_id (fk)
skills (json)
experience_summary (text)
desired_titles (json)
location (text)
remote_only (boolean)
salary_range_min (int)
salary_range_max (int)
embedding (vector)
created_at
```

### **3.3 jobs**

```
id (uuid)
source_id (string)
title (text)
company (text)
location (text)
description (text)
apply_url (text)
source (text)
job_embedding (vector)
scraped_at (timestamp)
```

### **3.4 applications**

```
id (uuid)
user_id (fk)
job_id (fk)
status (enum: saved/applied/interviewing/offer/rejected)
notes (text)
created_at
updated_at
```

---

## 4. **Frontend Screens**

### **4.1 Onboarding / Resume Upload**

* Upload resume
* See extracted info
* Confirm or edit preferences

### **4.2 Job Recommendations**

* List of recommended jobs
* "Why this job?" tooltip (from LLM)
* Filters (remote, location, company, etc.)
* Buttons: Save → save to tracker

### **4.3 Job Tracker (Kanban)**

Columns: Saved → Applied → Interviewing → Offer → Rejected
Draggable cards or simple list with buttons.

### **4.4 Chat Page**

* Chat UI (like ChatGPT)
* The agent can access user profile & jobs
* Quick action buttons:

  * "Top matches today"
  * "Prepare me for interview"
  * "Tailor resume for this job"

---

## 5. **LLM Tasks (Prompts + Behavior)**

### **5.1 Extract Resume Info**

Input: raw text from PDF
Output: JSON with:

```
{
  "skills": [...],
  "experience_summary": "...",
  "titles": [...],
  "industries": [...],
  "location": "...",
  "remote_preference": "remote/hybrid/onsite"
}
```

---

### **5.2 Generate Job Embeddings**

* Use embedding model (OpenAI `text-embedding-3-large`)
* Store vector in DB

---

### **5.3 Recommendation Reasoning**

Given user profile + job description:
Return:

```
{
  "fit_score": number,
  "reason": "Why this matches...",
  "skill_matches": [...],
  "skill_gaps": [...]
}
```

---

### **5.4 Tailored Resume Bullet Generator**

Input: job description + user summary
Output: 3–5 suggested bullet rewrites.

---

### **5.5 Interview Prep**

Modes:

* "General behavioral"
* "Role-specific questions"
* "Ask me questions to practice"

---

## 6. **API Routes Summary**

| Endpoint                     | Method | Purpose                         |
| ---------------------------- | ------ | ------------------------------- |
| `/api/profile/upload_resume` | POST   | Upload resume → extract profile |
| `/api/profile/preferences`   | POST   | Save preferences                |
| `/api/jobs/refresh`          | POST   | Fetch from Greenhouse/RemoteOK  |
| `/api/jobs/recommendations`  | GET    | Get matched jobs                |
| `/api/tracker/add`           | POST   | Add job to tracker              |
| `/api/tracker/update_status` | POST   | Update job status               |
| `/api/tracker/list`          | GET    | List all tracked jobs           |
| `/api/agent/chat`            | POST   | Chat-based agent interface      |

---

## 7. **Non-Goals (For Future Versions)**

These are explicitly *not* in the week-1 scope:

* Auto-applying to jobs
* Email integration
* Resume version management
* Analytics dashboard
* Scraping websites
* Multi-user support beyond single account

Keeping these out ensures week-1 success.
