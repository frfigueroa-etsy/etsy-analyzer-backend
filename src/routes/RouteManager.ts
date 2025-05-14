import {Router} from 'express';

import { EtsyService } from '../services/EtsyService';
import { OpenAIService } from '../services/OpenAIService';
import { ShopController } from '../controllers/ShopController';
import { envs } from '../configs/envs';
import { ShopListingRoutes } from '../resources/listing/routes';
import { AIRoutes } from '../resources/ai/routes';
import { ShopRoutes } from '../resources/shop/routes';

export class RouterManager {

  static get routes ():Router {
    const router = Router();

    router.use('/etsy/shop', ShopRoutes.routes);
    router.use('/etsy/shopListing', ShopListingRoutes.routes);
    router.use('/ai', AIRoutes.routes);

    // router.get('/shop/:shopId/ledger', controller.financialAnalysis);
    // router.get('/shop/:shopId/product-sales', controller.productSales);
    // router.get('/shop/:shopId/performance', controller.storePerformance);

    return router;
  }
}