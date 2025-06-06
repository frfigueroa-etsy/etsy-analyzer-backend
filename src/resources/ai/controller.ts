import { Request, Response } from 'express';
import { OpenAIService } from '../../services/OpenAIService';
import { EtsyService } from '../../services/EtsyService';
import { RunwayService } from '../../services/RunwayService';

import { envs } from '../../configs/envs';

export class AIController{
    

    constructor(public openAIService:OpenAIService){}

    public test = async (req:Request, res:Response) : Promise<void> => {
        try {
            res.json({ result: 'test' });
          } catch (e: any) {
            res.status(500).json({ error: e.message });
          }
    }

    // ShopListing Analysis
    public analyzeSEO = async (req:Request, res:Response): Promise<void> => {
        const { prompt } = req.body;
        if (!prompt) {
          res.status(400).json({ error: 'Missing prompt' });
          return;
        }
        try {
            const response = await this.openAIService.generateCompletion(prompt, 'You are an expert in Etsy SEO. Analyze the following product and provide a SEO Score (0-100) and recommendations to improve its visibility on Etsy. Be clear and concise.`');
            res.json({ result: response });
          } catch (e: any) {
            res.status(500).json({ error: e.message });
          }
    }

    public benchmark = async (req:Request, res:Response) : Promise<void> => {
        const { products } = req.body;
        if (!products || !Array.isArray(products)) {
            res.status(400).json({ error: 'Invalid products' });
            return;
          }
          const prompt = `
            You are an expert in Etsy SEO. You will receive a list of products, each with a title, description, and tags.
  
            Create a proposusal for a new product based on the coincidences of the given products :
            - Evaluate their titles and descriptions SEO qualities and create a title and keywordd for the description.
            - Suggest 3–5 better tags if needed.
            
            Then provide a global summary:
            - Recommend a model product title combining the best elements.
            - Suggest trending keywords that are common or missing.
            - Recommend a set of ideal tags for Etsy ranking.` + 
            products.map(
                (p: any, i: number) => 
                    `Product ${i + 1}:\nTitle: ${p.title}\nDescription: ${p.description}\nTags: ${p.tags?.join(', ')}`
            )
            .join('\n\n');
        try {
            const result = await this.openAIService.generateCompletion(prompt, 'You are a helpful and concise assistant specialized in Etsy SEO optimization');
            res.json({ result });
          } catch (e: any) {
            res.status(500).json({ error: e.message });
          }
    }

    public analyzeSEOFromListing = async (req:Request, res:Response) : Promise<void> => {
      const { listingId } = req.body;      
      if (!listingId) {
        res.status(400).json({ error: 'Missing listingId' });
        return;
      }
      const etsyService = new EtsyService(envs.ETSY_API_KEY);


      try {
        const listingData = await etsyService.getListing(listingId);
        const prompt = `
        Analyze and give a score from 0 to 100 of this Etsy product from an SEO perspective:
        
        Title: "${listingData.title}"
        Description: "${listingData.description || ''}"
        Tags: ${listingData.tags?.slice(0, 5).join(', ')}
        
        Evaluate whether the title contains relevant keywords, if the description is engaging and uses helpful keywords, and whether the tags help improve visibility. Suggest improvements.
            `;

        const response = await this.openAIService.generateCompletion(prompt, 'You are an expert in Etsy SEO. Analyze the following product and provide a SEO Score (0-100) and recommendations to improve its visibility on Etsy. Be clear and concise.`');
        res.json({ result: response });

        
      } catch (e: any) {
        console.log(e)
        res.status(500).json({ error: e.message });
      }
    }

    // Shop Analysis
    public commercialAppeal =  async (req:Request, res:Response) : Promise<void> => {
      const { shop_name, title, announcement, sale_message, digital_sale_message } = req.body;

      if (!shop_name || !title || !announcement) {
        res.status(400).json({ error: 'Missing required shop fields: shop_name, title, or announcement' });
        return;
      }
  
      const prompt = `
  You are a branding and marketing expert specializing in online shops on Etsy.
  
  You will receive public-facing information from a shop, and your goal is to analyze the shop’s **commercial appeal** to customers.
  
  Evaluate the following:
  - Is the shop name attractive and memorable?
  - Is the title of the shop descriptive and compelling?
  - Does the announcement communicate a clear and unique value proposition?
  - Are the sale and digital sale messages persuasive?
  - What first impression does this shop give to a potential buyer?
  
  Then provide:
  1. A score from 0 to 100 for the shop's overall commercial appeal.
  2. A summary of strengths.
  3. A list of improvements or suggestions to enhance its attractiveness.
  4. If applicable, suggest a better shop name or message copy.
  
  Shop Data:
  - Shop Name: ${shop_name}
  - Title: ${title}
  - Announcement: ${announcement}
  - Sale Message: ${sale_message || 'N/A'}
  - Digital Sale Message: ${digital_sale_message || 'N/A'}
  `;
  
      try {
        const result = await this.openAIService.generateCompletion(
          prompt,
          'You are a branding and marketing consultant for Etsy shops.'
        );
        res.json({ result });
      } catch (e: any) {
        res.status(500).json({ error: e.message });
      }
    }

