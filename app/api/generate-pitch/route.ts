import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

export async function POST(request: NextRequest) {
  try {
    // Check for API key before instantiating OpenAI client
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json({ error: 'OpenAI API key not configured' }, { status: 500 });
    }

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const { answers } = await request.json();

    const prompt = `You are the world's best pitch coach. Create an EPIC 30-second pitch for the following product:

Product: ${answers.product}
Target audience: ${answers.targetAudience}
Value proposition: ${answers.value}
${answers.ask ? `Ask: ${answers.ask}` : ''}

Rules:
- Max 80 words
- Use storytelling and emotional connection
- Include a "hook" at the beginning
- End with a clear call-to-action
- Use short, powerful sentences
- Be specific and concrete
- Avoid clichés and buzzwords
- Format the text with line breaks for better readability

Create a pitch that makes the listener want to act NOW.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are the world's best pitch coach with decades of experience helping startups succeed. You have a unique ability to transform complex ideas into captivating stories that make investors want to invest and customers want to buy."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 200,
    });

    const pitch = completion.choices[0].message.content;

    return NextResponse.json({ pitch });
  } catch (error) {
    console.error('Error generating pitch:', error);
    return NextResponse.json(
      { error: 'Failed to generate pitch' },
      { status: 500 }
    );
  }
} 