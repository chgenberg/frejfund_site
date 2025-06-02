import { NextResponse } from 'next/server';
import { saveCustomerData } from '@/app/utils/fileSystem';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    // Om email finns, spara som kunddata
    if (data.email) {
      const filepath = await saveCustomerData(data.email, data);
      
      return NextResponse.json({ 
        success: true, 
        message: 'Submission saved successfully',
        filepath 
      });
    }
    
    // Om ingen email, returnera framgång ändå
    return NextResponse.json({ 
      success: true, 
      message: 'Submission processed (no email provided)'
    });
  } catch (error) {
    console.error('Error saving submission:', error);
    return NextResponse.json(
      { error: 'Failed to save submission' },
      { status: 500 }
    );
  }
} 