import { CATEGORIES } from "@/constants/categories";
import type { ShopDetails, StoreProduct } from "@/types/store";

export const shopDetails: ShopDetails = {
  name: "Super Market",
  location: "Electronic City Phase 2, Bengaluru...",
  hours: "09:00 am - 10:00 pm",
  galleryImages: [
    "https://images.unsplash.com/photo-1604719312566-8912e9227c6a?w=400&h=300&fit=crop",
    "https://images.unsplash.com/photo-1578916171728-46686eac8d58?w=400&h=300&fit=crop",
    "https://images.unsplash.com/photo-1534723452862-4c874018d66d?w=400&h=300&fit=crop",
  ],
};

export const productsData: StoreProduct[] = [
  {
    id: "1",
    name: "Verka Milk Packet",
    quantity: "500 ml",
    currentPrice: 300,
    originalPrice: 600,
    discount: 50,
    inStock: true,
    image:
      "https://images.unsplash.com/photo-1563636619-e9143da7973b?w=200&h=200&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1563636619-e9143da7973b?w=200&h=200&fit=crop",
      "https://images.unsplash.com/photo-1626814029240-89bde2a1fad7?w=200&h=200&fit=crop",
      "https://images.unsplash.com/photo-1622349741139-347e080d28bd?w=200&h=200&fit=crop"
    ]
  },
  {
    id: "2",
    name: "Tomato",
    quantity: "2 KG's",
    currentPrice: 150,
    originalPrice: 200,
    discount: 25,
    inStock: true,
    image:
      "https://images.unsplash.com/photo-1546470427-227c7369a9b8?w=200&h=200&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1546470427-227c7369a9b8?w=200&h=200&fit=crop",
      "https://images.unsplash.com/photo-1569336417501-7bf0e74e29d1?w=200&h=200&fit=crop",
      "https://images.unsplash.com/photo-1589964466339-9d296a0ca4d4?w=200&h=200&fit=crop"
    ]
  },
  {
    id: "3",
    name: "Aashirvaad Superior MP Atta",
    quantity: "10 KG's",
    currentPrice: 300,
    originalPrice: 300,
    discount: 0,
    inStock: true,
    description: "Aashirvaad Superior MP Atta supports digestive health.",
    nutritionalFacts: "High nutritional value.",
    sellerDetails: "Super Market",
    image:
      "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=200&h=200&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=200&h=200&fit=crop",
      "https://images.unsplash.com/photo-1603894584373-5ac82b8f0b5f?w=200&h=200&fit=crop",
      "https://images.unsplash.com/photo-1594422748969-83c51fe0c2d3?w=200&h=200&fit=crop"
    ]
  },
  {
    id: "4",
    name: "Basmati Rice",
    quantity: "25 KG's",
    currentPrice: 180,
    originalPrice: 220,
    discount: 18,
    inStock: true,
    image:
      "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=200&h=200&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=200&h=200&fit=crop",
      "https://images.unsplash.com/photo-1594422748969-83c51fe0c2d3?w=200&h=200&fit=crop",
      "https://images.unsplash.com/photo-1603894584373-5ac82b8f0b5f?w=200&h=200&fit=crop"
    ]
  },
  {
    id: "5",
    name: "Sunflower Oil",
    quantity: "1 Liter",
    currentPrice: 120,
    originalPrice: 150,
    discount: 20,
    inStock: true,
    image:
      "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=200&h=200&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=200&h=200&fit=crop",
      "https://images.unsplash.com/photo-1594422748969-83c51fe0c2d3?w=200&h=200&fit=crop",
      "https://images.unsplash.com/photo-1603894584373-5ac82b8f0b5f?w=200&h=200&fit=crop"
    ]
  },
  {
    id: "6",
    name: "Sugar",
    quantity: "1 KG",
    currentPrice: 45,
    originalPrice: 50,
    discount: 10,
    inStock: true,
    image:
      "https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?w=200&h=200&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?w=200&h=200&fit=crop",
      "https://images.unsplash.com/photo-1594422748969-83c51fe0c2d3?w=200&h=200&fit=crop",
      "https://images.unsplash.com/photo-1603894584373-5ac82b8f0b5f?w=200&h=200&fit=crop"
    ]
  },
];

export const categories = [...CATEGORIES];
