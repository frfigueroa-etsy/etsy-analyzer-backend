import { Request, Response } from 'express';
import { OpenAIService } from '../../services/OpenAIService';

export class AIController{
    

    constructor(public openAIService:OpenAIService){}

    public test = async (req:Request, res:Response) => {

        try {
            
            res.json({ result: 'test' });
          } catch (e: any) {
            res.status(500).json({ error: e.message });
          }
    }


    public analyzeSEO = async (req:Request, res:Response) => {
        const { listingId } = req.body;
        if (!listingId) {
          res.status(400).json({ error: 'Missing listingId' });
          return;
        }
        try {
            const response = await this.openAIService.generateCompletion(prompt, 'You are an expert in Etsy SEO.');
            res.json({ result: response });
          } catch (e: any) {
            res.status(500).json({ error: e.message });
          }
    }

    public benchmark = async (req:Request, res:Response) => {
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
}