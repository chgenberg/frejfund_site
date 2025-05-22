import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  try {
    const { product, targetAudience, value, ask } = await request.json();

    const prompt = `Du är världens bästa pitch-coach. Skapa en EPISK 30-sekunders pitch för följande produkt:

Produkt: ${product}
Målgrupp: ${targetAudience}
Värdeerbjudande: ${value}
${ask ? `Ask: ${ask}` : ''}

Regler:
- Max 80 ord
- Använd storytelling och emotionell anknytning
- Inkludera en "hook" i början
- Avsluta med ett tydligt call-to-action
- Använd korta, kraftfulla meningar
- Var specifik och konkret
- Undvik floskler och buzzwords
- Formatera texten med radbrytningar för bättre läsbarhet

Skapa en pitch som får lyssnaren att vilja agera NU.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "Du är världens bästa pitch-coach med flera decenniers erfarenhet av att hjälpa startups att lyckas. Du har en unik förmåga att förvandla komplexa idéer till fängslande berättelser som får investerare att vilja investera och kunder att vilja köpa."
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