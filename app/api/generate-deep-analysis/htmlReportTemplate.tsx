import React from 'react';

interface Section {
  title: string;
  content: string;
}

interface ReportProps {
  companyName: string;
  score: number;
  scoreExplanation: string;
  logoUrl?: string;
  date: string;
  sections: Section[];
}

export default function HtmlReportTemplate({ companyName, score, scoreExplanation, logoUrl, date, sections }: ReportProps) {
  return (
    <html lang="sv">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet" />
        <title>Affärsanalysrapport</title>
      </head>
      <body className="bg-gray-50 text-[#16475b] font-sans">
        <div className="max-w-3xl mx-auto bg-white rounded-3xl shadow-xl p-10 mt-10 mb-10">
          <div className="flex flex-col items-center mb-8">
            {logoUrl && <img src={logoUrl} alt="Logo" className="h-20 mb-4" />}
            <h1 className="text-4xl font-extrabold tracking-tight mb-2">Affärsanalys</h1>
            <div className="text-2xl font-semibold mb-1">{companyName}</div>
            <div className="text-gray-500 mb-2">{date}</div>
            <div className="flex flex-col items-center my-4">
              <div className="w-32 h-32 rounded-full border-8 border-blue-300 flex items-center justify-center text-5xl font-bold bg-blue-50 mb-2">
                {score}
              </div>
              <div className="text-lg font-medium text-center mt-2">{scoreExplanation}</div>
            </div>
          </div>
          <hr className="my-8 border-blue-200" />
          <div className="space-y-10">
            {sections.map((section, i) => (
              <div key={i}>
                <h2 className="text-2xl font-bold mb-3 text-blue-800">{section.title}</h2>
                <div className="prose prose-blue max-w-none whitespace-pre-line">{section.content}</div>
              </div>
            ))}
          </div>
          <footer className="mt-16 pt-8 border-t border-blue-100 text-center text-xs text-gray-400">
            Genererad av FrejFund • {date}
          </footer>
        </div>
      </body>
    </html>
  );
} 