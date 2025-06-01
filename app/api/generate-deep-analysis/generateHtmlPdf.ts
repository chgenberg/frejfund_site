import { NextRequest, NextResponse } from 'next/server';
import puppeteer from 'puppeteer';
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import HtmlReportTemplate from './htmlReportTemplate';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { companyName, score, scoreExplanation, logoUrl, date, sections, design } = body;
    // design: { primary, secondary, accent, font: { name, fontFamily, google } }

    // Dynamiskt skapa Google Fonts-länk
    const googleFontLink = design?.font?.google
      ? `<link href="https://fonts.googleapis.com/css2?family=${design.font.google}&display=swap" rel="stylesheet">`
      : '';

    // Rendera HTML med valda färger och font
    const html = `
      <!DOCTYPE html>
      <html lang="sv">
        <head>
          <meta charSet="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet" />
          ${googleFontLink}
          <title>Affärsanalysrapport</title>
          <style>
            body { color: ${design.primary}; font-family: ${design.font.fontFamily}; }
            .primary { color: ${design.primary}; }
            .secondary { color: ${design.secondary}; }
            .accent-bg { background: ${design.accent}; }
            .score-circle { border-color: ${design.secondary}; background: ${design.accent}; color: ${design.primary}; }
            .section-title { color: ${design.secondary}; }
          </style>
        </head>
        <body class="bg-gray-50">
          <div class="max-w-3xl mx-auto bg-white rounded-3xl shadow-xl p-10 mt-10 mb-10">
            <div class="flex flex-col items-center mb-8">
              ${logoUrl ? `<img src="${logoUrl}" alt="Logo" class="h-20 mb-4" />` : ''}
              <h1 class="text-4xl font-extrabold tracking-tight mb-2 primary">Affärsanalys</h1>
              <div class="text-2xl font-semibold mb-1">${companyName}</div>
              <div class="text-gray-500 mb-2">${date}</div>
              <div class="flex flex-col items-center my-4">
                <div class="w-32 h-32 rounded-full border-8 flex items-center justify-center text-5xl font-bold mb-2 score-circle" style="border-color:${design.secondary};background:${design.accent};color:${design.primary}">${score}</div>
                <div class="text-lg font-medium text-center mt-2 primary">${scoreExplanation}</div>
              </div>
            </div>
            <hr class="my-8" style="border-color:${design.secondary}" />
            <div class="space-y-10">
              ${sections.map((section: any) => `
                <div>
                  <h2 class="text-2xl font-bold mb-3 section-title">${section.title}</h2>
                  <div class="prose prose-blue max-w-none whitespace-pre-line">${section.content}</div>
                </div>
              `).join('')}
            </div>
            <footer class="mt-16 pt-8 border-t text-center text-xs text-gray-400" style="border-color:${design.secondary}">
              Genererad av FrejFund • ${date}
            </footer>
          </div>
        </body>
      </html>
    `;

    // Starta Puppeteer och generera PDF
    const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'networkidle0' });
    const pdfBuffer = await page.pdf({ format: 'A4', printBackground: true, margin: { top: 30, bottom: 30, left: 0, right: 0 } });
    await browser.close();

    return new NextResponse(pdfBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="affarsanalys-rapport.pdf"',
        'Content-Length': pdfBuffer.length.toString(),
      },
    });
  } catch (error) {
    console.error('Error generating HTML PDF:', error);
    return NextResponse.json({ error: 'Kunde inte generera PDF' }, { status: 500 });
  }
} 