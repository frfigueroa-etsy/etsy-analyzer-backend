import { Request, Response } from 'express';
import { OpenAIService } from '../../services/OpenAIService';
import { EtsyService } from '../../services/EtsyService';
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


    public analyzeSEO = async (req:Request, res:Response): Promise<void> => {
        const { prompt } = req.body;
        if (!prompt) {
          res.status(400).json({ error: 'Missing prompt' });
          return;
        }
        try {
            const response = await this.openAIService.generateCompletion(prompt, 'You are an expert in Etsy SEO.');
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
            Analyze these Etsy products and suggest the ideal SEO strategy.\n\n` + 
            products.map(
                (p: any, i: number) => 
                    `Product ${i + 1}:\nTitle: ${p.title}\nDescription: ${p.description}\nTags: ${p.tags?.join(', ')}`
            )
            .join('\n\n');
        try {
            const result = await this.openAIService.generateCompletion(prompt, 'You are an Etsy SEO specialist.');
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

        const response = await this.openAIService.generateCompletion(prompt, 'You are an expert in Etsy SEO.');
        res.json({ result: response });

        
      } catch (e: any) {
        console.log(e)
        res.status(500).json({ error: e.message });
      }
    }
}