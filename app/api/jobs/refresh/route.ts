import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import {
  fetchAllGreenhouseJobs,
  fetchRemoteOKJobs,
  enrichJobWithEmbedding,
} from '@/lib/job-sources';

export async function POST(request: NextRequest) {
  try {
    console.log('Starting job refresh...');

    // Fetch jobs from all sources
    const [greenhouseJobs, remoteOKJobs] = await Promise.all([
      fetchAllGreenhouseJobs(),
      fetchRemoteOKJobs(),
    ]);

    const allJobs = [...greenhouseJobs, ...remoteOKJobs];
    console.log(`Fetched ${allJobs.length} total jobs`);

    let successCount = 0;
    let errorCount = 0;

    // Process jobs in batches to avoid overwhelming the embedding API
    const batchSize = 5;
    for (let i = 0; i < allJobs.length; i += batchSize) {
      const batch = allJobs.slice(i, i + batchSize);

      await Promise.all(
        batch.map(async (job) => {
          try {
            // Enrich with embedding
            const enrichedJob = await enrichJobWithEmbedding(job);

            // Insert or update in database
            const { error } = await (supabase.from('jobs') as any).upsert(
              {
                source_id: enrichedJob.source_id,
                title: enrichedJob.title,
                company: enrichedJob.company,
                location: enrichedJob.location,
                description: enrichedJob.description,
                requirements: enrichedJob.requirements,
                apply_url: enrichedJob.apply_url,
                source: enrichedJob.source,
                job_embedding: `[${enrichedJob.embedding.join(',')}]`,
                scraped_at: new Date().toISOString(),
              },
              {
                onConflict: 'source,source_id',
                ignoreDuplicates: false,
              }
            );

            if (error) {
              console.error(`Error inserting job ${job.source_id}:`, error);
              errorCount++;
            } else {
              successCount++;
            }
          } catch (error) {
            console.error(`Error processing job ${job.source_id}:`, error);
            errorCount++;
          }
        })
      );

      // Small delay between batches
      if (i + batchSize < allJobs.length) {
        await new Promise((resolve) => setTimeout(resolve, 500));
      }
    }

    console.log(`Job refresh complete: ${successCount} successful, ${errorCount} errors`);

    return NextResponse.json({
      success: true,
      stats: {
        total: allJobs.length,
        successful: successCount,
        errors: errorCount,
      },
    });
  } catch (error: any) {
    console.error('Error refreshing jobs:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to refresh jobs' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { data, error } = await supabase
      .from('jobs')
      .select('count')
      .limit(1);

    if (error) throw error;

    const { data: latestJob } = await supabase
      .from('jobs')
      .select('scraped_at')
      .order('scraped_at', { ascending: false })
      .limit(1)
      .single();

    return NextResponse.json({
      count: data?.length || 0,
      last_refresh: (latestJob as any)?.scraped_at || null,
    });
  } catch (error: any) {
    console.error('Error getting job stats:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to get job stats' },
      { status: 500 }
    );
  }
}
