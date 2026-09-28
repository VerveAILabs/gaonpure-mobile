import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import {
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  ArrowRight,
  ShieldCheck,
  Truck,
  MapPin,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Scale,
} from 'lucide-react-native';
import { Colors } from '@/constants/colors';
import {
  useCartStore,
  useCartSubtotal,
  useCartTotalWeight,
} from '@/src/store/cartStore';
import { estimateShipping } from '@/src/api/shipping';

export default function CartScreen(): React.JSX.Element {
  const router = useRouter();

  const {
    items,
    updateQuantity,
    removeItem,
    clearCart,
    pincode,
    setPincode,
    shippingEstimate,
    setShippingEstimate,
  } = useCartStore();

  const subtotal = useCartSubtotal();
  const totalWeight = useCartTotalWeight();

  const [inputPincode, setInputPincode] = useState<string>(pincode || '560102');
  const [checkingShipping, setCheckingShipping] = useState<boolean>(false);
  const [shippingError, setShippingError] = useState<string | null>(null);

  // Check shipping estimate on mount or when weight/pincode changes
  const handleCheckShipping = async (codeToCheck = inputPincode): Promise<void> => {
    const cleanCode = codeToCheck.replace(/\D/g, '');
    if (cleanCode.length !== 6) {
      setShippingError('Please enter a valid 6-digit postal code.');
      setShippingEstimate(null);
      return;
    }

    setCheckingShipping(true);
    setShippingError(null);

    try {
      const result = await estimateShipping({
        pincode: cleanCode,
        weight: totalWeight > 0 ? totalWeight : 500,
      });

      setPincode(cleanCode);
      setShippingEstimate(result);

      if (!result.serviceable) {
        setShippingError(result.message || 'Not serviceable to this pincode');
      }
    } catch {
      setShippingError('Unable to estimate shipping. Please try again.');
      setShippingEstimate(null);
    } finally {
      setCheckingShipping(false);
    }
  };

  useEffect(() => {
    if (items.length > 0 && (!shippingEstimate || shippingEstimate.serviceable)) {
      handleCheckShipping(inputPincode);
    }
  }, [items.length, totalWeight]);

  // Shipping fee calculation: FREE if subtotal > ₹999, else from Shiprocket API (default 50)
  const isFreeDeliveryEligible = subtotal >= 999;
  const rawDeliveryFee = shippingEstimate?.serviceable
    ? shippingEstimate.deliveryFee
    : 50;
  const effectiveDeliveryFee =
    subtotal === 0 || isFreeDeliveryEligible ? 0 : rawDeliveryFee;
  const totalAmount = subtotal + effectiveDeliveryFee;

  const isCheckoutDisabled =
    items.length === 0 ||
    (shippingEstimate !== null && !shippingEstimate.serviceable);

  // Empty Cart State
  if (items.length === 0) {
    return (
      <View className="flex-1 bg-cream-200 justify-center items-center px-6">
        <View className="w-24 h-24 bg-forest-50 rounded-full items-center justify-center mb-5 border border-forest-100 shadow-sm">
          <ShoppingBag size={48} color={Colors.primary} />
        </View>
        <Text className="text-charcoal-500 font-black text-2xl mb-2 text-center">
          Your Basket is Empty
        </Text>
        <Text className="text-muted-500 text-sm text-center mb-7 leading-5 max-w-[280px]">
          Fill your kitchen with fresh stone-ground flours, unpolished millets, and Vedic desi ghee.
        </Text>
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={() => router.push('/(tabs)')}
          className="bg-forest-600 px-8 py-4 rounded-2xl shadow-md flex-row items-center"
        >
          <Text className="text-white font-black text-sm mr-2">Browse Products</Text>
          <ArrowRight size={16} color="#FFFFFF" strokeWidth={2.5} />
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1 bg-cream-200"
    >
      <ScrollView
        className="flex-1 px-4 pt-3"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120 }}
      >
        {/* Header: Items count & Total weight */}
        <View className="flex-row justify-between items-center mb-3 px-1">
          <View className="flex-row items-center">
            <Text className="text-charcoal-500 font-extrabold text-base mr-2">
              {items.length} {items.length === 1 ? 'Product' : 'Products'}
            </Text>
            <View className="bg-forest-50 px-2 py-0.5 rounded-full flex-row items-center border border-forest-100">
              <Scale size={11} color={Colors.primary} />
              <Text className="text-forest-700 text-[11px] font-bold ml-1">
                {(totalWeight / 1000).toFixed(1)} kg total
              </Text>
            </View>
          </View>

          <TouchableOpacity onPress={() => clearCart()} activeOpacity={0.7}>
            <Text className="text-muted-500 text-xs font-bold">Clear All</Text>
          </TouchableOpacity>
        </View>

        {/* Cart Item Cards List */}
        {items.map((item) => (
          <View
            key={item.id}
            className="bg-white rounded-3xl p-3.5 mb-3 border border-muted-200 shadow-sm flex-row items-center"
          >
            <Image
              source={{ uri: item.product.imageUrl }}
              className="rounded-2xl bg-cream-200"
              style={{ width: 76, height: 76 }}
              resizeMode="cover"
            />

            <View className="flex-1 ml-3.5 justify-between">
              <View className="flex-row justify-between items-start">
                <View className="flex-1 mr-2">
                  <Text
                    className="text-charcoal-500 font-bold text-sm leading-4.5"
                    numberOfLines={1}
                  >
                    {item.product.title}
                  </Text>
                  <View className="flex-row items-center mt-1">
                    <View className="bg-cream-100 px-2 py-0.5 rounded-md border border-muted-200 mr-2">
                      <Text className="text-forest-700 font-extrabold text-[10px]">
                        {item.variant.weight}
                      </Text>
                    </View>
                    <Text className="text-muted-500 text-xs font-semibold">
                      ₹{item.variant.price} each
                    </Text>
                  </View>
                </View>

                <TouchableOpacity
                  onPress={() => removeItem(item.id)}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                  className="p-1"
                >
                  <Trash2 size={16} color={Colors.text.muted} />
                </TouchableOpacity>
              </View>

              <View className="flex-row justify-between items-center mt-3">
                <Text className="text-forest-600 font-black text-base">
                  ₹{item.variant.price * item.quantity}
                </Text>

                {/* Quantity Buttons */}
                <View className="flex-row items-center bg-cream-100 rounded-xl border border-muted-300 px-1 py-0.5">
                  <TouchableOpacity
                    onPress={() => updateQuantity(item.id, item.quantity - 1)}
                    className="w-7 h-7 items-center justify-center"
                  >
                    <Minus size={13} color={Colors.primary} strokeWidth={2.5} />
                  </TouchableOpacity>
                  <Text className="text-charcoal-500 font-extrabold text-xs px-2 min-w-[22px] text-center">
                    {item.quantity}
                  </Text>
                  <TouchableOpacity
                    onPress={() => updateQuantity(item.id, item.quantity + 1)}
                    className="w-7 h-7 items-center justify-center"
                  >
                    <Plus size={13} color={Colors.primary} strokeWidth={2.5} />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        ))}

        {/* Free Shipping Progress Indicator */}
        <View className="bg-white rounded-2xl p-3.5 mb-3 border border-muted-200 shadow-sm">
          {subtotal >= 999 ? (
            <View className="flex-row items-center">
              <Sparkles size={16} color={Colors.secondaryDark} />
              <Text className="text-forest-700 font-bold text-xs ml-2">
                🎉 Congratulations! You have unlocked FREE Express Delivery.
              </Text>
            </View>
          ) : (
            <View>
              <View className="flex-row justify-between items-center mb-1.5">
                <Text className="text-charcoal-500 font-bold text-xs">
                  Add ₹{999 - subtotal} more for <Text className="text-forest-600">FREE Delivery</Text>
                </Text>
                <Text className="text-muted-500 text-[11px] font-semibold">
                  {Math.round((subtotal / 999) * 100)}%
                </Text>
              </View>
              <View className="w-full h-2 bg-muted-100 rounded-full overflow-hidden">
                <View
                  style={{ width: `${Math.min(100, (subtotal / 999) * 100)}%` }}
                  className="h-full bg-amber-500 rounded-full"
                />
              </View>
            </View>
          )}
        </View>

        {/* Pincode Delivery Checker Box */}
        <View className="bg-white rounded-3xl p-4 mb-3 border border-muted-200 shadow-sm">
          <View className="flex-row items-center justify-between mb-2.5">
            <View className="flex-row items-center">
              <MapPin size={16} color={Colors.primary} />
              <Text className="text-charcoal-500 font-extrabold text-sm ml-1.5">
                Delivery Pincode & Shipping
              </Text>
            </View>
            <Text className="text-muted-400 text-[11px] font-medium">via Shiprocket</Text>
          </View>

          <View className="flex-row items-center">
            <View className="flex-1 flex-row items-center bg-cream-100 border border-muted-300 rounded-2xl px-3 py-2.5 mr-2.5">
              <Truck size={15} color={Colors.text.muted} />
              <TextInput
                value={inputPincode}
                onChangeText={(val) => {
                  setInputPincode(val.replace(/\D/g, '').slice(0, 6));
                  if (shippingError) setShippingError(null);
                }}
                placeholder="Enter 6-digit Pincode"
                placeholderTextColor={Colors.text.light}
                keyboardType="number-pad"
                maxLength={6}
                className="flex-1 ml-2 text-charcoal-500 text-sm font-bold p-0"
              />
            </View>

            <TouchableOpacity
              activeOpacity={0.8}
              disabled={checkingShipping || inputPincode.length !== 6}
              onPress={() => handleCheckShipping(inputPincode)}
              className={`px-5 py-3 rounded-2xl ${
                inputPincode.length === 6 && !checkingShipping
                  ? 'bg-forest-600'
                  : 'bg-forest-600/50'
              }`}
            >
              {checkingShipping ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <Text className="text-white font-bold text-xs">Check</Text>
              )}
            </TouchableOpacity>
          </View>

          {/* Shipping Result Feedback */}
          {shippingError ? (
            <View className="mt-3 bg-red-50 border border-red-200 rounded-xl p-3 flex-row items-center">
              <AlertCircle size={15} color="#DC2626" />
              <Text className="text-red-700 font-bold text-xs ml-2 flex-1">
                {shippingError}
              </Text>
            </View>
          ) : shippingEstimate?.serviceable ? (
            <View className="mt-3 bg-forest-50 border border-forest-100 rounded-xl p-3">
              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center flex-1 mr-2">
                  <CheckCircle2 size={15} color={Colors.primary} />
                  <Text className="text-forest-700 font-bold text-xs ml-2">
                    Delivery in {shippingEstimate.estimatedDays}
                  </Text>
                </View>
                <Text className="text-forest-700 font-black text-xs">
                  {isFreeDeliveryEligible ? 'FREE' : `₹${shippingEstimate.deliveryFee}`}
                </Text>
              </View>
              {shippingEstimate.courierName && (
                <Text className="text-muted-500 text-[10px] mt-1 ml-6">
                  Courier: {shippingEstimate.courierName}
                </Text>
              )}
            </View>
          ) : null}
        </View>

        {/* Bill Summary Breakdown */}
        <View className="bg-white rounded-3xl p-5 mb-3 border border-muted-200 shadow-sm">
          <Text className="text-charcoal-500 font-black text-base mb-3.5">
            Price Breakdown
          </Text>

          <View className="flex-row justify-between items-center mb-2.5">
            <Text className="text-muted-500 text-xs font-medium">Items Subtotal</Text>
            <Text className="text-charcoal-500 font-bold text-xs">₹{subtotal}</Text>
          </View>

          <View className="flex-row justify-between items-center mb-2.5">
            <View className="flex-row items-center">
              <Text className="text-muted-500 text-xs font-medium">Delivery Charges</Text>
              {isFreeDeliveryEligible && (
                <View className="bg-forest-50 border border-forest-100 px-1.5 py-0.2 rounded ml-2">
                  <Text className="text-forest-700 text-[9px] font-black">FREE SHIPPING</Text>
                </View>
              )}
            </View>
            <Text className="text-charcoal-500 font-bold text-xs">
              {effectiveDeliveryFee === 0 ? (
                <Text className="text-forest-600 font-black">FREE</Text>
              ) : (
                `₹${effectiveDeliveryFee}`
              )}
            </Text>
          </View>

          <View className="h-[1px] bg-muted-100 my-2" />

          <View className="flex-row justify-between items-center pt-1">
            <View>
              <Text className="text-charcoal-500 font-black text-sm">Total Payable</Text>
              <Text className="text-muted-400 text-[10px]">Inclusive of all taxes</Text>
            </View>
            <Text className="text-forest-600 font-black text-2xl">
              ₹{totalAmount}
            </Text>
          </View>
        </View>

        {/* Guarantee Banner */}
        <View className="flex-row items-center justify-center my-2">
          <ShieldCheck size={14} color={Colors.primary} />
          <Text className="text-muted-500 text-[11px] ml-1.5 font-medium">
            100% Farm Fresh Quality • Zero Preservatives
          </Text>
        </View>
      </ScrollView>

      {/* Checkout Bottom Bar */}
      <View className="absolute bottom-0 left-0 right-0 bg-white px-5 pt-3.5 pb-8 border-t border-muted-200 shadow-2xl flex-row items-center justify-between">
        <View>
          <Text className="text-muted-500 text-[11px] font-bold uppercase tracking-wider">
            Total Amount
          </Text>
          <Text className="text-forest-600 font-black text-2xl">
            ₹{totalAmount}
          </Text>
        </View>

        <TouchableOpacity
          activeOpacity={0.85}
          disabled={isCheckoutDisabled}
          onPress={() => router.push('/checkout')}
          className={`flex-row items-center px-7 py-4 rounded-2xl shadow-md ${
            isCheckoutDisabled ? 'bg-muted-300' : 'bg-forest-600'
          }`}
        >
          <Text className="text-white font-black text-sm mr-2">
            Proceed to Checkout
          </Text>
          <ArrowRight size={16} color="#FFFFFF" strokeWidth={2.5} />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}
