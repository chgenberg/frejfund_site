export const aiConfig = {
  models: {
    deep: process.env.AI_MODEL_DEEP || 'gpt-5-mini',
    final: process.env.AI_MODEL_FINAL || 'gpt-5',
    ultra: process.env.AI_MODEL_ULTRA || 'gpt-5',
    general: process.env.AI_MODEL_GENERAL || 'gpt-5-nano'
  },
  temperature: {
    default: 0.7,
    strict: 0.3,
    final: 0.5
  },
  // Ensure a safe numeric default even if env is missing/invalid
  maxTokens: (() => {
    const raw = process.env.AI_MAX_TOKENS;
    const parsed = raw && /^\d+$/.test(raw) ? parseInt(raw, 10) : undefined;
    const val = typeof parsed === 'number' && isFinite(parsed) && parsed > 0 ? parsed : 15000;
    return Math.min(32000, val);
  })()
}; 