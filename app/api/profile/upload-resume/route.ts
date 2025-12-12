import { NextRequest, NextResponse } from 'next/server';
import { extractTextFromPDF } from '@/lib/pdf-parser';
import { extractResumeInfo } from '@/lib/claude';
import { generateProfileEmbedding } from '@/lib/embeddings';
import { supabase } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('resume') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    if (file.type !== 'application/pdf') {
      return NextResponse.json(
        { error: 'File must be a PDF' },
        { status: 400 }
      );
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Extract text from PDF
    const resumeText = await extractTextFromPDF(buffer);

    // Extract structured info using Claude
    const extractedInfo = await extractResumeInfo(resumeText);

    // Generate embedding for the profile
    const embedding = await generateProfileEmbedding({
      skills: extractedInfo.skills,
      experience_summary: extractedInfo.experience_summary,
      desired_titles: extractedInfo.titles,
    });

    // Get or create user (for MVP, we use the default user)
    const defaultUserId = '00000000-0000-0000-0000-000000000001';

    // Check if profile already exists
    const { data: existingProfile } = await supabase
      .from('user_profile')
      .select('id')
      .eq('user_id', defaultUserId)
      .single();

    const profileData = {
      user_id: defaultUserId,
      skills: extractedInfo.skills,
      experience_summary: extractedInfo.experience_summary,
      desired_titles: extractedInfo.titles,
      location: extractedInfo.location,
      remote_only: extractedInfo.remote_preference === 'remote',
      embedding: `[${embedding.join(',')}]`,
    };

    let result;
    if (existingProfile) {
      // Update existing profile
      const { data, error } = await (supabase
        .from('user_profile') as any)
        .update(profileData)
        .eq('id', (existingProfile as any).id)
        .select()
        .single();

      if (error) throw error;
      result = data;
    } else {
      // Create new profile
      const { data, error } = await (supabase
        .from('user_profile') as any)
        .insert(profileData)
        .select()
        .single();

      if (error) throw error;
      result = data;
    }

    return NextResponse.json({
      success: true,
      profile: {
        ...extractedInfo,
        industries: extractedInfo.industries,
      },
      profileId: result.id,
    });
  } catch (error: any) {
    console.error('Error processing resume:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to process resume' },
      { status: 500 }
    );
  }
}
