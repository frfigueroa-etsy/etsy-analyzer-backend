import { Request, Response } from 'express';
import { EtsyService } from '../../services/EtsyService';

export class ShopController{
    constructor(public etsyService:EtsyService){}

    public getShop = async (req:Request, res:Response): Promise<void> => {
        const shopId = req.params.shopId;
        if (!shopId) {
            res.status(400).json({ error: 'Missing shopId' });
            return;
          }

        try {
            const data = await this.etsyService.getShop(shopId);
            res.json(data);
          } catch (e: any) {
            res.status(500).json({ error: e.message });
          }
    }
    public getPaymentAccountLedgerEntryPayments = async (req:Request, res:Response): Promise<void> => {
        const shopId = req.params.shopId;
        if (!shopId) {
            res.status(400).json({ error: 'Missing shopId' });
            return;
          }

        try {
            const data = await this.etsyService.getPaymentAccountLedgerEntryPayments(shopId);
            res.json(data);
          } catch (e: any) {
            res.status(500).json({ error: e.message });
          }
    }
    public getPayments = async (req:Request, res:Response): Promise<void> => {
        const shopId = req.params.shopId;
        if (!shopId) {
            res.status(400).json({ error: 'Missing shopId' });
            return;
          }

        try {
            const data = await this.etsyService.getPayments(shopId);
            res.json(data);
          } catch (e: any) {
            res.status(500).json({ error: e.message });
          }
    }
    public getShopPaymentByReceiptId = async (req:Request, res:Response): Promise<void> => {
        const {shopId, receiptId} = req.params;
        if (!shopId || !receiptId) {
            res.status(400).json({ error: 'Missing fields (shopIdand receiptId required)' });
            return;
          }

        try {
            const data = await this.etsyService.getShopPaymentByReceiptId(shopId, receiptId);
            res.json(data);
          } catch (e: any) {
            res.status(500).json({ error: e.message });
          }
    }

    // Reviews
    public getShopReviews = async (req: Request, res: Response): Promise<void> => {
      const shopId = parseInt(req.params.shopId);
  
      if (!shopId || isNaN(shopId)) {
        res.status(400).json({ error: 'Invalid or missing shopId' });
        return;
      }
  
      try {
        const reviews = await this.etsyService.getShopReviews(shopId);
        res.json(reviews);
      } catch (e: any) {
        res.status(500).json({ error: e.message });
      }
    }
}