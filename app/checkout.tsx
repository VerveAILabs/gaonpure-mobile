import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import {
  ArrowLeft,
  MapPin,
  CreditCard,
  ShieldCheck,
  CheckCircle2,
  Lock,
  Sparkles,
  ShoppingBag,
  Truck,
  Phone,
  User,
  Building,
} from 'lucide-react-native';
import { Colors } from '@/constants/colors';
import { auth } from '@/src/config/firebase';
import {
  useCartStore,
  useCartSubtotal,
  useCartTotalWeight,
} from '@/src/store/cartStore';
import {
  createCheckoutOrder,
  verifyOrderPayment,
  ShippingAddress,
} from '@/src/api/checkout';
import { launchRazorpayCheckout } from '@/src/services/razorpay';

export default function CheckoutScreen(): React.JSX.Element {
  const router = useRouter();

  const { items, clearCart, pincode, shippingEstimate } = useCartStore();
  const subtotal = useCartSubtotal();
  const totalWeight = useCartTotalWeight();

  // Shipping Address Form State
  const [fullName, setFullName] = useState<string>('Aarav Sharma');
  const [phoneNumber, setPhoneNumber] = useState<string>('9876543210');
  const [street, setStreet] = useState<string>('Flat 402, Green Meadows, 14th Main Road');
  const [city, setCity] = useState<string>('Bengaluru');
  const [state, setState] = useState<string>('Karnataka');
  const [formPincode, setFormPincode] = useState<string>(pincode || '560102');

  const [loading, setLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Delivery calculation
  const isFreeDeliveryEligible = subtotal >= 999;
  const rawDeliveryFee = shippingEstimate?.serviceable
    ? shippingEstimate.deliveryFee
    : 50;
  const deliveryFee = subtotal === 0 || isFreeDeliveryEligible ? 0 : rawDeliveryFee;
  const totalPayable = subtotal + deliveryFee;

  const validateForm = (): boolean => {
    if (!fullName.trim()) {
      setErrorMessage('Please enter your full name.');
      return false;
    }
    const cleanPhone = phoneNumber.replace(/\D/g, '');
    if (cleanPhone.length !== 10) {
      setErrorMessage('Please enter a valid 10-digit mobile number.');
      return false;
    }
    if (!street.trim()) {
      setErrorMessage('Please enter your delivery street address.');
      return false;
    }
    if (!city.trim() || !state.trim()) {
      setErrorMessage('Please enter your city and state.');
      return false;
    }
    const cleanPin = formPincode.replace(/\D/g, '');
    if (cleanPin.length !== 6) {
      setErrorMessage('Please enter a valid 6-digit delivery pincode.');
      return false;
    }
    return true;
  };

  /**
   * Complete Razorpay Payment Flow
   */
  const handleProceedToPayment = async (): Promise<void> => {
    if (!validateForm()) return;

    if (items.length === 0) {
      Alert.alert('Empty Cart', 'Your cart is currently empty.');
      router.push('/(tabs)');
      return;
    }

    // Step 1: Check Authentication; if not authenticated, route to /login
    const currentUser = auth.currentUser;
    if (!currentUser) {
      Alert.alert(
        'Sign In Required',
        'Please sign in to your Gaon Pure account to securely complete your order.',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Sign In',
            onPress: () => router.push('/login'),
          },
        ]
      );
      return;
    }

    setLoading(true);
    setErrorMessage(null);

    const shippingAddress: ShippingAddress = {
      fullName: fullName.trim(),
      phone: phoneNumber.replace(/\D/g, ''),
      street: street.trim(),
      city: city.trim(),
      state: state.trim(),
      pincode: formPincode.replace(/\D/g, ''),
    };

    try {
      // Step 2 & 3: Call POST /api/checkout to create order on backend
      const checkoutData = await createCheckoutOrder({
        items: items.map((item) => ({
          variantId: item.variant.id,
          quantity: item.quantity,
        })),
        shippingAddress,
        deliveryFee,
      });

      // Step 4: Launch Razorpay native checkout sheet
      const razorpayResponse = await launchRazorpayCheckout({
        orderId: checkoutData.orderId,
        razorpayOrderId: checkoutData.razorpayOrderId,
        keyId: checkoutData.keyId,
        amount: checkoutData.amount,
        customerName: fullName.trim(),
        customerEmail: currentUser.email || 'customer@gaonpure.com',
        customerPhone: phoneNumber.replace(/\D/g, ''),
      });

      // Step 5: Verify signature with backend POST /api/orders/verify
      const verificationResult = await verifyOrderPayment({
        razorpay_order_id: razorpayResponse.razorpay_order_id,
        razorpay_payment_id: razorpayResponse.razorpay_payment_id,
        razorpay_signature: razorpayResponse.razorpay_signature,
        orderId: checkoutData.orderId,
      });

      // Step 6: Clear cart store and navigate to Order Success Screen
      if (verificationResult.success) {
        clearCart();
        router.replace({
          pathname: '/orders/success',
          params: {
            orderId: checkoutData.orderId,
            amount: totalPayable.toString(),
            paymentId: razorpayResponse.razorpay_payment_id,
            address: `${street}, ${city}`,
            pincode: formPincode,
            estimatedDays: shippingEstimate?.estimatedDays || '2-3 days',
          },
        });
      } else {
        throw new Error(verificationResult.message || 'Payment verification failed');
      }
    } catch (error: unknown) {
      const err = error as Error;
      setErrorMessage(
        err.message || 'Payment could not be completed. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1 bg-cream-200"
    >
      {/* Header */}
      <View className="pt-12 px-4 pb-3.5 bg-white border-b border-muted-200 flex-row items-center justify-between shadow-xs">
        <TouchableOpacity
          onPress={() => router.back()}
          className="w-10 h-10 rounded-full bg-cream-100 items-center justify-center border border-muted-200"
        >
          <ArrowLeft size={20} color={Colors.primary} />
        </TouchableOpacity>

        <Text className="text-charcoal-500 font-extrabold text-base">
          Delivery & Payment
        </Text>

        <View className="w-10 h-10 items-center justify-center">
          <ShieldCheck size={22} color={Colors.primary} />
        </View>
      </View>

      <ScrollView
        className="flex-1 px-4 pt-4"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 130 }}
        keyboardShouldPersistTaps="handled"
      >
        {/* Error Notification */}
        {errorMessage && (
          <View className="bg-red-50 border border-red-200 rounded-2xl p-3.5 mb-4">
            <Text className="text-red-700 text-xs font-bold">{errorMessage}</Text>
          </View>
        )}

        {/* Section 1: Delivery Address Form */}
        <View className="bg-white rounded-3xl p-5 border border-muted-200 shadow-sm mb-4">
          <View className="flex-row items-center mb-4 pb-2 border-b border-muted-100">
            <View className="w-7 h-7 rounded-full bg-forest-50 items-center justify-center mr-2.5">
              <MapPin size={15} color={Colors.primary} />
            </View>
            <Text className="text-charcoal-500 font-black text-base">
              Delivery Address
            </Text>
          </View>

          {/* Full Name Input */}
          <View className="mb-3.5">
            <Text className="text-muted-500 text-xs font-bold uppercase tracking-wider mb-1.5 ml-1">
              Full Name
            </Text>
            <View className="flex-row items-center bg-cream-100 border border-muted-300 rounded-2xl px-3.5 py-3">
              <User size={16} color={Colors.text.muted} />
              <TextInput
                value={fullName}
                onChangeText={setFullName}
                placeholder="Enter recipient name"
                placeholderTextColor={Colors.text.light}
                className="flex-1 ml-2.5 text-charcoal-500 text-sm font-semibold p-0"
              />
            </View>
          </View>

          {/* Phone Number Input */}
          <View className="mb-3.5">
            <Text className="text-muted-500 text-xs font-bold uppercase tracking-wider mb-1.5 ml-1">
              Mobile Number (For Delivery Updates)
            </Text>
            <View className="flex-row items-center bg-cream-100 border border-muted-300 rounded-2xl px-3.5 py-3">
              <Phone size={16} color={Colors.text.muted} />
              <Text className="text-charcoal-500 font-bold text-sm ml-2.5 mr-1">+91</Text>
              <TextInput
                value={phoneNumber}
                onChangeText={(val) => setPhoneNumber(val.replace(/\D/g, '').slice(0, 10))}
                placeholder="10-digit mobile number"
                placeholderTextColor={Colors.text.light}
                keyboardType="number-pad"
                maxLength={10}
                className="flex-1 text-charcoal-500 text-sm font-semibold p-0"
              />
            </View>
          </View>

          {/* Street / Flat Address */}
          <View className="mb-3.5">
            <Text className="text-muted-500 text-xs font-bold uppercase tracking-wider mb-1.5 ml-1">
              Flat, House No., Apartment & Street
            </Text>
            <View className="flex-row items-center bg-cream-100 border border-muted-300 rounded-2xl px-3.5 py-3">
              <Building size={16} color={Colors.text.muted} />
              <TextInput
                value={street}
                onChangeText={setStreet}
                placeholder="House No, Apartment Name, Street Name"
                placeholderTextColor={Colors.text.light}
                className="flex-1 ml-2.5 text-charcoal-500 text-sm font-semibold p-0"
              />
            </View>
          </View>

          {/* City & State (Row) */}
          <View className="flex-row gap-3 mb-3.5">
            <View className="flex-1">
              <Text className="text-muted-500 text-xs font-bold uppercase tracking-wider mb-1.5 ml-1">
                City
              </Text>
              <TextInput
                value={city}
                onChangeText={setCity}
                placeholder="City"
                placeholderTextColor={Colors.text.light}
                className="bg-cream-100 border border-muted-300 rounded-2xl px-3.5 py-3 text-charcoal-500 text-sm font-semibold"
              />
            </View>

            <View className="flex-1">
              <Text className="text-muted-500 text-xs font-bold uppercase tracking-wider mb-1.5 ml-1">
                State
              </Text>
              <TextInput
                value={state}
                onChangeText={setState}
                placeholder="State"
                placeholderTextColor={Colors.text.light}
                className="bg-cream-100 border border-muted-300 rounded-2xl px-3.5 py-3 text-charcoal-500 text-sm font-semibold"
              />
            </View>
          </View>

          {/* Pincode */}
          <View>
            <Text className="text-muted-500 text-xs font-bold uppercase tracking-wider mb-1.5 ml-1">
              Pincode
            </Text>
            <TextInput
              value={formPincode}
              onChangeText={(val) => setFormPincode(val.replace(/\D/g, '').slice(0, 6))}
              placeholder="6-digit Pincode"
              placeholderTextColor={Colors.text.light}
              keyboardType="number-pad"
              maxLength={6}
              className="bg-cream-100 border border-muted-300 rounded-2xl px-3.5 py-3 text-charcoal-500 text-sm font-semibold"
            />
          </View>
        </View>

        {/* Section 2: Order Summary Card */}
        <View className="bg-white rounded-3xl p-5 border border-muted-200 shadow-sm mb-4">
          <View className="flex-row items-center justify-between pb-3 border-b border-muted-100 mb-3">
            <View className="flex-row items-center">
              <View className="w-7 h-7 rounded-full bg-forest-50 items-center justify-center mr-2.5">
                <ShoppingBag size={15} color={Colors.primary} />
              </View>
              <Text className="text-charcoal-500 font-black text-base">
                Order Summary
              </Text>
            </View>
            <Text className="text-muted-500 font-bold text-xs">
              {items.length} {items.length === 1 ? 'item' : 'items'}
            </Text>
          </View>

          {/* Items compact list */}
          <View className="mb-3 space-y-1.5">
            {items.map((item) => (
              <View key={item.id} className="flex-row justify-between items-center py-1">
                <Text className="text-charcoal-500 text-xs font-medium flex-1 mr-2" numberOfLines={1}>
                  {item.quantity}x {item.product.title} ({item.variant.weight})
                </Text>
                <Text className="text-charcoal-500 font-bold text-xs">
                  ₹{item.variant.price * item.quantity}
                </Text>
              </View>
            ))}
          </View>

          <View className="h-[1px] bg-muted-100 my-2" />

          {/* Subtotal & Delivery */}
          <View className="flex-row justify-between items-center mb-2">
            <Text className="text-muted-500 text-xs">Item Subtotal</Text>
            <Text className="text-charcoal-500 font-bold text-xs">₹{subtotal}</Text>
          </View>

          <View className="flex-row justify-between items-center mb-2">
            <View className="flex-row items-center">
              <Text className="text-muted-500 text-xs">Delivery Fee</Text>
              <Text className="text-muted-400 text-[10px] ml-1.5">(via Shiprocket)</Text>
            </View>
            <Text className="text-charcoal-500 font-bold text-xs">
              {deliveryFee === 0 ? (
                <Text className="text-forest-600 font-bold">FREE</Text>
              ) : (
                `₹${deliveryFee}`
              )}
            </Text>
          </View>

          <View className="h-[1px] bg-muted-100 my-2" />

          {/* Total Payable */}
          <View className="flex-row justify-between items-center pt-1">
            <View>
              <Text className="text-charcoal-500 font-black text-base">Total Payable</Text>
              <Text className="text-muted-400 text-[10px]">All taxes & courier included</Text>
            </View>
            <Text className="text-forest-600 font-black text-2xl">₹{totalPayable}</Text>
          </View>
        </View>

        {/* Section 3: Razorpay Security Badge */}
        <View className="bg-forest-50 rounded-2xl p-4 border border-forest-100 flex-row items-center mb-4">
          <Lock size={18} color={Colors.primary} />
          <View className="ml-3 flex-1">
            <Text className="text-forest-700 font-bold text-xs">
              100% Secured 256-bit Razorpay Gateway
            </Text>
            <Text className="text-forest-600 text-[11px] mt-0.5">
              Supports Google Pay, PhonePe, Paytm, Cards, UPI & NetBanking
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Primary Payment Action Bottom Bar */}
      <View className="absolute bottom-0 left-0 right-0 bg-white px-5 pt-3.5 pb-8 border-t border-muted-200 shadow-2xl">
        <TouchableOpacity
          activeOpacity={0.85}
          disabled={loading || items.length === 0}
          onPress={handleProceedToPayment}
          className={`w-full py-4 rounded-2xl shadow-md flex-row items-center justify-center ${
            loading || items.length === 0 ? 'bg-forest-600/60' : 'bg-forest-600'
          }`}
        >
          {loading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <>
              <CreditCard size={18} color="#FFFFFF" style={{ marginRight: 8 }} />
              <Text className="text-white font-black text-sm">
                Pay via Razorpay • ₹{totalPayable}
              </Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}
