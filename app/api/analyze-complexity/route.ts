import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { code, language } = await request.json();
    
    if (!code || !language) {
      return NextResponse.json(
        { error: "Code and language are required" }, 
        { status: 400 }
      );
    }
    
    // Create prompt for code analysis
    const prompt = `
      Analyze the following ${language} code for time and space complexity.
      
      \`\`\`${language}
      ${code}
      \`\`\`
      
      Provide a JSON response with the following fields:
      - timeComplexity: The Big O notation for time complexity
      - spaceComplexity: The Big O notation for space complexity
      - explanation: A clear explanation of the complexity analysis
      - optimizationTips: An array of tips for potential optimizations
      - confidenceScore: A number between 0 and 1 indicating confidence in the analysis
      - detectedAlgorithm: The name of the detected algorithm, if applicable
    `;
    
    // Call Groq API
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: "llama3-70b-8192",
        messages: [
          {
            role: "system",
            content: "You are an expert algorithm analyst specializing in time and space complexity."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.2,
        max_tokens: 1024,
        response_format: { type: "json_object" }
      })
    });
    
    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Groq API error: ${error}`);
    }
    
    const data = await response.json();
    return NextResponse.json(JSON.parse(data.choices[0].message.content));
    
  } catch (error) {
    console.error('Error analyzing code:', error);
    return NextResponse.json(
      { error: "Error analyzing code complexity" }, 
      { status: 500 }
    );
  }
}