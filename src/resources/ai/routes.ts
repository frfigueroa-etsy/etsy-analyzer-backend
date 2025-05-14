import express, {Router} from 'express';
import { OpenAIService } from '../../services/OpenAIService';
import { envs } from '../../configs/envs';
import { AIController } from './controller';

export class AIRoutes {
    static get routes(): Router {
        const router = Router();

        const openAIService = new OpenAIService(envs.OPENAI_API_KEY);
        const controller = new AIController(openAIService);

        router.get('/test', controller.test);

        // ShopListing analysis
        router.post('/analyze-seo', controller.analyzeSEO);
        router.post('/benchmark-analyze', controller.benchmark);
        router.post('/analyze-seo-from-listing', controller.analyzeSEOFromListing);

        // Shop analysis
        router.post('/analyze-commercial-appeal', controller.commercialAppeal);
        router.post('/analyze-customer-experience', controller.customerExperience);
        router.post('/analyze-listing-conversion', controller.listingConversion);
        router.post('/analyze-professional-benchmark', controller.professionalBenchmark);

        return router;

    }
}
