export const aiConfig = {
  models: {
    deep: process.env.AI_MODEL_DEEP || 'gpt-4o-mini',
    final: process.env.AI_MODEL_FINAL || 'gpt-4o-mini',
    ultra: process.env.AI_MODEL_ULTRA || 'gpt-4o',
    general: process.env.AI_MODEL_GENERAL || 'gpt-4o-mini'
  },
  temperature: {
    default: 0.7,
    strict: 0.3,
    final: 0.6
  },
  maxTokens: Number(process.env.AI_MAX_TOKENS || 8000)
}; 