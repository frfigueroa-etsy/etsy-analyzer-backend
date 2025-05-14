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

  // ShopListing

  async searchListings(keyword: string): Promise<any> {
    const encoded = encodeURIComponent(keyword);
    const url = `${envs.ETSY_API_URL}/listings/active?keywords=${encoded}&limit=50&sort_on=score`;
   
    return this.get<any>(url);
  }

  async getListing(listingId: string, includes?: string[]): Promise<any> {
    let url = `${envs.ETSY_API_URL}/listings/${listingId}`;
    if (includes && includes.length > 0) {
      const includesParam = includes.map(encodeURIComponent).join(',');
      url += `&includes=${includesParam}`;
    }
   return this.get<any>(url);
  }

  // Payment

  async getPaymentAccountLedgerEntryPayments(shopId: string): Promise<any> {
    const url = `${envs.ETSY_API_URL}/shops/${shopId}/payment-account/ledger-entries/payments`;
    return this.get<any>(url);
  }

  async getPayments(shopId: string): Promise<any> {
    const url = `${envs.ETSY_API_URL}/shops/${shopId}/payments`;
    return this.get<any>(url);
  }

  async getShopPaymentByReceiptId(shopId: string, receiptId: string): Promise<any> {
    const url = `${envs.ETSY_API_URL}/shops/${shopId}/receipts/${receiptId}/payments`;
    return this.get<any>(url);
  }

  // Shop
  async getShop(shopId: string): Promise<any> {
    const url = `${envs.ETSY_API_URL}/shops/${shopId}`;
   return this.get<any>(url);
  }

  // Reviews
  async getListingReviews(listingId: number): Promise<any> {
    const url = `${envs.ETSY_API_URL}/listings/${listingId}/reviews?limit=30`;
    return this.get<any>(url);
  }

  async getShopReviews(shopId: number): Promise<any> {
    const url = `${envs.ETSY_API_URL}/shops/${shopId}/reviews?limit=30`;
    return this.get<any>(url);
  }

}
