const fs = require('fs');
const path = require('path');

async function main() {
  const pdfPath = path.join(process.cwd(), 'public', 'Angelhive.pdf');
  if (!fs.existsSync(pdfPath)) {
    console.error('PDF not found at:', pdfPath);
    process.exit(1);
  }
  let pdfParse;
  try {
    pdfParse = require('pdf-parse');
  } catch (e) {
    console.error('pdf-parse not installed. Run npm i pdf-parse');
    process.exit(1);
  }

  const data = fs.readFileSync(pdfPath);
  const parsed = await pdfParse(data);
  const text = (parsed && parsed.text) ? parsed.text : '';

  function looksLikeHeading(line) {
    const trimmed = line.trim();
    if (trimmed.length < 5 || trimmed.length > 140) return false;
    const bullet = /^[-•–\u2022\u2013]/.test(trimmed);
    const numbered = /^(\d+\.|\d+\)|[IVX]+\.|[A-Z]\.)\s/.test(trimmed);
    const manyCaps = /[A-Z]/.test(trimmed) && (trimmed.replace(/[^A-Z]/g, '').length / Math.max(1, trimmed.replace(/[^A-Za-z]/g, '').length)) > 0.6;
    const keywords = /(principle|framework|pillar|metric|checklist|criterion|criteria|score|step|stage|goal|milestone|validation|traction|unit economics|go-to-market|funding|risk|team|market|moat|competition|valuation|diligence|pricing|cohort|retention|churn|cac|ltv|payback|gross margin|expansion|arpu|mrr|sales cycle|pipeline)/i.test(trimmed);
    return bullet || numbered || manyCaps || keywords;
  }

  function dedupeKeepOrder(lines) {
    const seen = new Set();
    const out = [];
    for (const l of lines) {
      const k = l.trim().toLowerCase();
      if (k && !seen.has(k)) {
        seen.add(k);
        out.push(l.trim());
      }
    }
    return out;
  }

  const lines = text.split(/\r?\n/);
  const salient = lines.filter(looksLikeHeading);
  let condensed = dedupeKeepOrder(salient).slice(0, 500);

  // Fallback: if too few lines, include trimmed full text chunk
  if (condensed.length < 30) {
    const chunk = text.slice(0, 20000); // ~20k chars
    condensed = chunk.split(/\r?\n/).slice(0, 1000);
  }

  let guidelines = 'Investor framework key points (condensed/captured):\n';
  for (const l of condensed) {
    const entry = l.replace(/^\s*[-•–\u2022\u2013]\s*/, '').trim();
    if (entry) guidelines += `- ${entry}\n`;
  }

  // Clamp to ~6000 chars for prompt safety
  if (guidelines.length > 6000) {
    guidelines = guidelines.slice(0, 6000);
  }

  const outDir = path.join(process.cwd(), 'app', 'api', '_utils');
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
  const outFile = path.join(outDir, 'angelhive_static.ts');

  const safe = guidelines.replace(/`/g, '\\`');

  const ts = `export const ANGELHIVE_GUIDELINES = ` + '`' + safe + '`' + `;\n`;

  fs.writeFileSync(outFile, ts, 'utf8');
  console.log('Wrote static guidelines to:', outFile, `(length=${guidelines.length})`);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
}); 