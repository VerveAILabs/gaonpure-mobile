export interface Variant {
  id: string;
  weight: string; // e.g. "500g", "1kg", "5kg", "1L", "5L"
  price: number;
  originalPrice?: number;
  stock: number;
  sku: string;
}

export interface Product {
  id: string;
  title: string;
  slug: string;
  description: string;
  category: string;
  imageUrl: string;
  images?: string[];
  variants: Variant[];
  rating?: number;
  reviewCount?: number;
  origin?: string;
  organic?: boolean;
  benefits?: string[];
}

export interface CatalogResponse {
  products: Product[];
  categories: string[];
  total: number;
}
