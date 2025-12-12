import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function generateEmbedding(text: string): Promise<number[]> {
  try {
    const response = await openai.embeddings.create({
      model: 'text-embedding-3-large',
      input: text,
      dimensions: 1536,
    });

    return response.data[0].embedding;
  } catch (error) {
    console.error('Error generating embedding:', error);
    throw new Error('Failed to generate embedding');
  }
}

export async function generateProfileEmbedding(profile: {
  skills: string[];
  experience_summary: string;
  desired_titles: string[];
}): Promise<number[]> {
  const text = `
Skills: ${profile.skills.join(', ')}
Experience: ${profile.experience_summary}
Desired roles: ${profile.desired_titles.join(', ')}
  `.trim();

  return generateEmbedding(text);
}

export async function generateJobEmbedding(job: {
  title: string;
  company: string;
  description: string;
  requirements?: string;
}): Promise<number[]> {
  const text = `
Title: ${job.title}
Company: ${job.company}
Description: ${job.description}
${job.requirements ? `Requirements: ${job.requirements}` : ''}
  `.trim();

  return generateEmbedding(text);
}

export function cosineSimilarity(a: number[], b: number[]): number {
  if (a.length !== b.length) {
    throw new Error('Vectors must have the same length');
  }

  let dotProduct = 0;
  let normA = 0;
  let normB = 0;

  for (let i = 0; i < a.length; i++) {
    dotProduct += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }

  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}
