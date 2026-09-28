import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Animated,
  Dimensions,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import {
  CheckCircle2,
  Package,
  ArrowRight,
  Sparkles,
  MapPin,
  Calendar,
  CreditCard,
  ShieldCheck,
  ShoppingBag,
} from 'lucide-react-native';
import { Colors } from '@/constants/colors';

const { width } = Dimensions.get('window');

export default function OrderSuccessScreen(): React.JSX.Element {
  const router = useRouter();
  const params = useLocalSearchParams<{
    orderId?: string;
    amount?: string;
    paymentId?: string;
    address?: string;
    pincode?: string;
    estimatedDays?: string;
  }>();

  const scaleAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 6,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  }, [scaleAnim, fadeAnim]);

  const orderNumber = params.orderId || `GP-${Date.now().toString().slice(-6)}`;
  const paidAmount = params.amount || '0';
  const deliveryAddress = params.address || 'Flat 402, Green Meadows';
  const deliveryPincode = params.pincode || '560102';
  const estimateDays = params.estimatedDays || '2-3 business days';

  return (
    <ScrollView
      className="flex-1 bg-cream-200"
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ padding: 20, paddingTop: 60, paddingBottom: 40 }}
    >
      {/* Celebration Icon Container */}
      <View className="items-center mb-6">
        <Animated.View
          style={{
            transform: [{ scale: scaleAnim }],
          }}
          className="w-24 h-24 rounded-full bg-forest-50 border-4 border-forest-600 items-center justify-center shadow-lg mb-4"
        >
          <CheckCircle2 size={54} color={Colors.primary} strokeWidth={2.5} />
        </Animated.View>

        <Animated.View style={{ opacity: fadeAnim }} className="items-center">
          <View className="bg-amber-500/15 px-3 py-1 rounded-full flex-row items-center border border-amber-500/30 mb-2">
            <Sparkles size={13} color={Colors.secondaryDark} />
            <Text className="text-amber-800 font-extrabold text-xs ml-1.5 uppercase tracking-wide">
              Payment Successful
            </Text>
          </View>
          <Text className="text-charcoal-500 font-black text-2xl text-center">
            Order Confirmed! 🎉
          </Text>
          <Text className="text-muted-500 text-xs text-center mt-1">
            Thank you for supporting pure, chemical-free village farming.
          </Text>
        </Animated.View>
      </View>

      {/* Order Reference Card */}
      <View className="bg-white rounded-3xl p-5 border border-muted-200 shadow-sm mb-4">
        <View className="flex-row items-center justify-between pb-3.5 border-b border-muted-100">
          <View>
            <Text className="text-muted-400 text-[10px] font-bold uppercase tracking-wider">
              Order Reference
            </Text>
            <Text className="text-forest-600 font-black text-lg">
              #{orderNumber}
            </Text>
          </View>

          <View className="items-end">
            <Text className="text-muted-400 text-[10px] font-bold uppercase tracking-wider">
              Amount Paid
            </Text>
            <Text className="text-charcoal-500 font-black text-lg">
              ₹{paidAmount}
            </Text>
          </View>
        </View>

        {/* Timeline details */}
        <View className="py-3.5 space-y-3">
          <View className="flex-row items-start mb-2.5">
            <View className="w-8 h-8 rounded-xl bg-forest-50 items-center justify-center mr-3 mt-0.5">
              <Calendar size={15} color={Colors.primary} />
            </View>
            <View className="flex-1">
              <Text className="text-muted-400 text-[11px] font-medium">Estimated Delivery</Text>
              <Text className="text-charcoal-500 font-bold text-xs mt-0.5">
                Within {estimateDays} (via Shiprocket)
              </Text>
            </View>
          </View>

          <View className="flex-row items-start mb-2.5">
            <View className="w-8 h-8 rounded-xl bg-forest-50 items-center justify-center mr-3 mt-0.5">
              <MapPin size={15} color={Colors.primary} />
            </View>
            <View className="flex-1">
              <Text className="text-muted-400 text-[11px] font-medium">Shipping Address</Text>
              <Text className="text-charcoal-500 font-bold text-xs mt-0.5">
                {deliveryAddress}, Pincode: {deliveryPincode}
              </Text>
            </View>
          </View>

          <View className="flex-row items-start">
            <View className="w-8 h-8 rounded-xl bg-forest-50 items-center justify-center mr-3 mt-0.5">
              <CreditCard size={15} color={Colors.primary} />
            </View>
            <View className="flex-1">
              <Text className="text-muted-400 text-[11px] font-medium">Payment Mode</Text>
              <Text className="text-charcoal-500 font-bold text-xs mt-0.5">
                Razorpay Online (UPI/Cards)
              </Text>
            </View>
          </View>
        </View>

        {/* Purity Guarantee note */}
        <View className="mt-2 pt-3 border-t border-muted-100 flex-row items-center">
          <ShieldCheck size={14} color={Colors.primary} />
          <Text className="text-forest-700 text-[11px] font-semibold ml-1.5 flex-1">
            Your items are being freshly packed and dispatched from farm storage.
          </Text>
        </View>
      </View>

      {/* Action Buttons */}
      <TouchableOpacity
        activeOpacity={0.85}
        onPress={() => router.push('/(tabs)/orders')}
        className="bg-forest-600 py-4 rounded-2xl flex-row items-center justify-center shadow-md mb-3"
      >
        <Package size={17} color="#FFFFFF" style={{ marginRight: 8 }} />
        <Text className="text-white font-black text-sm">Track My Order</Text>
      </TouchableOpacity>

      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => router.push('/(tabs)')}
        className="bg-white border border-muted-300 py-3.5 rounded-2xl flex-row items-center justify-center shadow-sm"
      >
        <ShoppingBag size={16} color={Colors.text.primary} style={{ marginRight: 8 }} />
        <Text className="text-charcoal-500 font-bold text-sm">Continue Shopping</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
