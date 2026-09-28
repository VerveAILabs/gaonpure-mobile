import { apiClient } from './client';

export type OrderStatus =
  | 'pending'
  | 'processing'
  | 'dispatched'
  | 'in_transit'
  | 'out_for_delivery'
  | 'delivered'
  | 'cancelled';

export interface OrderItemRecord {
  id: string;
  productId: string;
  title: string;
  variantId: string;
  variantWeight: string;
  price: number;
  quantity: number;
  imageUrl: string;
}

export interface TrackingStep {
  title: string;
  description: string;
  timestamp?: string;
  completed: boolean;
  current: boolean;
}

export interface OrderRecord {
  id: string;
  orderNumber: string;
  createdAt: string;
  status: OrderStatus;
  items: OrderItemRecord[];
  subtotal: number;
  deliveryFee: number;
  totalAmount: number;
  courierName?: string;
  trackingNumber?: string;
  estimatedDelivery?: string;
  deliveryAddress: {
    fullName: string;
    phone: string;
    street: string;
    city: string;
    state: string;
    pincode: string;
  };
  paymentMethod: string;
  paymentId?: string;
  timeline: TrackingStep[];
}

export const FALLBACK_ORDERS: OrderRecord[] = [
  {
    id: 'ord-10492',
    orderNumber: 'GP-10492',
    createdAt: '28 Sep 2026, 11:30 AM',
    status: 'in_transit',
    subtotal: 1070,
    deliveryFee: 0,
    totalAmount: 1070,
    courierName: 'Shiprocket Express (Delhivery)',
    trackingNumber: 'SR-DEL-984210492',
    estimatedDelivery: 'Tomorrow, by 6:00 PM',
    deliveryAddress: {
      fullName: 'Aarav Sharma',
      phone: '+91 98765 43210',
      street: 'Flat 402, Green Meadows, 14th Main Road, HSR Layout',
      city: 'Bengaluru',
      state: 'Karnataka',
      pincode: '560102',
    },
    paymentMethod: 'Razorpay UPI (Google Pay)',
    paymentId: 'pay_Nq98x124701',
    items: [
      {
        id: 'i1',
        productId: 'p1',
        title: 'Stone-Ground Multigrain Atta',
        variantId: 'v1-2',
        variantWeight: '1kg',
        price: 120,
        quantity: 1,
        imageUrl:
          'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=400&q=80',
      },
      {
        id: 'i2',
        productId: 'p5',
        title: 'A2 Vedic Bilona Desi Cow Ghee',
        variantId: 'v5-2',
        variantWeight: '500ml',
        price: 950,
        quantity: 1,
        imageUrl:
          'https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?auto=format&fit=crop&w=400&q=80',
      },
    ],
    timeline: [
      {
        title: 'Order Placed',
        description: 'Received & verified by Gaon Pure',
        timestamp: '28 Sep, 11:30 AM',
        completed: true,
        current: false,
      },
      {
        title: 'Order Confirmed & Packed',
        description: 'Freshly packed in eco-friendly cotton bags at farm hub',
        timestamp: '28 Sep, 01:15 PM',
        completed: true,
        current: false,
      },
      {
        title: 'Dispatched via Courier',
        description: 'Handed over to Shiprocket Express (Delhivery AWB: SR-DEL-984210492)',
        timestamp: '28 Sep, 03:45 PM',
        completed: true,
        current: true,
      },
      {
        title: 'Out for Delivery',
        description: 'Package arriving with delivery partner',
        timestamp: 'Expected Tomorrow Morning',
        completed: false,
        current: false,
      },
      {
        title: 'Delivered',
        description: 'Delivered safely to doorstep',
        completed: false,
        current: false,
      },
    ],
  },
  {
    id: 'ord-10488',
    orderNumber: 'GP-10488',
    createdAt: '24 Sep 2026, 04:20 PM',
    status: 'delivered',
    subtotal: 680,
    deliveryFee: 50,
    totalAmount: 730,
    courierName: 'Shiprocket Air (Bluedart)',
    trackingNumber: 'SR-BLU-78210488',
    estimatedDelivery: 'Delivered on 26 Sep',
    deliveryAddress: {
      fullName: 'Aarav Sharma',
      phone: '+91 98765 43210',
      street: 'Flat 402, Green Meadows, 14th Main Road, HSR Layout',
      city: 'Bengaluru',
      state: 'Karnataka',
      pincode: '560102',
    },
    paymentMethod: 'Razorpay Cards (Visa)',
    paymentId: 'pay_Np43k891230',
    items: [
      {
        id: 'i3',
        productId: 'p3',
        title: 'Wood-Pressed Yellow Mustard Oil',
        variantId: 'v3-2',
        variantWeight: '1L',
        price: 340,
        quantity: 2,
        imageUrl:
          'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=400&q=80',
      },
    ],
    timeline: [
      {
        title: 'Order Placed',
        description: 'Received & verified by Gaon Pure',
        timestamp: '24 Sep, 04:20 PM',
        completed: true,
        current: false,
      },
      {
        title: 'Order Confirmed & Packed',
        description: 'Freshly packed at Rajasthan village center',
        timestamp: '24 Sep, 06:10 PM',
        completed: true,
        current: false,
      },
      {
        title: 'Dispatched via Courier',
        description: 'Bluedart Air Express (AWB: SR-BLU-78210488)',
        timestamp: '25 Sep, 09:00 AM',
        completed: true,
        current: false,
      },
      {
        title: 'Out for Delivery',
        description: 'Courier agent out for delivery',
        timestamp: '26 Sep, 10:30 AM',
        completed: true,
        current: false,
      },
      {
        title: 'Delivered',
        description: 'Delivered & signed by customer',
        timestamp: '26 Sep, 02:40 PM',
        completed: true,
        current: true,
      },
    ],
  },
  {
    id: 'ord-10475',
    orderNumber: 'GP-10475',
    createdAt: '18 Sep 2026, 09:10 AM',
    status: 'delivered',
    subtotal: 490,
    deliveryFee: 50,
    totalAmount: 540,
    courierName: 'Shiprocket Surface (Shadowfax)',
    trackingNumber: 'SR-SHD-5610475',
    estimatedDelivery: 'Delivered on 21 Sep',
    deliveryAddress: {
      fullName: 'Aarav Sharma',
      phone: '+91 98765 43210',
      street: 'Flat 402, Green Meadows, 14th Main Road, HSR Layout',
      city: 'Bengaluru',
      state: 'Karnataka',
      pincode: '560102',
    },
    paymentMethod: 'Razorpay UPI (PhonePe)',
    paymentId: 'pay_Nm11q782910',
    items: [
      {
        id: 'i4',
        productId: 'p4',
        title: 'High Curcumin Stone-Ground Turmeric Powder',
        variantId: 'v4-3',
        variantWeight: '1kg',
        price: 490,
        quantity: 1,
        imageUrl:
          'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=400&q=80',
      },
    ],
    timeline: [
      {
        title: 'Order Placed',
        description: 'Order confirmed',
        timestamp: '18 Sep, 09:10 AM',
        completed: true,
        current: false,
      },
      {
        title: 'Order Confirmed & Packed',
        description: 'Packed at Meghalaya organic hub',
        timestamp: '18 Sep, 02:00 PM',
        completed: true,
        current: false,
      },
      {
        title: 'Dispatched via Courier',
        description: 'Shadowfax (AWB: SR-SHD-5610475)',
        timestamp: '19 Sep, 11:00 AM',
        completed: true,
        current: false,
      },
      {
        title: 'Out for Delivery',
        description: 'Delivered to doorstep',
        timestamp: '21 Sep, 11:30 AM',
        completed: true,
        current: false,
      },
      {
        title: 'Delivered',
        description: 'Package delivered successfully',
        timestamp: '21 Sep, 01:15 PM',
        completed: true,
        current: true,
      },
    ],
  },
];

/**
 * Calls GET /api/orders with Bearer token to retrieve customer order history.
 */
export async function fetchUserOrders(): Promise<OrderRecord[]> {
  try {
    const response = await apiClient.get<OrderRecord[]>('/api/orders');
    if (Array.isArray(response.data)) {
      return response.data;
    }
    return FALLBACK_ORDERS;
  } catch (error: unknown) {
    console.warn('[fetchUserOrders] Using fallback orders:', error);
    return FALLBACK_ORDERS;
  }
}

/**
 * Calls GET /api/orders/:id with Bearer token to retrieve single order tracking info.
 */
export async function fetchOrderById(id: string): Promise<OrderRecord | null> {
  try {
    const response = await apiClient.get<OrderRecord>(`/api/orders/${id}`);
    if (response.data && response.data.id) {
      return response.data;
    }
  } catch (error: unknown) {
    console.warn('[fetchOrderById] Using fallback order lookup:', error);
  }

  const found = FALLBACK_ORDERS.find(
    (o) => o.id === id || o.orderNumber === id || o.orderNumber === `GP-${id}`
  );
  return found || FALLBACK_ORDERS[0] || null;
}
