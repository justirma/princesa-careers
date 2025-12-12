import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { application_id, status, notes } = body;

    if (!application_id || !status) {
      return NextResponse.json(
        { error: 'application_id and status are required' },
        { status: 400 }
      );
    }

    const validStatuses = ['saved', 'applied', 'interviewing', 'offer', 'rejected'];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { error: `Status must be one of: ${validStatuses.join(', ')}` },
        { status: 400 }
      );
    }

    const updateData: any = { status };
    if (notes !== undefined) {
      updateData.notes = notes;
    }

    const { data, error } = await supabase
      .from('applications')
      .update(updateData)
      .eq('id', application_id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({
      success: true,
      application: data,
    });
  } catch (error: any) {
    console.error('Error updating status:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update status' },
      { status: 500 }
    );
  }
}
