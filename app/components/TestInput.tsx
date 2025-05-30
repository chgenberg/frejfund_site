import React, { useState } from 'react';

export default function TestInput() {
  const [answers, setAnswers] = useState<{ [key: string]: string }>({ company_value: '' });

  return (
    <div style={{ padding: 40 }}>
      <textarea
        value={answers.company_value}
        onChange={e => {
          console.log('onChange', e.target.value);
          setAnswers(prev => ({ ...prev, company_value: e.target.value }));
        }}
        placeholder="Skriv här"
        style={{ width: 400, height: 100, fontSize: 18 }}
      />
      <div style={{ marginTop: 20 }}>Svar: {answers.company_value}</div>
    </div>
  );
} 