    public customerExperience = async (req: Request, res: Response): Promise<void> => {
      const { review_count, review_average, accepts_custom_requests } = req.body;
  
      if (
        typeof review_count !== 'number' ||
        typeof review_average !== 'number' ||
        typeof accepts_custom_requests !== 'boolean'
      ) {
        res.status(400).json({ error: 'Missing or invalid input fields' });
        return;
      }
  
      const prompt = `
  You are a customer experience specialist analyzing an Etsy shop.
  
  Evaluate the shop based on the following customer experience metrics:
  - Number of Reviews: ${review_count}
  - Average Review Score: ${review_average}
  - Accepts Custom Requests: ${accepts_custom_requests ? 'Yes' : 'No'}
  
  Please provide:
  1. A summary of how customers might perceive this shop based on the given data.
  2. Suggestions to improve the customer experience and build trust.
  3. If applicable, highlight whether accepting custom requests is a competitive advantage.
  4. Provide a rating (1–10) for overall customer experience performance.`.trim();
  
      try {
        const result = await this.openAIService.generateCompletion(
          prompt,
          'You are a helpful and concise assistant specialized in customer satisfaction on Etsy'
        );
  
        res.json({ result });
      } catch (e: any) {
        res.status(500).json({ error: e.message });
      }
    }

    public listingConversion = async (req: Request, res: Response): Promise<void> => {
      const { listing_active_count, digital_listing_count, transaction_sold_count } = req.body;
  
      if (
        listing_active_count === undefined ||
        digital_listing_count === undefined ||
        transaction_sold_count === undefined
      ) {
        res.status(400).json({ error: 'Missing required fields' });
        return;
      }
  
      const prompt = `
  You are an expert in Etsy shop performance analysis.
  
  Evaluate the shop's listing conversion potential based on the following metrics:
  - Total active listings: ${listing_active_count}
  - Digital listings: ${digital_listing_count}
  - Total transactions (products sold): ${transaction_sold_count}
  
  Based on this data, provide insights on:
  - Whether the shop is effectively converting listings into sales.
  - If the ratio of digital listings might influence conversions.
  - Recommendations to improve overall conversion rate.
  `;
  
      try {
        const result = await this.openAIService.generateCompletion(
          prompt,
          'You are a helpful assistant and Etsy strategy expert focused on conversion optimization.'
        );
        res.json({ result });
      } catch (e: any) {
        res.status(500).json({ error: e.message });
      }
    }

    public professionalBenchmark = async (req: Request, res: Response): Promise<void> => {
      const {
        is_etsy_payments_onboarded,
        is_using_structured_policies,
        has_onboarded_structured_policies
      } = req.body;
  
      if (
        typeof is_etsy_payments_onboarded !== 'boolean' ||
        typeof is_using_structured_policies !== 'boolean' ||
        typeof has_onboarded_structured_policies !== 'boolean'
      ) {
        res.status(400).json({ error: 'Missing or invalid fields in request body.' });
        return;
      }
  
      const prompt = `
  You are an expert in ecommerce best practices, specializing in Etsy shop optimization.
  
  You will evaluate a shop based on its current professional features:
  
  - Etsy Payments Onboarded: ${is_etsy_payments_onboarded ? 'Yes' : 'No'}
  - Using Structured Policies: ${is_using_structured_policies ? 'Yes' : 'No'}
  - Onboarded Structured Policies: ${has_onboarded_structured_policies ? 'Yes' : 'No'}
  
  Based on this data, respond with:
  
  1. A short assessment of how professionally the shop is perceived by potential buyers.
  2. A list of missing professional features (if any).
  3. Recommendations to improve trust and perceived professionalism.
  `;
  
      try {
        const result = await this.openAIService.generateCompletion(
          prompt,
          'You are a concise assistant that evaluates professional readiness of Etsy shops.'
        );
        res.json({ result });
      } catch (e: any) {
        res.status(500).json({ error: e.message });
      }
    }


    // Reviews

