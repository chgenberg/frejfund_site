import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import axios from 'axios';
import { JSDOM } from 'jsdom';

export async function POST(request: Request) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json({ error: 'OpenAI API key not configured' }, { status: 500 });
    }

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const { profiles } = await request.json();
    
    if (!profiles) {
      return NextResponse.json({ error: 'LinkedIn profiles are required' }, { status: 400 });
    }

    console.log('🔍 Scraping LinkedIn profiles:', profiles);

    // Parse comma-separated LinkedIn URLs
    const profileUrls = profiles
      .split(',')
      .map((url: string) => url.trim())
      .filter((url: string) => url.length > 0)
      .map((url: string) => {
        // Normalize LinkedIn URLs
        if (!url.startsWith('http')) {
          if (url.startsWith('linkedin.com') || url.startsWith('www.linkedin.com')) {
            return `https://${url}`;
          } else if (url.includes('linkedin.com')) {
            return `https://${url}`;
          } else {
            return `https://linkedin.com/in/${url}`;
          }
        }
        return url;
      });

    const profileData = [];

    for (const profileUrl of profileUrls) {
      try {
        console.log('📱 Scraping LinkedIn profile:', profileUrl);
        
        // Note: LinkedIn heavily protects against scraping
        // In production, you'd want to use LinkedIn API or professional services
        // For now, we'll simulate with a basic attempt and fallback to AI analysis
        
        let scrapedContent = '';
        
        try {
          const response = await axios.get(profileUrl, {
            headers: {
              'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
              'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
              'Accept-Language': 'en-US,en;q=0.5',
              'Accept-Encoding': 'gzip, deflate',
              'Connection': 'keep-alive',
              'Upgrade-Insecure-Requests': '1',
            },
            timeout: 10000,
            maxRedirects: 3
          });

          // Clean HTML and extract basic info
          const cleanedHtml = response.data
            .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
            .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
            .replace(/<[^>]*>/g, ' ')
            .replace(/\s+/g, ' ')
            .trim();

          scrapedContent = cleanedHtml.substring(0, 2000); // Limit content
          
        } catch (scrapingError) {
          console.log('⚠️ Direct scraping failed, using URL analysis:', scrapingError instanceof Error ? scrapingError.message : 'Unknown error');
          // If direct scraping fails, we'll analyze what we can from the URL
          scrapedContent = `LinkedIn profile URL: ${profileUrl}`;
        }

        // Use AI to extract and structure profile information
        const profileAnalysis = await openai.chat.completions.create({
          model: "gpt-4o-mini", // Using cheaper model for LinkedIn analysis
          messages: [
            {
              role: "system",
              content: `You are an expert at analyzing LinkedIn profiles for investment due diligence. 
              
              Extract and structure the following information if available:
              - Full name and current title
              - Current company and role
              - Previous work experience (last 3-5 positions)
              - Education background
              - Skills and expertise areas
              - Industry experience
              - Leadership experience
              - Entrepreneurial background
              - Notable achievements or recognitions
              
              Return ONLY a JSON object with this structure:
              {
                "name": "string",
                "currentTitle": "string", 
                "currentCompany": "string",
                "experience": ["list of previous roles/companies"],
                "education": ["education background"],
                "skills": ["key skills/expertise"],
                "industry": "primary industry",
                "entrepreneurialBackground": "description",
                "achievements": ["notable achievements"],
                "profileUrl": "original URL"
              }
              
              If information is not available, use null for that field.`
            },
            {
              role: "user", 
              content: `Analyze this LinkedIn profile content and URL: ${profileUrl}\n\nContent: ${scrapedContent}`
            }
          ],
          temperature: 0.3,
          response_format: { type: "json_object" }
        });

        const profileInfo = JSON.parse(profileAnalysis.choices[0].message.content || '{}');
        profileInfo.profileUrl = profileUrl;
        profileData.push(profileInfo);

      } catch (error) {
        console.error('Error processing LinkedIn profile:', profileUrl, error);
        // Add minimal info even if scraping fails
        profileData.push({
          name: null,
          currentTitle: null,
          currentCompany: null,
          experience: null,
          education: null,
          skills: null,
          industry: null,
          entrepreneurialBackground: null,
          achievements: null,
          profileUrl: profileUrl,
          error: 'Failed to scrape profile'
        });
      }
    }

    console.log('✅ LinkedIn profiles processed successfully');

    return NextResponse.json({
      success: true,
      data: profileData,
      source: 'linkedin_analysis'
    });

  } catch (error) {
    console.error('Error in LinkedIn scraping:', error);
    return NextResponse.json(
      { error: 'Failed to scrape LinkedIn profiles', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
} 