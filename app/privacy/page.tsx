import React from 'react';

export default function PrivacyPage() {
  return (
    <div className="max-w-2xl mx-auto p-8 text-[#16475b]">
      <h1 className="text-3xl font-bold mb-6">Integritetspolicy</h1>
      {/* ...ev. annan policytext... */}
      <h2 className="text-2xl font-bold mt-8 mb-4">Hur vi hanterar dina uppgifter</h2>
      <p className="mb-4">
        När du fyller i affärsplanformuläret på FrejFund sparas all information du lämnar i en separat textfil på vår server.<br />
        Vi hanterar dina uppgifter enligt GDPR och delar aldrig vidare din information till tredje part utan ditt uttryckliga samtycke.
      </p>
      <p className="mb-4">
        Om du får en hög poäng (över 80 av 100) i vår analys kan du välja att vi förmedlar din information vidare till investerare. Detta sker <b>endast</b> om du aktivt godkänner det i samband med att du får ditt resultat.
      </p>
      <p className="mb-4">
        Du kan när som helst kontakta oss för att få din information raderad.
      </p>
      <p className="mb-4">
        Kontakt: <a href="mailto:info@frejfund.se" className="underline">info@frejfund.se</a>
      </p>
      {/* ...ev. annan policytext... */}
    </div>
  );
} 