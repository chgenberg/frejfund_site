import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    let content = '';
    const buffer = Buffer.from(await file.arrayBuffer());
    
    // Handle different file types
    if (file.type === 'application/pdf') {
      // Dynamic import to avoid build issues
      const pdfParse = (await import('pdf-parse')).default;
      const pdfData = await pdfParse(buffer);
      content = pdfData.text;
    } else if (file.type === 'text/plain') {
      content = buffer.toString('utf-8');
    } else if (file.type === 'application/msword' || file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      // For Word documents, we'll just extract basic text for now
      // In production, you'd want to use a proper Word document parser
      content = buffer.toString('utf-8');
    }

    return NextResponse.json({
      success: true,
      fileName: file.name,
      content: content.substring(0, 10000), // Limit content length
      type: file.type
    });

  } catch (error) {
    console.error('Error processing file:', error);
    return NextResponse.json(
      { error: 'Failed to process file' },
      { status: 500 }
    );
  }
} 