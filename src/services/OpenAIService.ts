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

  async generateImageAnalysisFromURL(
    imgUrl: string,
    userPrompt: string,
    model = 'gpt-4o',
    maxTokens = 700
  ): Promise<string> {
    if (!imgUrl.startsWith('http')) {
      throw new Error('Invalid image URL');
    }

    const systemMessage = `
  You are a professional product photography consultant.
  You specialize in optimizing product listings on platforms like Etsy, Amazon, and Shopify.
  Your job is to analyze product photos and offer actionable visual improvements.
  Be objective, clear, and commercially focused.
    `.trim();

    const userMessage: any = [
      {
        type: 'text',
        content: `
  Here is a product image for visual analysis.

  Please examine the photo in terms of:
  - Clarity, lighting, focus
  - Background quality (white, lifestyle, distracting, etc.)
  - Cropping and composition
  - Emotional appeal and storytelling
  - Visual appeal to online shoppers

  ${userPrompt}

  Then give 3 practical recommendations to improve this image for an e-commerce listing.
        `.trim()
      },
      {
        type: 'image_url',
        image_url: {
          url: imgUrl
        }
      }
    ];

    try {
      const response = await this.client.chat.completions.create({
        model,
        messages: [
          { role: 'system', content: systemMessage },
          {
      role: 'user',
      content: [
        {
          type: 'text',
          text: `
          Here is a product image for visual analysis.

          Please examine the photo in terms of:
          - Clarity, lighting, focus
          - Background quality (white, lifestyle, distracting, etc.)
          - Cropping and composition
          - Emotional appeal and storytelling
          - Visual appeal to online shoppers

          ${userPrompt}

          Then give 3 practical recommendations to improve this image for an e-commerce listing.
                    `.trim()
                  },
                  {
                    type: 'image_url',
                    image_url: {
                      url: imgUrl
                    }
                  }
                ]
              }
            ],
            temperature: 0.5,
            max_tokens: maxTokens
          });

      return response.choices[0]?.message?.content || 'No analysis provided.';
    } catch (error: any) {
      console.error('OpenAI image analysis error:', error.message);
      throw new Error('Failed to get image analysis');
    }
  }

  
}
