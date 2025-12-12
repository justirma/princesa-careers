import { generateJobEmbedding } from './embeddings';

export interface RawJob {
  source_id: string;
  title: string;
  company: string;
  location: string;
  description: string;
  requirements?: string;
  apply_url: string;
  source: string;
}

// Greenhouse API
export async function fetchGreenhouseJobs(boardToken: string): Promise<RawJob[]> {
  try {
    const response = await fetch(
      `https://boards-api.greenhouse.io/v1/boards/${boardToken}/jobs?content=true`
    );

    if (!response.ok) {
      throw new Error(`Greenhouse API error: ${response.statusText}`);
    }

    const data = await response.json();
    const jobs: RawJob[] = [];

    for (const job of data.jobs) {
      jobs.push({
        source_id: job.id.toString(),
        title: job.title,
        company: boardToken,
        location: job.location?.name || 'Remote',
        description: job.content || '',
        requirements: job.content || '',
        apply_url: job.absolute_url,
        source: 'greenhouse',
      });
    }

    return jobs;
  } catch (error) {
    console.error('Error fetching Greenhouse jobs:', error);
    return [];
  }
}

// RemoteOK API
export async function fetchRemoteOKJobs(): Promise<RawJob[]> {
  try {
    const response = await fetch('https://remoteok.com/api', {
      headers: {
        'User-Agent': 'JobSearchAssistant/1.0',
      },
    });

    if (!response.ok) {
      throw new Error(`RemoteOK API error: ${response.statusText}`);
    }

    const data = await response.json();
    const jobs: RawJob[] = [];

    // Skip first item (it's metadata)
    for (let i = 1; i < data.length && i < 50; i++) {
      const job = data[i];

      jobs.push({
        source_id: job.id || job.slug,
        title: job.position,
        company: job.company,
        location: job.location || 'Remote',
        description: job.description || '',
        requirements: job.description || '',
        apply_url: job.url || `https://remoteok.com/remote-jobs/${job.slug}`,
        source: 'remoteok',
      });
    }

    return jobs;
  } catch (error) {
    console.error('Error fetching RemoteOK jobs:', error);
    return [];
  }
}

// Fetch from multiple popular Greenhouse boards
export async function fetchAllGreenhouseJobs(): Promise<RawJob[]> {
  const boards = [
    'anthropic',
    'openai',
    'vercel',
    'stripe',
    'figma',
    'notion',
    'linear',
  ];

  const allJobs: RawJob[] = [];

  for (const board of boards) {
    const jobs = await fetchGreenhouseJobs(board);
    allJobs.push(...jobs);
    // Add delay to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  return allJobs;
}

export async function enrichJobWithEmbedding(job: RawJob): Promise<RawJob & { embedding: number[] }> {
  const embedding = await generateJobEmbedding({
    title: job.title,
    company: job.company,
    description: job.description,
    requirements: job.requirements,
  });

  return {
    ...job,
    embedding,
  };
}
