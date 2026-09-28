import { apiClient } from './client';
import { Product, CatalogResponse } from '@/src/types/catalog';

export const FALLBACK_CATALOG: Product[] = [
  {
    id: 'p1',
    title: 'Stone-Ground Multigrain Atta',
    slug: 'stone-ground-multigrain-atta',
    description:
      'Traditional slow-milled atta made from 7 farm-fresh whole grains: MP Sharbati Wheat, Ragi, Jowar, Bajra, Kala Chana, Oats, and Soyabean. Retains all bran and natural nutrients.',
    category: 'Multigrain Flours',
    imageUrl:
      'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=700&q=80',
    images: [
      'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=700&q=80',
      'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=700&q=80',
      'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=700&q=80',
    ],
    variants: [
      { id: 'v1-1', weight: '500g', price: 65, originalPrice: 75, stock: 50, sku: 'GP-FL-MG-500G' },
      { id: 'v1-2', weight: '1kg', price: 120, originalPrice: 140, stock: 85, sku: 'GP-FL-MG-1KG' },
      { id: 'v1-3', weight: '5kg', price: 560, originalPrice: 650, stock: 25, sku: 'GP-FL-MG-5KG' },
    ],
    rating: 4.9,
    reviewCount: 342,
    origin: 'Sehore, Madhya Pradesh',
    organic: true,
    benefits: [
      'Cold Chakki Stone Ground',
      'Zero Maida & Zero Bleach',
      'Rich in Iron, Zinc & Fiber',
      'Low Glycemic Index for Easy Digestion',
    ],
  },
  {
    id: 'p2',
    title: 'Unpolished Foxtail & Little Millet',
    slug: 'unpolished-foxtail-millet',
    description:
      'Native heritage grains cultivated using zero-budget natural farming in rainfed fields. 100% unpolished to protect the nutrient-dense husk.',
    category: 'Millets',
    imageUrl:
      'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=700&q=80',
    images: [
      'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=700&q=80',
      'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=700&q=80',
    ],
    variants: [
      { id: 'v2-1', weight: '500g', price: 90, originalPrice: 110, stock: 40, sku: 'GP-MIL-FOX-500G' },
      { id: 'v2-2', weight: '1kg', price: 170, originalPrice: 210, stock: 60, sku: 'GP-MIL-FOX-1KG' },
      { id: 'v2-3', weight: '5kg', price: 790, originalPrice: 950, stock: 0, sku: 'GP-MIL-FOX-5KG' }, // Out of stock demo
    ],
    rating: 4.8,
    reviewCount: 195,
    origin: 'Dharwad, Karnataka',
    organic: true,
    benefits: [
      '100% Unpolished Native Grain',
      'Gluten-Free & Diabetic Friendly',
      'High in Protein & Magnesium',
    ],
  },
  {
    id: 'p3',
    title: 'Wood-Pressed Yellow Mustard Oil (Kachi Ghani)',
    slug: 'wood-pressed-mustard-oil',
    description:
      'Extracted at low temperatures (<40°C) using traditional wooden Kolhu/Chekku presses. Preserves all natural antioxidants and aroma.',
    category: 'Cold Pressed Oils',
    imageUrl:
      'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=700&q=80',
    images: [
      'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=700&q=80',
      'https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?auto=format&fit=crop&w=700&q=80',
    ],
    variants: [
      { id: 'v3-1', weight: '500ml', price: 180, originalPrice: 210, stock: 35, sku: 'GP-OIL-MUST-500ML' },
      { id: 'v3-2', weight: '1L', price: 340, originalPrice: 390, stock: 50, sku: 'GP-OIL-MUST-1L' },
      { id: 'v3-3', weight: '5L', price: 1590, originalPrice: 1850, stock: 12, sku: 'GP-OIL-MUST-5L' },
    ],
    rating: 4.9,
    reviewCount: 420,
    origin: 'Bharatpur, Rajasthan',
    organic: true,
    benefits: [
      'Wooden Kolhu Cold Extraction',
      'Zero Hexane or Chemical Solvents',
      'Rich in Omega-3 Fatty Acids',
    ],
  },
  {
    id: 'p4',
    title: 'High Curcumin Stone-Ground Turmeric Powder',
    slug: 'organic-lakadong-turmeric',
    description:
      'Single-origin Lakadong turmeric with guaranteed 7%+ curcumin content. Sun-dried and slow-pulverized in granite stone mills.',
    category: 'Spices',
    imageUrl:
      'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=700&q=80',
    images: [
      'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=700&q=80',
    ],
    variants: [
      { id: 'v4-1', weight: '250g', price: 140, originalPrice: 170, stock: 65, sku: 'GP-SP-TUR-250G' },
      { id: 'v4-2', weight: '500g', price: 260, originalPrice: 310, stock: 40, sku: 'GP-SP-TUR-500G' },
      { id: 'v4-3', weight: '1kg', price: 490, originalPrice: 580, stock: 15, sku: 'GP-SP-TUR-1KG' },
    ],
    rating: 5.0,
    reviewCount: 280,
    origin: 'Jaintia Hills, Meghalaya',
    organic: true,
    benefits: [
      '7.2% Tested Active Curcumin',
      'No Lead Chromate or Artificial Color',
      'Immunity & Anti-inflammatory Booster',
    ],
  },
  {
    id: 'p5',
    title: 'A2 Vedic Bilona Desi Cow Ghee',
    slug: 'a2-vedic-desi-cow-ghee',
    description:
      'Prepared through ancient 5-stage Vedic Bilona method from grass-fed Gir and Hallikar cows. Golden granular texture with rich aroma.',
    category: 'Dairy & Ghee',
    imageUrl:
      'https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?auto=format&fit=crop&w=700&q=80',
    images: [
      'https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?auto=format&fit=crop&w=700&q=80',
    ],
    variants: [
      { id: 'v5-1', weight: '250ml', price: 520, originalPrice: 600, stock: 30, sku: 'GP-GH-A2-250ML' },
      { id: 'v5-2', weight: '500ml', price: 950, originalPrice: 1100, stock: 45, sku: 'GP-GH-A2-500ML' },
      { id: 'v5-3', weight: '1L', price: 1850, originalPrice: 2150, stock: 18, sku: 'GP-GH-A2-1L' },
    ],
    rating: 4.9,
    reviewCount: 512,
    origin: 'Gir Forest Region, Gujarat',
    organic: true,
    benefits: [
      'Handmade in Clay Pots',
      '100% Grass-Fed A2 Cultured Curd',
      'Rich in Butyric Acid & Fat Soluble Vitamins',
    ],
  },
  {
    id: 'p6',
    title: 'Wood-Pressed Virgin Coconut Oil',
    slug: 'wood-pressed-virgin-coconut-oil',
    description:
      'Extracted from fresh, mature Kerala organic coconuts using slow wooden cold presses. Delicate aroma and unrefined taste.',
    category: 'Cold Pressed Oils',
    imageUrl:
      'https://images.unsplash.com/photo-1526947425960-945c6e72858f?auto=format&fit=crop&w=700&q=80',
    images: [
      'https://images.unsplash.com/photo-1526947425960-945c6e72858f?auto=format&fit=crop&w=700&q=80',
    ],
    variants: [
      { id: 'v6-1', weight: '500ml', price: 210, originalPrice: 245, stock: 28, sku: 'GP-OIL-COC-500ML' },
      { id: 'v6-2', weight: '1L', price: 390, originalPrice: 460, stock: 34, sku: 'GP-OIL-COC-1L' },
    ],
    rating: 4.8,
    reviewCount: 160,
    origin: 'Wayanad, Kerala',
    organic: true,
    benefits: [
      'Fresh Wet Coconut Extraction',
      'Rich in Lauric Acid (MCTs)',
      'Unrefined & Non-Hydrogenated',
    ],
  },
];

export const CATEGORIES_LIST: string[] = [
  'All',
  'Multigrain Flours',
  'Millets',
  'Cold Pressed Oils',
  'Spices',
  'Dairy & Ghee',
];

/**
 * Fetches product catalog from backend API GET /api/catalog
 * with graceful fallback to fresh mock data.
 */
export async function fetchCatalog(): Promise<Product[]> {
  try {
    const response = await apiClient.get<CatalogResponse | Product[]>('/api/catalog');
    if (Array.isArray(response.data)) {
      return response.data;
    }
    if (response.data && Array.isArray(response.data.products)) {
      return response.data.products;
    }
    return FALLBACK_CATALOG;
  } catch (error: unknown) {
    console.warn('[fetchCatalog] Backend unreachable, using farm catalog data:', error);
    return FALLBACK_CATALOG;
  }
}

/**
 * Fetches a single product by ID
 */
export async function fetchProductById(id: string): Promise<Product | null> {
  try {
    const response = await apiClient.get<Product>(`/api/catalog/${id}`);
    if (response.data && response.data.id) {
      return response.data;
    }
  } catch {
    // fallback lookup
  }
  const found = FALLBACK_CATALOG.find((p) => p.id === id || p.slug === id);
  return found || null;
}
