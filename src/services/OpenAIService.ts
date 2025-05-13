import { OpenAI } from 'openai';

export class OpenAIService {
  private client: OpenAI;

  constructor(apiKey: string) {
    if (!apiKey) throw new Error('Missing OpenAI API key');
    this.client = new OpenAI({ apiKey });
  }

  async generateCompletion(
    prompt: string,
    systemMessage: string,
    maxTokens = 600,
    model = 'gpt-3.5-turbo'
  ): Promise<string> {
    try {
      const response = await this.client.chat.completions.create({
        model,
        messages: [
          { role: 'system', content: systemMessage },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
        max_tokens: maxTokens
      });

      return response.choices[0]?.message?.content || 'No response.';
    } catch (error: any) {
      console.error('OpenAI completion error:', error.message);
      throw new Error('Failed to get OpenAI completion');
    }
  }
}
