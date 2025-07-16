import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const { questionId, questionText, currentAnswer, businessDomain, websiteUrl, scrapedData } = await req.json();

  const apiKey = process.env.OPENAI_API_KEY;
  
  // Om vi har skrapad data, använd den för att generera bättre förslag
  if (scrapedData && questionId) {
    let contextualPrompt = '';
    
    // Bygg en kontext från skrapad data
    const context = {
      company: scrapedData.company_name || 'Företaget',
      industry: scrapedData.industry || 'Ej specificerat',
      value: scrapedData.company_value || 'Ej specificerat',
      target: scrapedData.target_customer || 'Ej specificerat',
      competitors: scrapedData.competitors || 'Ej specificerat'
    };
    
    // Anpassa förslag baserat på frågan
    const questionSpecificPrompts = {
      'customer_problem': `Based on ${context.company} operating in ${context.industry} and offering: "${context.value}", generate a specific answer to the question "${questionText}". Focus on the exact problem their target audience (${context.target}) has.`,
      
      'problem_evidence': `For ${context.company} in ${context.industry}, provide concrete evidence or data points showing that the problem they solve really exists. Include statistics, studies or trends relevant to ${context.target}.`,
      
      'market_gap': `Analyze the market gap for ${context.company}. Given competitors like ${context.competitors}, what is the specific gap that ${context.company} fills in the market?`,
      
      'why_now': `Explain why the timing is right for ${context.company} in ${context.industry}. What technical, market or regulatory changes make now the right time?`,
      
      'unique_solution': `Based on ${context.company} competing with ${context.competitors}, what makes their solution unique or hard to copy? Focus on specific competitive advantages.`,
      
      'main_risks': `For a company like ${context.company} in ${context.industry}, identify the biggest risks and how they can be managed.`
    };
    
    contextualPrompt = questionSpecificPrompts[questionId as keyof typeof questionSpecificPrompts] || 
      `Based on the information about ${context.company}, generate a relevant answer to the question: "${questionText}"`;
    
    contextualPrompt += ` Answer in English with a concrete, specific response that is at least 100 words long.`;
    
    try {
      const openaiRes = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: 'gpt-4o',
          messages: [
            { role: 'system', content: 'You are an expert in business plans and company analysis. Provide ONLY concrete, specific answers directly without explanations about how you arrived at the answer. Answer briefly and concisely but informatively. No long explanations or pedagogical clarifications. Focus on value-creating insights relevant to investors.' },
            { role: 'user', content: contextualPrompt }
          ],
          max_tokens: 800,
          temperature: 0.7,
        }),
      });
      
      const data = await openaiRes.json();
      const suggestion = data.choices?.[0]?.message?.content || '';
      
      return NextResponse.json({ suggestion });
    } catch (error) {
      console.error('Error generating contextual suggestion:', error);
    }
  }
  
  // Fallback till original funktionalitet för följdfrågor
  const prompt = `Based on the question: '${questionText}', the answer: '${currentAnswer}', and the company's domain/description: '${businessDomain}', provide EXACTLY 2 smart follow-up questions or clarifications that are relevant to this company. Always use the complete answer exactly as it is, without shortening or using variables. If the answer is one word, use that word exactly in your follow-up questions. Answer in English and return only a JSON array with exactly 2 suggestions.`;

  let suggestions = [];
  try {
    const openaiRes = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          { role: 'system', content: 'You are an expert at coaching entrepreneurs.' },
          { role: 'user', content: prompt }
        ],
        max_tokens: 200,
        temperature: 0.3
      })
    });
    const data = await openaiRes.json();
    let text = data.choices?.[0]?.message?.content || '';
    if (text.startsWith('```json')) {
      text = text.replace(/^```json/, '').replace(/```$/, '').trim();
    }
    try {
      suggestions = JSON.parse(text);
      if (!Array.isArray(suggestions)) suggestions = [text];
      // Säkerställ att vi alltid har exakt 2 förslag
      if (suggestions.length > 2) suggestions = suggestions.slice(0, 2);
      while (suggestions.length < 2) suggestions.push('Inget ytterligare förslag tillgängligt.');
    } catch {}
  } catch {}

  return NextResponse.json({ suggestions });
} 