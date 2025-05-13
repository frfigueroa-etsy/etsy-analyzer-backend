// controllers/ShopController.ts
import { Request, Response } from 'express';
import { EtsyService } from '../services/EtsyService';
import { OpenAIService } from '../services/OpenAIService';

export class ShopController {
  constructor(
    private etsy: EtsyService,
    private openai: OpenAIService
  ) {}

  public async ping(_req: Request, res: Response): Promise<void> {
    try {
        res.json({msg: 'testing '});
    //   const data = await this.etsy.fetchJSON('https://api.etsy.com/v3/application/openapi-ping');
    //   res.json(data);
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  }

  public async searchListings(req: Request, res: Response): Promise<void> {
    try {
      const keyword = req.query.q as string;
      const data = await this.etsy.searchListings(keyword);
      res.json(data);
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  }

  public async analyzeSEO(req: Request, res: Response): Promise<void> {
    const { prompt } = req.body;
    if (!prompt) {
      res.status(400).json({ error: 'Missing prompt' });
      return;
    }
    const response = await this.openai.generateCompletion(prompt, 'You are an expert in Etsy SEO.');
    res.json({ result: response });
  }

  public async analyzeListing(req: Request, res: Response): Promise<void> {
    const { listingId } = req.body;
    if (!listingId) {
      res.status(400).json({ error: 'Missing listingId' });
      return;
    }
    try {
      const listingData = await this.etsy.getListing(listingId);
      res.json({ result: listingData });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  }

  public async benchmark(req: Request, res: Response): Promise<void> {
    const { products } = req.body;
    if (!products || !Array.isArray(products)) {
      res.status(400).json({ error: 'Invalid products' });
      return;
    }

    const prompt = `Analyze these Etsy products and suggest the ideal SEO strategy.\n\n` +
      products.map((p: any, i: number) => `Product ${i + 1}:\nTitle: ${p.title}\nDescription: ${p.description}\nTags: ${p.tags?.join(', ')}`).join('\n\n');

    const result = await this.openai.generateCompletion(prompt, 'You are an Etsy SEO specialist.');
    res.json({ result });
  }

  public async financialAnalysis(req: Request, res: Response): Promise<void> {
    try {
      const shopId = req.params.shopId;
      const data = await this.etsy.getLedger(shopId);
      res.json(data);
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  }

  public async productSales(req: Request, res: Response): Promise<void> {
    try {
      const shopId = req.params.shopId;
      const data = await this.etsy.getReceipts(shopId);
      res.json(data);
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  }

  public async storePerformance(req: Request, res: Response): Promise<void> {
    try {
      const shopId = req.params.shopId;
      const receipts = await this.etsy.getReceipts(shopId);
      res.json({ receipts });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  }
}
