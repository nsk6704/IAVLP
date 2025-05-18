import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { topic, current_score } = body;
    
    // Ensure we have the required parameters
    if (!topic) {
      console.error('Missing required parameter: topic');
      return NextResponse.json(
        { error: 'Missing required parameter: topic' },
        { status: 400 }
      );
    }
    
    // Use the exact URL specified
    const url = 'https://ae6d-35-223-227-18.ngrok-free.app/quiz';
    
    console.log(`Making direct POST request to: ${url}`);
    
    // Create the payload exactly as requested
    const payload = {
      topic,
      current_score: current_score ?? 0.5
    };
    
    console.log('Request payload:', JSON.stringify(payload));
    
    // Make a direct POST request with the raw JSON payload
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`API responded with status ${response.status}: ${errorText}`);
      throw new Error(`API responded with status ${response.status}`);
    }
    
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error in quiz API route:', error);
    
    // Return a detailed error message
    return NextResponse.json(
      { 
        error: 'Failed to fetch quiz questions', 
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}
