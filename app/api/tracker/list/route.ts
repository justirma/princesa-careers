import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    // For MVP, use default user
    const defaultUserId = '00000000-0000-0000-0000-000000000001';

    // Get all applications with job details
    const { data: applications, error } = await supabase
      .from('applications')
      .select(`
        *,
        jobs (*)
      `)
      .eq('user_id', defaultUserId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    const appsData = applications as any[];

    // Group by status for Kanban view
    const grouped = {
      saved: appsData?.filter((app) => app.status === 'saved') || [],
      applied: appsData?.filter((app) => app.status === 'applied') || [],
      interviewing: appsData?.filter((app) => app.status === 'interviewing') || [],
      offer: appsData?.filter((app) => app.status === 'offer') || [],
      rejected: appsData?.filter((app) => app.status === 'rejected') || [],
    };

    return NextResponse.json({
      applications: applications || [],
      grouped,
      stats: {
        total: applications?.length || 0,
        saved: grouped.saved.length,
        applied: grouped.applied.length,
        interviewing: grouped.interviewing.length,
        offer: grouped.offer.length,
        rejected: grouped.rejected.length,
      },
    });
  } catch (error: any) {
    console.error('Error listing applications:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to list applications' },
      { status: 500 }
    );
  }
}
