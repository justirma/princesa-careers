import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { generateChatResponse } from '@/lib/claude';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { message } = body;

    if (!message) {
      return NextResponse.json(
        { error: 'message is required' },
        { status: 400 }
      );
    }

    // For MVP, use default user
    const defaultUserId = '00000000-0000-0000-0000-000000000001';

    // Get user profile
    const { data: profile } = await supabase
      .from('user_profile')
      .select('*')
      .eq('user_id', defaultUserId)
      .single();

    // Get recent job recommendations
    const { data: jobs } = await supabase
      .from('jobs')
      .select('*')
      .order('scraped_at', { ascending: false })
      .limit(10);

    // Generate response using Claude
    const response = await generateChatResponse(message, {
      userProfile: profile,
      recentJobs: jobs || [],
    });

    return NextResponse.json({
      success: true,
      response,
    });
  } catch (error: any) {
    console.error('Error in chat:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to process chat message' },
      { status: 500 }
    );
  }
}
