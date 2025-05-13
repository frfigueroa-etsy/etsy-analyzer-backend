import {Router} from 'express';

import { EtsyService } from '../services/EtsyService';
import { OpenAIService } from '../services/OpenAIService';
import { ShopController } from '../controllers/ShopController';
import { envs } from '../configs/envs';
import { ShopListingRoutes } from '../resources/listing/routes';
import { AIRoutes } from '../resources/ai/routes';

export class RouterManager {

  static get routes ():Router {
    const router = Router();

    router.use('/etsy/shopListing', ShopListingRoutes.routes);
    router.use('/ai', AIRoutes.routes);


    // const openaiService = new OpenAIService(Envs.get('OPENAI_API_KEY'));

    // const controller = new ShopController(etsyService, openaiService);

    // router.get('/ping', controller.ping.bind(controller));
    // router.get('/etsy/search', controller.searchListings);
    // router.post('/analyze-seo', controller.analyzeSEO);
    // router.post('/analyze-listing', controller.analyzeListing);
    // router.post('/benchmark-analyze', controller.benchmark);

    // router.get('/shop/:shopId/ledger', controller.financialAnalysis);
    // router.get('/shop/:shopId/product-sales', controller.productSales);
    // router.get('/shop/:shopId/performance', controller.storePerformance);

    return router;
  }
}