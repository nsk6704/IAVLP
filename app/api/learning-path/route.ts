import { NextRequest, NextResponse } from 'next/server';

// Handle GET requests with topic as a query parameter
export async function GET(request: NextRequest) {
  try {
    // Get the topic from the query parameters
    const { searchParams } = new URL(request.url);
    const topic = searchParams.get('topic');
    
    // Ensure we have the required parameters
    if (!topic) {
      console.error('Missing required parameter: topic');
      return NextResponse.json(
        { error: 'Missing required parameter: topic' },
        { status: 400 }
      );
    }
    
    // Use the exact URL specified
    const url = `https://ae6d-35-223-227-18.ngrok-free.app/learning-path`;
    
    console.log(`Making direct POST request to: ${url} with topic: ${topic}`);
    
    // Make a direct POST request with JSON body
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ topic })
    });
    
    // Check the content type of the response
    const contentType = response.headers.get('content-type');
    console.log(`Response content type: ${contentType}`);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`API responded with status ${response.status}: ${errorText}`);
      throw new Error(`API responded with status ${response.status}`);
    }
    
    // For GET requests, we'll prioritize returning the raw response as-is
    // This works better for images and other binary content
    const buffer = await response.arrayBuffer();
    
    // Return the response with the original content type
    return new NextResponse(buffer, {
      headers: {
        'Content-Type': contentType || 'application/octet-stream',
        'Content-Disposition': 'inline',
      }
    });
  } catch (error) {
    console.error('Error in learning path API route (GET):', error);
    
    // Return a detailed error message
    return NextResponse.json(
      { 
        error: 'Failed to fetch learning path', 
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { topic } = body;
    
    // Ensure we have the required parameters
    if (!topic) {
      console.error('Missing required parameter: topic');
      return NextResponse.json(
        { error: 'Missing required parameter: topic' },
        { status: 400 }
      );
    }
    
    // Use the exact URL specified
    const url = 'https://ae6d-35-223-227-18.ngrok-free.app/learning-path';
    
    console.log(`Making direct POST request to: ${url}`);
    
    // Create the payload
    const payload = { topic };
    
    console.log('Request payload:', JSON.stringify(payload));
    
    // Make a direct POST request with the raw JSON payload
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });
    
    // Check the content type of the response
    const contentType = response.headers.get('content-type');
    console.log(`Response content type: ${contentType}`);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`API responded with status ${response.status}: ${errorText}`);
      throw new Error(`API responded with status ${response.status}`);
    }
    
    // Check if we received an image
    if (contentType && contentType.includes('image/')) {
      console.log(`Received image response: ${contentType}`);
      
      // Get the image data as an ArrayBuffer
      const imageBuffer = await response.arrayBuffer();
      
      // Return the image with the appropriate content type
      return new NextResponse(imageBuffer, {
        headers: {
          'Content-Type': contentType,
          'Content-Disposition': 'inline',
        }
      });
    }
    
    // Check if we received non-JSON and non-image content
    if (!contentType || !contentType.includes('application/json')) {
      const text = await response.text();
      console.error(`Received non-JSON, non-image response: ${contentType}`);
      console.error(`Response text (first 100 chars): ${text.substring(0, 100)}...`);
      
      // Return mock data instead
      return NextResponse.json([
        {
          title: `Introduction to ${topic}`,
          description: `Learn the fundamentals of ${topic} and understand its core concepts.`,
          resources: [
            `https://www.google.com/search?q=introduction+to+${encodeURIComponent(topic)}`,
            `https://www.youtube.com/results?search_query=introduction+to+${encodeURIComponent(topic)}`
          ],
          estimatedTimeMinutes: 60
        },
        {
          title: `${topic} Basic Principles`,
          description: `Understand the basic principles and techniques used in ${topic}.`,
          resources: [
            `https://www.google.com/search?q=${encodeURIComponent(topic)}+principles`,
            `https://www.youtube.com/results?search_query=${encodeURIComponent(topic)}+principles`
          ],
          estimatedTimeMinutes: 90
        },
        {
          title: `Advanced ${topic} Concepts`,
          description: `Dive deeper into advanced concepts and applications of ${topic}.`,
          resources: [
            `https://www.google.com/search?q=advanced+${encodeURIComponent(topic)}`,
            `https://www.youtube.com/results?search_query=advanced+${encodeURIComponent(topic)}`
          ],
          estimatedTimeMinutes: 120
        }
      ]);
    }
    
    try {
      const data = await response.json();
      return NextResponse.json(data);
    } catch (error) {
      console.error('Error parsing JSON response:', error);
      
      // Return mock data if JSON parsing fails
      return NextResponse.json([
        {
          title: `Introduction to ${topic}`,
          description: `Learn the fundamentals of ${topic} and understand its core concepts.`,
          resources: [
            `https://www.google.com/search?q=introduction+to+${encodeURIComponent(topic)}`,
            `https://www.youtube.com/results?search_query=introduction+to+${encodeURIComponent(topic)}`
          ],
          estimatedTimeMinutes: 60
        },
        {
          title: `${topic} Basic Principles`,
          description: `Understand the basic principles and techniques used in ${topic}.`,
          resources: [
            `https://www.google.com/search?q=${encodeURIComponent(topic)}+principles`,
            `https://www.youtube.com/results?search_query=${encodeURIComponent(topic)}+principles`
          ],
          estimatedTimeMinutes: 90
        },
        {
          title: `Advanced ${topic} Concepts`,
          description: `Dive deeper into advanced concepts and applications of ${topic}.`,
          resources: [
            `https://www.google.com/search?q=advanced+${encodeURIComponent(topic)}`,
            `https://www.youtube.com/results?search_query=advanced+${encodeURIComponent(topic)}`
          ],
          estimatedTimeMinutes: 120
        }
      ]);
    }
  } catch (error) {
    console.error('Error in learning path API route:', error);
    
    // Return a detailed error message
    return NextResponse.json(
      { 
        error: 'Failed to fetch learning path', 
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}
