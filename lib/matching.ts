// Simple text-based matching without embeddings
// Uses keyword matching and scoring

export interface UserProfile {
  skills: string[];
  experience_summary: string;
  desired_titles: string[];
  location?: string;
  remote_only?: boolean;
}

export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  description: string;
  requirements?: string;
}

export function calculateJobMatch(profile: UserProfile, job: Job): number {
  let score = 0;
  const maxScore = 100;

  // 1. Title matching (40 points)
  const titleScore = calculateTitleMatch(profile.desired_titles, job.title);
  score += titleScore * 0.4;

  // 2. Skills matching (30 points)
  const skillsScore = calculateSkillsMatch(profile.skills, job.description + ' ' + (job.requirements || ''));
  score += skillsScore * 0.3;

  // 3. Location matching (20 points)
  const locationScore = calculateLocationMatch(profile, job);
  score += locationScore * 0.2;

  // 4. Keyword relevance (10 points)
  const keywordScore = calculateKeywordMatch(profile.experience_summary, job.description);
  score += keywordScore * 0.1;

  return Math.min(score, maxScore) / 100; // Return as 0-1 score
}

function calculateTitleMatch(desiredTitles: string[], jobTitle: string): number {
  const jobTitleLower = jobTitle.toLowerCase();

  for (const desiredTitle of desiredTitles) {
    const desiredLower = desiredTitle.toLowerCase();

    // Exact match
    if (jobTitleLower === desiredLower) return 100;

    // Contains match
    if (jobTitleLower.includes(desiredLower) || desiredLower.includes(jobTitleLower)) {
      return 80;
    }

    // Word overlap
    const jobWords = jobTitleLower.split(/\s+/);
    const desiredWords = desiredLower.split(/\s+/);
    const overlap = jobWords.filter(word => desiredWords.includes(word) && word.length > 2);

    if (overlap.length >= 2) return 60;
    if (overlap.length === 1) return 40;
  }

  return 0;
}

function calculateSkillsMatch(skills: string[], jobText: string): number {
  if (!skills || skills.length === 0) return 50; // Neutral score if no skills

  const jobTextLower = jobText.toLowerCase();
  let matchCount = 0;

  for (const skill of skills) {
    const skillLower = skill.toLowerCase();
    if (jobTextLower.includes(skillLower)) {
      matchCount++;
    }
  }

  const matchPercentage = (matchCount / skills.length) * 100;
  return Math.min(matchPercentage, 100);
}

function calculateLocationMatch(profile: UserProfile, job: Job): number {
  const jobLocationLower = (job.location || '').toLowerCase();

  // Remote jobs
  if (jobLocationLower.includes('remote') || jobLocationLower.includes('anywhere')) {
    return 100;
  }

  // User wants remote only but job isn't remote
  if (profile.remote_only && !jobLocationLower.includes('remote')) {
    return 0;
  }

  // Location matching
  if (profile.location) {
    const profileLocationLower = profile.location.toLowerCase();

    if (jobLocationLower.includes(profileLocationLower) ||
        profileLocationLower.includes(jobLocationLower)) {
      return 100;
    }

    // Partial match (same state/country)
    const profileParts = profileLocationLower.split(',').map(p => p.trim());
    const jobParts = jobLocationLower.split(',').map(p => p.trim());

    for (const pp of profileParts) {
      for (const jp of jobParts) {
        if (pp === jp && pp.length > 2) return 70;
      }
    }
  }

  return 50; // Neutral if no location preference
}

function calculateKeywordMatch(experienceSummary: string, jobDescription: string): number {
  const expLower = experienceSummary.toLowerCase();
  const jobLower = jobDescription.toLowerCase();

  // Extract important words (longer than 4 chars)
  const expWords = expLower.match(/\b\w{5,}\b/g) || [];
  const jobWords = new Set(jobLower.match(/\b\w{5,}\b/g) || []);

  let matches = 0;
  for (const word of expWords) {
    if (jobWords.has(word)) matches++;
  }

  if (expWords.length === 0) return 50;

  return Math.min((matches / expWords.length) * 100, 100);
}

export function rankJobs(profile: UserProfile, jobs: Job[]): Array<Job & { match_score: number }> {
  return jobs
    .map(job => ({
      ...job,
      match_score: calculateJobMatch(profile, job),
    }))
    .sort((a, b) => b.match_score - a.match_score);
}
