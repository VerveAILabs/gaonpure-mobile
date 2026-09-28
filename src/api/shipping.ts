import { apiClient } from './client';

export interface ShippingEstimateRequest {
  pincode: string;
  weight: number; // in grams
}

export interface ShippingEstimate {
  serviceable: boolean;
  deliveryFee: number;
  estimatedDays: string;
  courierName?: string;
  message?: string;
}

/**
 * Calculates simulated fallback shipping estimate based on standard Indian postal zones
 * and weight for Shiprocket courier services.
 */
function getFallbackShippingEstimate(pincode: string, weightGrams: number): ShippingEstimate {
  const cleanPincode = pincode.replace(/\D/g, '');

  // Basic 6-digit Indian pincode validation
  if (cleanPincode.length !== 6) {
    return {
      serviceable: false,
      deliveryFee: 0,
      estimatedDays: '',
      message: 'Please enter a valid 6-digit postal code',
    };
  }

  // Non-serviceable test range simulation (e.g. 999999 or 000000)
  if (cleanPincode.startsWith('99') || cleanPincode.startsWith('00')) {
    return {
      serviceable: false,
      deliveryFee: 0,
      estimatedDays: '',
      message: 'Not serviceable to this pincode',
    };
  }

  // Weight-based base rate calculation (Shiprocket slab rates)
  const weightInKg = Math.max(0.5, weightGrams / 1000);
  let baseRate = 50;
  let estimatedDays = '2-3 business days';
  let courierName = 'Shiprocket Surface (Bluedart/Delhivery)';

  // Zone estimation based on first digit of pincode
  // 5: South India (Karnataka, AP, Telangana) -> Local zone
  // 1-4: North/Central/West India -> Regional/Metro zone
  // 6-8: South/East/NE India -> Rest of India zone
  const zonePrefix = cleanPincode.charAt(0);

  if (zonePrefix === '5') {
    baseRate = 45 + Math.floor((weightInKg - 0.5) * 20);
    estimatedDays = '1-2 business days';
    courierName = 'Shiprocket Express (Delhivery)';
  } else if (['1', '2', '4'].includes(zonePrefix)) {
    baseRate = 65 + Math.floor((weightInKg - 0.5) * 30);
    estimatedDays = '2-4 business days';
    courierName = 'Shiprocket Air (Bluedart)';
  } else {
    baseRate = 85 + Math.floor((weightInKg - 0.5) * 35);
    estimatedDays = '3-5 business days';
    courierName = 'Shiprocket Surface (Shadowfax)';
  }

  return {
    serviceable: true,
    deliveryFee: Math.max(40, Math.round(baseRate)),
    estimatedDays,
    courierName,
  };
}

/**
 * Calls backend Shiprocket endpoint POST /api/shipping/estimate
 * with fallback simulation.
 */
export async function estimateShipping(
  request: ShippingEstimateRequest
): Promise<ShippingEstimate> {
  try {
    const response = await apiClient.post<ShippingEstimate>(
      '/api/shipping/estimate',
      request
    );
    if (response.data && typeof response.data.serviceable === 'boolean') {
      return response.data;
    }
    return getFallbackShippingEstimate(request.pincode, request.weight);
  } catch (error: unknown) {
    console.warn(
      '[estimateShipping] API endpoint unavailable, applying fallback estimator:',
      error
    );
    return getFallbackShippingEstimate(request.pincode, request.weight);
  }
}
