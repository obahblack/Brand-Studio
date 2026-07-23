import OpenAI from 'openai'

export const openai = new OpenAI({
  apiKey: process.env.ZEN_API_KEY,
  baseURL: 'https://opencode.ai/zen/v1',
  timeout: 120000,
  maxRetries: 0,
})
