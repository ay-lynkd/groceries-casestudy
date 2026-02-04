export interface ShopDetails {
  name: string;
  location: string;
  hours: string;
  galleryImages: string[];
}

export interface StoreProduct {
  id: string;
  name: string;
  quantity: string;
  currentPrice: number;
  originalPrice: number;
  discount: number;
  inStock: boolean;
  image?: string;
  images?: string[];
  description?: string;
  nutritionalFacts?: string;
  sellerDetails?: string;
  amount?: number;
  minimumAmount?: number;
  suggestedAmount?: number;
}