    public analyzeListingReviews = async (req: Request, res: Response): Promise<void> => {
      const { reviews } = req.body;
    
      if (!reviews || !Array.isArray(reviews)) {
        res.status(400).json({ error: 'Invalid reviews' });
        return;
      }
    
      const prompt = `
    You are a customer satisfaction expert specialized in analyzing product reviews from Etsy.
    
    You will receive a list of customer reviews for a product, including their rating (from 1 to 5 stars), the written review, and language information.
    
    Your task:
    - Detect common pain points or complaints mentioned.
    - Highlight what customers appreciate the most.
    - Determine if language or cultural patterns are relevant.
    - Identify improvement opportunities based on real feedback.
    - Provide a concise summary that helps sellers improve their product, communication, or service.
    
    Here are the reviews:
    ${reviews.map((r, i) => {
      const date = new Date((r.created_timestamp || r.create_timestamp) * 1000).toISOString().split('T')[0];
      return `Review ${i + 1}:
    Rating: ${r.rating} / 5
    Language: ${r.language}
    Date: ${date}
    Text: ${r.review}`;
    }).join('\n\n')}
      `.trim();
    
      try {
        const result = await this.openAIService.generateCompletion(
          prompt,
          'You are a helpful assistant and expert in customer satisfaction and product feedback analysis.'
        );
        res.json({ result });
      } catch (e: any) {
        res.status(500).json({ error: e.message });
      }
    }

    public analyzeShopReviews = async (req: Request, res: Response): Promise<void> => {
      const { reviews } = req.body;
    
      if (!reviews || !Array.isArray(reviews)) {
        res.status(400).json({ error: 'Invalid reviews' });
        return;
      }
    
      const prompt = `
    You are a customer satisfaction expert specialized in analyzing Etsy shop reviews.
    
    You will receive a list of customer reviews for a shop, including their rating (from 1 to 5 stars), the written review, and language information.
    
    Your task:
    - Detect recurring complaints or service issues.
    - Highlight what aspects of the shop are most valued by customers (e.g. fast delivery, packaging, communication).
    - Evaluate if the feedback reveals strengths or weaknesses in shop policies or customer support.
    - Identify opportunities for improving the customer experience and brand trust.
    - Provide a short, clear summary that helps the seller improve their operations, service, or communication strategy.
    
    Here are the reviews:
    ${reviews.map((r, i) => {
      const date = new Date((r.created_timestamp || r.create_timestamp) * 1000).toISOString().split('T')[0];
      return `Review ${i + 1}:
    Rating: ${r.rating} / 5
    Language: ${r.language}
    Date: ${date}
    Text: ${r.review}`;
    }).join('\n\n')}
      `.trim();
    
      try {
        const result = await this.openAIService.generateCompletion(
          prompt,
          'You are a helpful assistant and expert in shop-level customer satisfaction analysis.'
        );
        res.json({ result });
      } catch (e: any) {
        res.status(500).json({ error: e.message });
      }
    }

    // Media
    public analyzeImage = async (req:Request, res:Response): Promise<void> => {
        const { imgUrl } = req.body;
        if (!imgUrl) {
            res.status(400).json({ error: 'Invalid image' });
            return;
          }
          const prompt = `
          Evaluate if the image could be improved by showing the product in use by a human model.
          Recommend if a white background or lifestyle background would perform better.
          `;

        try {
            const result = await this.openAIService.generateImageAnalysisFromURL(imgUrl, prompt);
            res.json({ result });
          } catch (e: any) {
            res.status(500).json({ error: e.message });
          }
    }
    // Create video 
    public createVideo = async (req:Request, res:Response): Promise<void> => {
      const { imgUrl, promptText } = req.body;

      if (!imgUrl || typeof imgUrl !== 'string') {
        res.status(400).json({ error: 'Invalid or missing image URL' });
        return;
      }
      const runwayService = new RunwayService();


      try {
        // Paso 1: Create task
        const createTask = await runwayService.createVideoFromImage({
          promptImage: imgUrl,
          promptText: promptText || 'Create a dynamic promotional video for this product.',
          ratio: '1280:720',
          duration: 5
        });

        const taskId = createTask.id;

        // Paso 2: Wait until complete 
        const completedTask = await runwayService.waitForCompletion(taskId);

        if (completedTask.status === 'SUCCEEDED') {
          res.json(completedTask);
        } else {
          res.status(500).json({
            error: 'Video generation failed',
            task: completedTask,
          });
        }
      } catch (err: any) {
        console.error('RunwayML video generation error:', err.message);
        res.status(500).json({ error: 'Unexpected error during video generation' });
      }
    };
}