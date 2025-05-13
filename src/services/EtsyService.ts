// services/EtsyService.ts
import axios from 'axios';
import { envs } from '../configs/envs';

export class EtsyService {
  constructor(private apiKey: string) {}

  private async get<T>(url: string): Promise<T> {
    try {
      const response = await axios.get<T>(url, {
        headers: {
          'x-api-key': this.apiKey
        }
      });
      return response.data;
    } catch (error: any) {
      console.error(`GET ${url} failed:`, error.message);
      throw new Error('Etsy API request failed');
    }
  }

  async searchListings(keyword: string): Promise<any> {
    const encoded = encodeURIComponent(keyword);
    const url = `${envs.ETSY_API_URL}/listings/active?keywords=${encoded}&limit=50&sort_on=score`;
    return this.get<any>(url);
  }

  async getListing(listingId: string): Promise<any> {
    const url = `${envs.ETSY_API_URL}/listings/${listingId}`;
   return this.get<any>(url);
  }

  async getLedger(shopId: string): Promise<any> {
    const url = `${envs.ETSY_API_URL}/shops/${shopId}/payment-account/ledger-entries`;
    return this.get<any>(url);
  }

  async getReceipts(shopId: string): Promise<any> {
    const url = `${envs.ETSY_API_URL}/shops/${shopId}/receipts`;
    return this.get<any>(url);
  }

  async getTransactions(shopId: string, receiptId: string): Promise<any> {
    const url = `${envs.ETSY_API_URL}/shops/${shopId}/receipts/${receiptId}/transactions`;
    return this.get<any>(url);
  }

  async fetchJSON(url: string): Promise<any> {
    return this.get<any>(url);
  }
}
