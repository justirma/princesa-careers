import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { job_id, status = 'saved', notes } = body;

    if (!job_id) {
      return NextResponse.json(
        { error: 'job_id is required' },
        { status: 400 }
      );
    }

    // For MVP, use default user
    const defaultUserId = '00000000-0000-0000-0000-000000000001';

    // Check if application already exists
    const { data: existingApp } = await supabase
      .from('applications')
      .select('id')
      .eq('user_id', defaultUserId)
      .eq('job_id', job_id)
      .single();

    if (existingApp) {
      return NextResponse.json(
        { error: 'Job already in tracker' },
        { status: 400 }
      );
    }

    // Create new application
    const { data, error } = await supabase
      .from('applications')
      .insert({
        user_id: defaultUserId,
        job_id,
        status,
        notes,
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({
      success: true,
      application: data,
    });
  } catch (error: any) {
    console.error('Error adding to tracker:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to add to tracker' },
      { status: 500 }
    );
  }
}
