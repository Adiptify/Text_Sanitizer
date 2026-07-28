import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '../../../../lib/mongodb';
import { GuardrailModel } from '../../../../models/Guardrail';

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const conn = await connectToDatabase();

    if (!conn) {
      return NextResponse.json({ success: true, message: 'Deleted from memory' });
    }

    await GuardrailModel.findByIdAndDelete(id);
    return NextResponse.json({ success: true, message: 'Guardrail deleted successfully' });
  } catch (error) {
    console.error('Error deleting guardrail:', error);
    return NextResponse.json({ error: 'Failed to delete guardrail' }, { status: 500 });
  }
}
