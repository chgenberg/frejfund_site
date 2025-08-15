export const aiConfig = {
  models: {
    deep: 'gpt-4-turbo-preview',
    final: 'gpt-4-turbo-preview',
    ultra: 'gpt-4o',
    general: 'gpt-4o-mini'
  },
  temperature: {
    default: 0.7,
    strict: 0.3,
    final: 0.6
  },
  maxTokens: 4000
}; 