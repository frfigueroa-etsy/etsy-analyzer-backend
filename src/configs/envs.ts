import 'dotenv/config';
import {get} from 'env-var'

export const envs = {
    PORT: get('PORT').required().asPortNumber(),
    ETSY_API_KEY: get('ETSY_API_KEY').required().asString(),
    ETSY_API_URL: get('ETSY_API_URL').required().asUrlString(),
    RUNWAY_URL: get('RUNWAY_URL').required().asUrlString(),
    OPENAI_API_KEY: get('OPENAI_API_KEY').required().asString(),
    RUNWAY_API_KEY: get('RUNWAY_API_KEY').required().asString(),
}