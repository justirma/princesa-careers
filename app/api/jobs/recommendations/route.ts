import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { cosineSimilarity } from '@/lib/embeddings';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const limit = parseInt(searchParams.get('limit') || '20');

    // For MVP, use default user
    const defaultUserId = '00000000-0000-0000-0000-000000000001';

    // Get user profile with embedding
    const { data: profile, error: profileError } = await supabase
      .from('user_profile')
      .select('*')
      .eq('user_id', defaultUserId)
      .single();

    if (profileError || !profile) {
      return NextResponse.json(
        { error: 'Profile not found. Please upload a resume first.' },
        { status: 404 }
      );
    }

    const profileData = profile as any;

    if (!profileData.embedding) {
      return NextResponse.json(
        { error: 'Profile embedding not found. Please re-upload your resume.' },
        { status: 400 }
      );
    }

    // Get all jobs
    const { data: jobs, error: jobsError } = await supabase
      .from('jobs')
      .select('*')
      .not('job_embedding', 'is', null)
      .order('scraped_at', { ascending: false });

    if (jobsError) throw jobsError;

    if (!jobs || jobs.length === 0) {
      return NextResponse.json({
        jobs: [],
        message: 'No jobs available. Please refresh jobs first.',
      });
    }

    // Parse embeddings and calculate similarity scores
    const profileEmbedding = typeof profileData.embedding === 'string'
      ? JSON.parse(profileData.embedding)
      : profileData.embedding;

    const jobsWithScores = (jobs as any[])
      .map((job) => {
        try {
          const jobEmbedding = typeof job.job_embedding === 'string'
            ? JSON.parse(job.job_embedding)
            : job.job_embedding;

          const similarity = cosineSimilarity(profileEmbedding, jobEmbedding);

          // Apply filters
          let matchesFilters = true;

          // Remote filter
          if (profileData.remote_only) {
            const locationLower = (job.location || '').toLowerCase();
            if (!locationLower.includes('remote') && !locationLower.includes('anywhere')) {
              matchesFilters = false;
            }
          }

          // Title matching (boost score if title matches desired titles)
          const titleBoost = profileData.desired_titles?.some((desiredTitle: string) =>
            job.title.toLowerCase().includes(desiredTitle.toLowerCase())
          ) ? 0.1 : 0;

          return {
            ...job,
            similarity_score: similarity + titleBoost,
            matches_filters: matchesFilters,
            title_match: titleBoost > 0,
          };
        } catch (error) {
          console.error(`Error processing job ${job.id}:`, error);
          return null;
        }
      })
      .filter((job): job is NonNullable<typeof job> => job !== null)
      .filter((job) => job.matches_filters)
      .sort((a, b) => b.similarity_score - a.similarity_score)
      .slice(0, limit);

    // Categorize jobs
    const topMatches = jobsWithScores.filter((job) => job.title_match).slice(0, 10);
    const hiddenGems = jobsWithScores
      .filter((job) => !job.title_match && job.similarity_score > 0.7)
      .slice(0, 5);

    return NextResponse.json({
      jobs: jobsWithScores,
      topMatches,
      hiddenGems,
      stats: {
        total: jobs.length,
        matched: jobsWithScores.length,
        topMatches: topMatches.length,
        hiddenGems: hiddenGems.length,
      },
    });
  } catch (error: any) {
    console.error('Error getting recommendations:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to get recommendations' },
      { status: 500 }
    );
  }
}
