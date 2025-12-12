import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { generateProfileEmbedding } from '@/lib/embeddings';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      desired_titles,
      location,
      remote_only,
      salary_range_min,
      salary_range_max,
      industries,
    } = body;

    // For MVP, use default user
    const defaultUserId = '00000000-0000-0000-0000-000000000001';

    // Get existing profile
    const { data: profile, error: fetchError } = await supabase
      .from('user_profile')
      .select('*')
      .eq('user_id', defaultUserId)
      .single();

    if (fetchError || !profile) {
      return NextResponse.json(
        { error: 'Profile not found. Please upload a resume first.' },
        { status: 404 }
      );
    }

    const profileData = profile as any;

    // Update profile with new preferences
    const updateData: any = {};

    if (desired_titles) updateData.desired_titles = desired_titles;
    if (location !== undefined) updateData.location = location;
    if (remote_only !== undefined) updateData.remote_only = remote_only;
    if (salary_range_min !== undefined) updateData.salary_range_min = salary_range_min;
    if (salary_range_max !== undefined) updateData.salary_range_max = salary_range_max;

    // Regenerate embedding with updated preferences
    if (desired_titles) {
      const embedding = await generateProfileEmbedding({
        skills: profileData.skills,
        experience_summary: profileData.experience_summary,
        desired_titles: desired_titles,
      });
      updateData.embedding = `[${embedding.join(',')}]`;
    }

    const { data, error } = await (supabase
      .from('user_profile') as any)
      .update(updateData)
      .eq('id', profileData.id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({
      success: true,
      profile: data,
    });
  } catch (error: any) {
    console.error('Error updating preferences:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update preferences' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const defaultUserId = '00000000-0000-0000-0000-000000000001';

    const { data: profile, error } = await supabase
      .from('user_profile')
      .select('*')
      .eq('user_id', defaultUserId)
      .single();

    if (error || !profile) {
      return NextResponse.json(
        { error: 'Profile not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ profile });
  } catch (error: any) {
    console.error('Error fetching profile:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch profile' },
      { status: 500 }
    );
  }
}
