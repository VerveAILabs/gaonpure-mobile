import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Linking,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import {
  ArrowLeft,
  CheckCircle2,
  Circle,
  Truck,
  Package,
  MapPin,
  CreditCard,
  Copy,
  ExternalLink,
  Phone,
  ShieldCheck,
  AlertCircle,
  Clock,
  Sparkles,
  HelpCircle,
} from 'lucide-react-native';
import { Colors } from '@/constants/colors';
import { fetchOrderById, OrderRecord } from '@/src/api/orders';

export default function OrderTrackingScreen(): React.JSX.Element {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  const [order, setOrder] = useState<OrderRecord | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [copiedAWB, setCopiedAWB] = useState<boolean>(false);

  useEffect(() => {
    async function loadOrder() {
      if (!id) return;
      try {
        const data = await fetchOrderById(id);
        if (data) {
          setOrder(data);
        }
      } catch (err) {
        console.warn('[OrderTrackingScreen] Failed to load order:', err);
      } finally {
        setLoading(false);
      }
    }
    loadOrder();
  }, [id]);

  if (loading) {
    return (
      <View className="flex-1 bg-cream-200 items-center justify-center">
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text className="text-muted-500 font-medium text-xs mt-3">
          Loading shipment status...
        </Text>
      </View>
    );
  }

  if (!order) {
    return (
      <View className="flex-1 bg-cream-200 items-center justify-center p-6">
        <AlertCircle size={48} color={Colors.text.muted} />
        <Text className="text-charcoal-500 font-bold text-lg mt-3">Order Not Found</Text>
        <Text className="text-muted-500 text-xs text-center mt-1">
          We could not locate this order reference.
        </Text>
        <TouchableOpacity
          onPress={() => router.back()}
          className="mt-6 bg-forest-600 px-6 py-3 rounded-xl shadow"
        >
          <Text className="text-white font-bold text-sm">Return to Orders</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const handleCopyAWB = () => {
    setCopiedAWB(true);
    setTimeout(() => setCopiedAWB(false), 2000);
  };

  const handleSupportWhatsApp = () => {
    const text = encodeURIComponent(
      `Hello Gaon Pure Support! I have a question regarding my Order #${order.orderNumber}.`
    );
    Linking.openURL(`https://wa.me/919876543210?text=${text}`).catch(() => {});
  };

  return (
    <View className="flex-1 bg-cream-200">
      {/* Header */}
      <View className="pt-12 px-4 pb-3.5 bg-white border-b border-muted-200 flex-row items-center justify-between shadow-xs z-10">
        <TouchableOpacity
          onPress={() => router.back()}
          className="w-10 h-10 rounded-full bg-cream-100 items-center justify-center border border-muted-200"
        >
          <ArrowLeft size={20} color={Colors.primary} />
        </TouchableOpacity>

        <View className="items-center">
          <Text className="text-charcoal-500 font-extrabold text-sm">
            Shipment Tracking
          </Text>
          <Text className="text-forest-600 text-xs font-bold mt-0.5">
            #{order.orderNumber}
          </Text>
        </View>

        <TouchableOpacity
          onPress={handleSupportWhatsApp}
          className="w-10 h-10 rounded-full bg-cream-100 items-center justify-center border border-muted-200"
        >
          <HelpCircle size={18} color={Colors.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView
        className="flex-1 px-4 pt-4"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        {/* Top Shipment Status Hero */}
        <View className="bg-forest-600 rounded-3xl p-5 mb-4 shadow-sm">
          <View className="flex-row items-center justify-between">
            <View className="bg-amber-500/20 px-3 py-1 rounded-full flex-row items-center border border-amber-400/30">
              <Truck size={13} color={Colors.secondary} />
              <Text className="text-amber-300 text-[11px] font-bold ml-1.5 uppercase">
                {order.status === 'delivered' ? 'Delivered' : 'In Transit via Shiprocket'}
              </Text>
            </View>
            <Text className="text-forest-100 text-xs font-medium">
              {order.createdAt.split(',')[0]}
            </Text>
          </View>

          <Text className="text-white text-xl font-black mt-3">
            {order.status === 'delivered'
              ? 'Delivered to Doorstep 🏡'
              : 'On the Way to You 🚚'}
          </Text>

          {order.estimatedDelivery && (
            <Text className="text-forest-100 text-xs mt-1">
              Estimated: <Text className="text-white font-bold">{order.estimatedDelivery}</Text>
            </Text>
          )}

          {/* Courier & AWB Box */}
          {order.trackingNumber && (
            <View className="mt-4 pt-3 border-t border-forest-500/60 flex-row items-center justify-between">
              <View>
                <Text className="text-forest-200 text-[10px] font-medium">Courier & AWB</Text>
                <Text className="text-white font-bold text-xs mt-0.5">
                  {order.courierName || 'Shiprocket Partner'}
                </Text>
                <Text className="text-amber-300 font-mono text-xs mt-0.5">
                  {order.trackingNumber}
                </Text>
              </View>

              <TouchableOpacity
                onPress={handleCopyAWB}
                className="bg-forest-700/80 px-3 py-1.5 rounded-xl border border-forest-400/40 flex-row items-center"
              >
                <Copy size={13} color="#FFFFFF" />
                <Text className="text-white font-bold text-xs ml-1.5">
                  {copiedAWB ? 'Copied!' : 'Copy AWB'}
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Section 1: Vertical Timeline Stepper */}
        <View className="bg-white rounded-3xl p-5 border border-muted-200 shadow-sm mb-4">
          <Text className="text-charcoal-500 font-black text-base mb-4">
            Live Journey Status
          </Text>

          <View className="pl-1">
            {order.timeline.map((step, index) => {
              const isLast = index === order.timeline.length - 1;

              return (
                <View key={step.title} className="flex-row items-start">
                  {/* Stepper Bullet & Connector line */}
                  <View className="items-center mr-3.5">
                    {step.completed ? (
                      <View className="w-7 h-7 rounded-full bg-forest-600 items-center justify-center shadow-xs">
                        <CheckCircle2 size={16} color="#FFFFFF" />
                      </View>
                    ) : step.current ? (
                      <View className="w-7 h-7 rounded-full bg-amber-500 items-center justify-center animate-pulse">
                        <Truck size={14} color="#FFFFFF" />
                      </View>
                    ) : (
                      <View className="w-7 h-7 rounded-full bg-cream-100 border-2 border-muted-300 items-center justify-center">
                        <Circle size={10} color={Colors.text.muted} />
                      </View>
                    )}

                    {!isLast && (
                      <View
                        className={`w-0.5 h-12 my-1 ${
                          step.completed ? 'bg-forest-600' : 'bg-muted-200'
                        }`}
                      />
                    )}
                  </View>

                  {/* Stepper Content */}
                  <View className="flex-1 pb-4">
                    <View className="flex-row justify-between items-start">
                      <Text
                        className={`font-bold text-sm ${
                          step.completed || step.current
                            ? 'text-charcoal-500'
                            : 'text-muted-400'
                        }`}
                      >
                        {step.title}
                      </Text>
                      {step.timestamp && (
                        <Text className="text-muted-400 text-[10px] font-medium ml-2">
                          {step.timestamp}
                        </Text>
                      )}
                    </View>
                    <Text
                      className={`text-xs mt-0.5 leading-4 ${
                        step.completed || step.current
                          ? 'text-muted-500'
                          : 'text-muted-400'
                      }`}
                    >
                      {step.description}
                    </Text>
                  </View>
                </View>
              );
            })}
          </View>
        </View>

        {/* Section 2: Full Delivery Address */}
        <View className="bg-white rounded-3xl p-5 border border-muted-200 shadow-sm mb-4">
          <View className="flex-row items-center mb-3">
            <View className="w-7 h-7 rounded-full bg-forest-50 items-center justify-center mr-2.5">
              <MapPin size={15} color={Colors.primary} />
            </View>
            <Text className="text-charcoal-500 font-black text-base">
              Delivery Destination
            </Text>
          </View>

          <View className="bg-cream-100 p-4 rounded-2xl border border-muted-200">
            <Text className="text-charcoal-500 font-bold text-sm">
              {order.deliveryAddress.fullName}
            </Text>
            <Text className="text-muted-500 text-xs mt-1">
              {order.deliveryAddress.street}
            </Text>
            <Text className="text-muted-500 text-xs">
              {order.deliveryAddress.city}, {order.deliveryAddress.state} -{' '}
              <Text className="font-bold text-charcoal-500">
                {order.deliveryAddress.pincode}
              </Text>
            </Text>
            <Text className="text-forest-700 font-semibold text-xs mt-2">
              Phone: {order.deliveryAddress.phone}
            </Text>
          </View>
        </View>

        {/* Section 3: Ordered Items Breakdown */}
        <View className="bg-white rounded-3xl p-5 border border-muted-200 shadow-sm mb-4">
          <Text className="text-charcoal-500 font-black text-base mb-3">
            Items in this Shipment ({order.items.length})
          </Text>

          {order.items.map((item) => (
            <View
              key={item.id}
              className="flex-row items-center py-2.5 border-b border-muted-100"
            >
              <Image
                source={{ uri: item.imageUrl }}
                className="w-14 h-14 rounded-2xl bg-cream-200"
                resizeMode="cover"
              />
              <View className="flex-1 ml-3.5">
                <Text className="text-charcoal-500 font-bold text-xs" numberOfLines={1}>
                  {item.title}
                </Text>
                <View className="flex-row items-center mt-1">
                  <View className="bg-cream-100 px-2 py-0.5 rounded border border-muted-200 mr-2">
                    <Text className="text-forest-700 font-bold text-[10px]">
                      {item.variantWeight}
                    </Text>
                  </View>
                  <Text className="text-muted-500 text-xs">
                    Qty: {item.quantity} × ₹{item.price}
                  </Text>
                </View>
              </View>
              <Text className="text-forest-600 font-black text-sm">
                ₹{item.price * item.quantity}
              </Text>
            </View>
          ))}

          {/* Bill Summary */}
          <View className="pt-3">
            <View className="flex-row justify-between mb-1.5">
              <Text className="text-muted-500 text-xs">Subtotal</Text>
              <Text className="text-charcoal-500 font-semibold text-xs">
                ₹{order.subtotal}
              </Text>
            </View>
            <View className="flex-row justify-between mb-1.5">
              <Text className="text-muted-500 text-xs">Delivery Fee</Text>
              <Text className="text-charcoal-500 font-semibold text-xs">
                {order.deliveryFee === 0 ? 'FREE' : `₹${order.deliveryFee}`}
              </Text>
            </View>
            <View className="h-[1px] bg-muted-100 my-2" />
            <View className="flex-row justify-between items-center">
              <Text className="text-charcoal-500 font-black text-sm">Total Paid</Text>
              <Text className="text-forest-600 font-black text-lg">
                ₹{order.totalAmount}
              </Text>
            </View>
          </View>
        </View>

        {/* WhatsApp Customer Support Help */}
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={handleSupportWhatsApp}
          className="bg-white border border-forest-200 rounded-3xl p-4 flex-row items-center justify-between shadow-xs mb-4"
        >
          <View className="flex-row items-center flex-1 mr-2">
            <View className="w-10 h-10 rounded-2xl bg-forest-50 items-center justify-center mr-3">
              <HelpCircle size={20} color={Colors.primary} />
            </View>
            <View className="flex-1">
              <Text className="text-charcoal-500 font-bold text-xs">
                Need Help with this Shipment?
              </Text>
              <Text className="text-muted-500 text-[11px] mt-0.5">
                Chat with Gaon Pure customer care on WhatsApp
              </Text>
            </View>
          </View>
          <ExternalLink size={16} color={Colors.primary} />
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}
