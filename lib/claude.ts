import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export interface ExtractedProfile {
  skills: string[];
  experience_summary: string;
  titles: string[];
  industries: string[];
  location: string;
  remote_preference: 'remote' | 'hybrid' | 'onsite' | 'flexible';
}

export async function extractResumeInfo(resumeText: string): Promise<ExtractedProfile> {
  const message = await anthropic.messages.create({
    model: 'claude-3-5-sonnet-20241022',
    max_tokens: 2000,
    messages: [
      {
        role: 'user',
        content: `You are a resume parser. Extract structured information from the following resume text.

Resume text:
${resumeText}

Extract and return ONLY valid JSON in this exact format (no additional text):
{
  "skills": ["skill1", "skill2", ...],
  "experience_summary": "A brief 2-3 sentence summary of the person's professional experience",
  "titles": ["Software Engineer", "Product Manager", ...],
  "industries": ["Technology", "Finance", ...],
  "location": "City, State or Country",
  "remote_preference": "remote" | "hybrid" | "onsite" | "flexible"
}

Important:
- Extract all technical and soft skills mentioned
- Include all job titles the person has held
- Identify industries they've worked in
- Infer location from address or contact info
- Infer remote preference from resume (default to "flexible" if unclear)
- Return ONLY the JSON, no markdown, no explanation`,
      },
    ],
  });

  const content = message.content[0];
  if (content.type !== 'text') {
    throw new Error('Unexpected response type from Claude');
  }

  try {
    // Remove potential markdown code blocks
    let jsonText = content.text.trim();
    if (jsonText.startsWith('```')) {
      jsonText = jsonText.replace(/```json?\n?/g, '').replace(/```\n?$/g, '');
    }

    const parsed = JSON.parse(jsonText);
    return parsed as ExtractedProfile;
  } catch (error) {
    console.error('Failed to parse Claude response:', content.text);
    throw new Error('Failed to parse resume data from Claude response');
  }
}

export async function generateChatResponse(
  message: string,
  context: {
    userProfile?: any;
    recentJobs?: any[];
  }
): Promise<string> {
  const systemPrompt = `You are a helpful career assistant. You help users with:
- Job recommendations based on their profile
- Resume tailoring advice
- Interview preparation
- Career guidance

User profile: ${context.userProfile ? JSON.stringify(context.userProfile) : 'Not yet created'}
Recent jobs: ${context.recentJobs ? JSON.stringify(context.recentJobs.slice(0, 5)) : 'None'}

Be concise, helpful, and actionable in your responses.`;

  const response = await anthropic.messages.create({
    model: 'claude-3-5-sonnet-20241022',
    max_tokens: 1024,
    system: systemPrompt,
    messages: [
      {
        role: 'user',
        content: message,
      },
    ],
  });

  const content = response.content[0];
  if (content.type !== 'text') {
    throw new Error('Unexpected response type from Claude');
  }

  return content.text;
}
