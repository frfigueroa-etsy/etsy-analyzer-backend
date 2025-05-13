import express, {Router} from 'express';
import { EtsyService } from '../../services/EtsyService';
import { envs } from '../../configs/envs';
import { ListingController } from './controller';

export class ShopListingRoutes {
    static get routes(): Router {
        const router = Router();

        const etsyService = new EtsyService(envs.ETSY_API_KEY);
        const controller = new ListingController(etsyService);

        router.get('/search', controller.searchListings);
        router.post('/analyze-listing', controller.analyzeListing);

        // router.get('/listing/:listingId', controller.getListing);

        // router.get('/shop/:shopId/ledger', controller.financialAnalysis);
        // router.get('/shop/:shopId/product-sales', controller.productSales);
        // router.get('/shop/:shopId/performance', controller.storePerformance);

        return router;

    }
}
