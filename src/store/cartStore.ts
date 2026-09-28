import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CartItem, Product, Variant } from '@/types';
import { ShippingEstimate } from '@/src/api/shipping';

/**
 * Parses a weight/volume string (e.g. "500g", "1kg", "5kg", "500ml", "1L", "5L")
 * into numeric weight in grams for Shiprocket shipping estimation.
 */
export function parseWeightToGrams(weightStr: string): number {
  if (!weightStr) return 500;
  const normalized = weightStr.toLowerCase().trim();

  // Match numbers and decimals
  const match = normalized.match(/([\d.]+)\s*(kg|g|gm|gms|l|litre|litres|liter|liters|ml)/);
  if (match && match[1] && match[2]) {
    const value = parseFloat(match[1]);
    const unit = match[2];
    if (unit.startsWith('k') || unit === 'l' || unit.startsWith('lit')) {
      return Math.round(value * 1000);
    }
    return Math.round(value);
  }

  const numOnly = parseFloat(normalized.replace(/[^\d.]/g, ''));
  if (!isNaN(numOnly)) {
    if (normalized.includes('kg') || normalized.includes('l')) {
      return Math.round(numOnly * 1000);
    }
    return Math.round(numOnly);
  }

  return 500; // default 500g
}

export interface CartStore {
  items: CartItem[];
  pincode: string;
  shippingEstimate: ShippingEstimate | null;

  // Actions
  addItem: (product: Product, variant: Variant, quantity?: number) => void;
  removeItem: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, quantity: number) => void;
  clearCart: () => void;
  setPincode: (pincode: string) => void;
  setShippingEstimate: (estimate: ShippingEstimate | null) => void;

  // Computed Methods
  getSubtotal: () => number;
  getTotalWeightInGrams: () => number;
  getTotalItems: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [
        {
          id: 'p1-v1-2',
          product: {
            id: 'p1',
            title: 'Stone-Ground Multigrain Atta',
            slug: 'stone-ground-multigrain-atta',
            description:
              'Traditional slow-milled atta made from 7 farm-fresh whole grains. High fiber & nutrient-dense.',
            category: 'Multigrain Flours',
            imageUrl:
              'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=600&q=80',
            variants: [
              { id: 'v1-1', weight: '500g', price: 65, originalPrice: 75, stock: 50, sku: 'GP-FL-MG-500G' },
              { id: 'v1-2', weight: '1kg', price: 120, originalPrice: 140, stock: 85, sku: 'GP-FL-MG-1KG' },
              { id: 'v1-3', weight: '5kg', price: 560, originalPrice: 650, stock: 25, sku: 'GP-FL-MG-5KG' },
            ],
            rating: 4.9,
            organic: true,
          },
          variant: {
            id: 'v1-2',
            weight: '1kg',
            price: 120,
            originalPrice: 140,
            stock: 85,
            sku: 'GP-FL-MG-1KG',
          },
          quantity: 2,
        },
      ],
      pincode: '560102',
      shippingEstimate: null,

      addItem: (product: Product, variant: Variant, quantity = 1) => {
        const cartItemId = `${product.id}-${variant.id}`;
        set((state) => {
          const existingIndex = state.items.findIndex((item) => item.id === cartItemId);
          if (existingIndex > -1) {
            const updatedItems = [...state.items];
            const existingItem = updatedItems[existingIndex];
            if (existingItem) {
              updatedItems[existingIndex] = {
                ...existingItem,
                quantity: existingItem.quantity + quantity,
              };
            }
            return { items: updatedItems };
          }
          return {
            items: [
              ...state.items,
              {
                id: cartItemId,
                product,
                variant,
                quantity,
              },
            ],
          };
        });
      },

      removeItem: (cartItemId: string) => {
        set((state) => ({
          items: state.items.filter((item) => item.id !== cartItemId),
        }));
      },

      updateQuantity: (cartItemId: string, quantity: number) => {
        set((state) => {
          if (quantity <= 0) {
            return {
              items: state.items.filter((item) => item.id !== cartItemId),
            };
          }
          return {
            items: state.items.map((item) =>
              item.id === cartItemId ? { ...item, quantity } : item
            ),
          };
        });
      },

      clearCart: () => {
        set({ items: [], shippingEstimate: null });
      },

      setPincode: (pincode: string) => {
        set({ pincode });
      },

      setShippingEstimate: (shippingEstimate: ShippingEstimate | null) => {
        set({ shippingEstimate });
      },

      getSubtotal: () => {
        const { items } = get();
        return items.reduce((sum, item) => sum + item.variant.price * item.quantity, 0);
      },

      getTotalWeightInGrams: () => {
        const { items } = get();
        return items.reduce((sum, item) => {
          const itemWeight = parseWeightToGrams(item.variant.weight);
          return sum + itemWeight * item.quantity;
        }, 0);
      },

      getTotalItems: () => {
        const { items } = get();
        return items.reduce((sum, item) => sum + item.quantity, 0);
      },
    }),
    {
      name: 'gaonpure-cart-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

// Reactive Selectors
export const useCartCount = (): number => {
  return useCartStore((state) =>
    state.items.reduce((total, item) => total + item.quantity, 0)
  );
};

export const useCartSubtotal = (): number => {
  return useCartStore((state) =>
    state.items.reduce((total, item) => total + item.variant.price * item.quantity, 0)
  );
};

export const useCartTotalWeight = (): number => {
  return useCartStore((state) =>
    state.items.reduce((total, item) => {
      const weight = parseWeightToGrams(item.variant.weight);
      return total + weight * item.quantity;
    }, 0)
  );
};
