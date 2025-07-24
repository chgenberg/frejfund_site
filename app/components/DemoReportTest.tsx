"use client";
import React, { useState } from 'react';
import ReportDesignWizard from './ReportDesignWizard';

export default function DemoReportTest() {
  const [showWizard, setShowWizard] = useState(false);

  return (
    <div>
      <button
        onClick={() => setShowWizard(true)}
        className="px-6 py-3 bg-blue-600 text-white rounded-xl"
      >
        Testa PDF-design (Demo)
      </button>
      {showWizard && (
        <ReportDesignWizard
          onConfirm={async (design) => {
            setShowWizard(false);
            // Dummy/fiktiva data
            const dummyData = {
              companyName: "Fiktivt AB",
              score: 88,
              scoreExplanation: "Your business plan is very promising and ready for investors.",
              logoUrl: "https://placehold.co/200x80?text=LOGO",
              date: new Date().toLocaleDateString('sv-SE'),
              sections: [
                { title: "Summary", content: "This is a fictional summary of the business plan." },
                { title: "Market", content: "The market is large and growing." },
                { title: "Team", content: "The team consists of experienced entrepreneurs." }
              ],
              design,
            };
            const response = await fetch('/api/generate-deep-analysis/generateHtmlPdf', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(dummyData)
            });
            if (response.ok) {
              const blob = await response.blob();
              const url = window.URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = 'demo-business-analysis.pdf';
              document.body.appendChild(a);
              a.click();
              window.URL.revokeObjectURL(url);
              document.body.removeChild(a);
            } else {
              alert('Could not generate demo PDF.');
            }
          }}
        />
      )}
    </div>
  );
} 