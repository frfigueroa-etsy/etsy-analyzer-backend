import { Request, Response } from 'express';
import { EtsyService } from '../../services/EtsyService';

export class ListingController{
    

    constructor(public etsyService:EtsyService){}

    public searchListings = async (req:Request, res:Response): Promise<void> => {
        const keyword = req.query.q as string;
        if (!keyword) {
          res.status(400).json({ error: 'Missing keyword' });
          return;
        }
        try {
            const data = await this.etsyService.searchListings(keyword);
            res.json(data);
          } catch (e: any) {
            console.log(e)
            res.status(500).json({ error: e.message });
          }
    }

    public getListing = async (req:Request, res:Response): Promise<void> => {
        const listingId = req.params.listingId;
        const includesParam = req.query.includes;

        if (!listingId) {
          res.status(400).json({ error: 'Missing listingId' });
          return;
        }
        let includes: string[] | undefined = undefined;
        if (typeof includesParam === 'string') {
          includes = [includesParam];
        } else if (Array.isArray(includesParam)) {
          includes = includesParam;
        }

        try {
            const data = await this.etsyService.getListing(listingId, includes);
            res.json(data);
          } catch (e: any) {
            res.status(500).json({ error: e.message });
          }
    }

    public analyzeListing = async(req: Request, res: Response): Promise<void> => {
      const { listingId } = req.body;
      console.log(listingId)
      
      if (!listingId) {
        res.status(400).json({ error: 'Missing listingId' });
        return;
      }
      try {
        const listingData = await this.etsyService.getListing(listingId);

        const result = {
          title: listingData.title,
          description: listingData.description,
          tags: listingData.tags || [],
          price: listingData.price?.amount ? (listingData.price.amount / 100).toFixed(2) : null,
          currency: listingData.price?.currency_code || null,
          views: listingData.views,
          favorites: listingData.num_favorers,
          taxonomy_path: listingData.taxonomy_path || [],
          who_made: listingData.who_made || '',
          when_made: listingData.when_made || '',
          is_supply: listingData.is_supply || false,
          is_digital: listingData.is_digital || false
        };
    
        res.json({ result });

      } catch (e: any) {
        console.log(e)
        res.status(500).json({ error: e.message });
      }
    }

    // Reviews
    public getListingReviews = async (req: Request, res: Response): Promise<void> => {
      const listingId = parseInt(req.params.listingId);
  
      if (!listingId || isNaN(listingId)) {
        res.status(400).json({ error: 'Invalid or missing listingId' });
        return;
      }
  
      try {
        const reviews = await this.etsyService.getListingReviews(listingId);
        res.json(reviews);
      } catch (e: any) {
        res.status(500).json({ error: e.message });
      }
    }

    // Media 
    public getListingImages = async (req: Request, res: Response): Promise<void> => {
      const listingId = parseInt(req.params.listingId);
  
      if (!listingId || isNaN(listingId)) {
        res.status(400).json({ error: 'Invalid or missing listingId' });
        return;
      }
  
      try {
        const images = await this.etsyService.getListingImages(listingId);
        res.json(images);
      } catch (e: any) {
        res.status(500).json({ error: e.message });
      }
    }

}