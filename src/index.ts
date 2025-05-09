import express, { Request, Response } from 'express';
import { OpenAI } from 'openai';
import fetch from 'node-fetch';
import cors from 'cors';

import dotenv from 'dotenv';
dotenv.config();

const app = express();
const PORT = process.env.PORT;
const ETSY_API_KEY = process.env.ETSY_API_KEY as string;

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
  });

if (!ETSY_API_KEY) {
    throw new Error("ETSY_API_KEY is not defined in your .env file.");
  }

app.use(cors());
app.use(express.json());

app.get('/ping', (req: Request, res: Response) => {
    handlePing(req, res);
  });
  
  async function handlePing(req: Request, res: Response) {
    const response = await fetch('https://api.etsy.com/v3/application/openapi-ping', {
      headers: {
        'x-api-key': ETSY_API_KEY
      }
    });
  
    const data = await response.json();
    res.json(data);
  }

app.get('/etsy/search', (req: Request, res: Response) => {
    handleSearch(req, res);
  });
  
  async function handleSearch(req: Request, res: Response) {
    const keyword = req.query.q as string;
    if (!keyword) return res.status(400).json({ error: 'Missing keyword (q)' });
  
    const url = `https://api.etsy.com/v3/application/listings/active?keywords=${encodeURIComponent(
        keyword
      )}&limit=50&sort_on=score`;
  
    try {
      const response = await fetch(url, {
        headers: {
          'x-api-key': ETSY_API_KEY
        }
      });
  
      if (response.ok) {
        const data = await response.json();
        res.json(data);
      } else {
        const errorData = await response.json();
        res.status(response.status).json(errorData);
      }
    } catch (err) {
      res.status(500).json({ error: 'Internal error', details: err });
    }
  }


  app.post('/analyze-seo', (req: Request, res: Response) => {
    handleAnalyzeSEO(req, res);
  });
  
  async function handleAnalyzeSEO(req: Request, res: Response) {
    const { prompt } = req.body;
  
    if (!prompt || typeof prompt !== 'string') {
      return res.status(400).json({ error: 'Missing or invalid prompt' });
    }
  
    try {
      const chatResponse = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo', 
        messages: [
          {
            role: 'system',
            content: `You are an expert in Etsy SEO. Analyze the following product and provide a SEO Score (0-100) and recommendations to improve its visibility on Etsy. Be clear and concise.`
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 400
      });
  
      const result = chatResponse.choices[0]?.message?.content || 'No analysis returned.';
      res.json({ result });
    } catch (error: any) {
      console.error('OpenAI API error:', error);
      res.status(500).json({ error: 'Failed to analyze SEO', details: error.message });
    }
  }

  app.post('/analyze-listing', (req: Request, res: Response) => {
    console.log('ping')
    handleAnalyzeListing(req, res);
  });
  
  async function handleAnalyzeListing(req: Request, res: Response) {
    const { listingId } = req.body;
    console.log(listingId)
  
    if (!listingId || typeof listingId !== 'string') {
      return res.status(400).json({ error: 'Missing or invalid listingId' });
    }
  
    try {
      const response = await fetch(`https://openapi.etsy.com/v3/application/listings/${listingId}`, {
        headers: {
          'x-api-key': ETSY_API_KEY
        }
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        return res.status(response.status).json(errorData);
      }
  
      const listingData = await response.json() as any;
  
      // You can pre-process if you want to send only certain fields
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
  
    } catch (error: any) {
      console.error('Error fetching Etsy listing:', error);
      res.status(500).json({ error: 'Failed to fetch Etsy listing', details: error.message });
    }
  }

  app.post('/benchmark-analyze', (req: Request, res: Response) => {
    console.log('🔍 Running benchmark analysis');
    handleBenchmarkAnalyze(req, res);
  });
  
  async function handleBenchmarkAnalyze(req: Request, res: Response) {
    const { products } = req.body;
    console.log(products)
  
    if (!products || !Array.isArray(products) || products.length === 0) {
      return res.status(400).json({ error: 'Missing or invalid products array' });
    }
  
    try {
      const prompt = `
  You are an expert in Etsy SEO. You will receive a list of products, each with a title, description, and tags.
  
  Create a proposusal for a new product based on the coincidences of the given products :
  - Evaluate their titles and descriptions SEO qualities and create a title and keywordd for the description.
  - Suggest 3–5 better tags if needed.
  
  Then provide a global summary:
  - Recommend a model product title combining the best elements.
  - Suggest trending keywords that are common or missing.
  - Recommend a set of ideal tags for Etsy ranking.
  
  Products to analyze:
  ${products.map((p, i) => (
  `Product ${i + 1}:
  Title: "${p.title}"
  Description: "${p.description}"
  Tags: ${p.tags?.join(', ') || 'N/A'}`
  )).join('\n\n')}
  `;
  
      const chatResponse = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: `You are a helpful and concise assistant specialized in Etsy SEO optimization.`
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 1000
      });
  
      const result = chatResponse.choices[0]?.message?.content || 'No result.';
      res.json({ result });
    } catch (error: any) {
      console.error('OpenAI error:', error);
      res.status(500).json({ error: 'Benchmark analysis failed', details: error.message });
    }
  }





app.listen(PORT, () => {
  console.log(`Etsy Analyzer Backend running at http://localhost:${PORT}`);
});