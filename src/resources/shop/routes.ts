import express, { Router } from 'express';
import { EtsyService } from '../../services/EtsyService';
import { envs } from '../../configs/envs';
import { ShopController } from './controller';

export class ShopRoutes {
    static get routes(): Router {
        const router = Router();

        const etsyService = new EtsyService(envs.ETSY_API_KEY);
        const controller = new ShopController(etsyService);

        router.get('/getShop/:shopId', controller.getShop);
        // Payments 
        router.get('/ledger-entries/:shopId', controller.getPaymentAccountLedgerEntryPayments);
        router.get('/payments/:shopId', controller.getPayments);
        router.get('/receipts/:shopId/:receiptId/payments', controller.getShopPaymentByReceiptId);

        return router;

    }
}
