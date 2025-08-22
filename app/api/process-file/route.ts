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
    
    // Handle different file types with better error handling
    if (file.type === 'application/pdf') {
      try {
        // Dynamic import to avoid build issues
        const pdfParse = (await import('pdf-parse')).default;
        const pdfData = await pdfParse(buffer);
        content = pdfData.text;
      } catch (pdfError) {
        console.error('PDF parsing failed:', pdfError);
        // Fallback: return basic file info without content
        return NextResponse.json({
          success: true,
          fileName: file.name,
          content: `[PDF file uploaded: ${file.name} - content extraction failed, but file received successfully]`,
          type: file.type,
          warning: 'PDF content could not be extracted'
        });
      }
    } else if (file.type === 'text/plain') {
      content = buffer.toString('utf-8');
    } else if (file.type === 'application/msword' || file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      // For Word documents, we'll just extract basic text for now
      content = buffer.toString('utf-8');
    } else {
      // Unsupported file type - still accept but note it
      return NextResponse.json({
        success: true,
        fileName: file.name,
        content: `[File uploaded: ${file.name} - unsupported type ${file.type}]`,
        type: file.type,
        warning: 'File type not supported for content extraction'
      });
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
      { 
        error: 'Failed to process file', 
        details: error instanceof Error ? error.message : 'Unknown error',
        success: false 
      },
      { status: 500 }
    );
  }
} 