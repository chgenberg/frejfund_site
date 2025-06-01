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
              scoreExplanation: "Din affärsplan är mycket lovande och redo för investerare.",
              logoUrl: "https://placehold.co/200x80?text=LOGO",
              date: new Date().toLocaleDateString('sv-SE'),
              sections: [
                { title: "Sammanfattning", content: "Detta är en fiktiv sammanfattning av affärsplanen." },
                { title: "Marknad", content: "Marknaden är stor och växande." },
                { title: "Team", content: "Teamet består av erfarna entreprenörer." }
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
              a.download = 'demo-affarsanalys.pdf';
              document.body.appendChild(a);
              a.click();
              window.URL.revokeObjectURL(url);
              document.body.removeChild(a);
            } else {
              alert('Kunde inte generera demo-PDF.');
            }
          }}
        />
      )}
    </div>
  );
} 