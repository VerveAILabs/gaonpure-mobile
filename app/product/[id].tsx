import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
  Animated,
  ActivityIndicator,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import {
  ArrowLeft,
  ShoppingCart,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Plus,
  Minus,
  Check,
  MapPin,
  Leaf,
  Share2,
} from 'lucide-react-native';
import { Colors } from '@/constants/colors';
import { fetchProductById } from '@/src/api/catalog';
import { Product, Variant } from '@/src/types/catalog';
import { useCartStore, useCartCount } from '@/store/useCartStore';

const { width } = Dimensions.get('window');

export default function ProductDetailScreen(): React.JSX.Element {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const cartCount = useCartCount();
  const addItem = useCartStore((state) => state.addItem);

  const [product, setProduct] = useState<Product | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number>(0);
  const [quantity, setQuantity] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(true);

  // Animated toast state
  const [showToast, setShowToast] = useState<boolean>(false);
  const toastAnim = useRef(new Animated.Value(-100)).current;

  useEffect(() => {
    async function loadProduct() {
      if (!id) return;
      try {
        const data = await fetchProductById(id);
        if (data) {
          setProduct(data);
          if (data.variants && data.variants.length > 0) {
            setSelectedVariant(data.variants[0] || null);
          }
        }
      } catch (err) {
        console.warn('[ProductDetail] Failed to load product:', err);
      } finally {
        setLoading(false);
      }
    }
    loadProduct();
  }, [id]);

  const triggerToast = () => {
    setShowToast(true);
    Animated.sequence([
      Animated.timing(toastAnim, {
        toValue: 20,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.delay(2000),
      Animated.timing(toastAnim, {
        toValue: -100,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setShowToast(false);
    });
  };

  const handleAddToCart = () => {
    if (!product || !selectedVariant || selectedVariant.stock <= 0) return;
    addItem(product, selectedVariant, quantity);
    triggerToast();
  };

  if (loading) {
    return (
      <View className="flex-1 bg-cream-200 items-center justify-center">
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text className="text-muted-500 font-medium text-xs mt-3">
          Loading farm harvest...
        </Text>
      </View>
    );
  }

  if (!product || !selectedVariant) {
    return (
      <View className="flex-1 bg-cream-200 items-center justify-center p-6">
        <AlertCircle size={48} color={Colors.text.muted} />
        <Text className="text-charcoal-500 font-bold text-lg mt-3">Product Not Found</Text>
        <Text className="text-muted-500 text-xs text-center mt-1">
          This product may have been moved or is currently unavailable.
        </Text>
        <TouchableOpacity
          onPress={() => router.back()}
          className="mt-6 bg-forest-600 px-6 py-3 rounded-xl shadow"
        >
          <Text className="text-white font-bold text-sm">Return to Catalog</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const galleryImages = product.images && product.images.length > 0
    ? product.images
    : [product.imageUrl];

  const isOutOfStock = selectedVariant.stock <= 0;
  const discountPercent = selectedVariant.originalPrice
    ? Math.round(
        ((selectedVariant.originalPrice - selectedVariant.price) /
          selectedVariant.originalPrice) *
          100
      )
    : 0;

  return (
    <View className="flex-1 bg-cream-200">
      {/* Animated Confirmation Toast */}
      {showToast && (
        <Animated.View
          style={{
            transform: [{ translateY: toastAnim }],
            position: 'absolute',
            top: 40,
            left: 20,
            right: 20,
            zIndex: 999,
          }}
          className="bg-forest-700 p-4 rounded-2xl flex-row items-center justify-between shadow-xl border border-forest-500"
        >
          <View className="flex-row items-center flex-1 mr-2">
            <View className="w-8 h-8 rounded-full bg-forest-500 items-center justify-center mr-3">
              <Check size={18} color="#FFFFFF" strokeWidth={3} />
            </View>
            <View className="flex-1">
              <Text className="text-white font-bold text-sm">Added to Cart!</Text>
              <Text className="text-forest-100 text-xs" numberOfLines={1}>
                {quantity}x {product.title} ({selectedVariant.weight})
              </Text>
            </View>
          </View>
          <TouchableOpacity
            onPress={() => router.push('/(tabs)/cart')}
            className="bg-amber-500 px-3 py-1.5 rounded-lg shadow-xs"
          >
            <Text className="text-forest-900 font-bold text-xs">View Cart</Text>
          </TouchableOpacity>
        </Animated.View>
      )}

      {/* Custom Sticky Header */}
      <View className="pt-12 px-4 pb-3 bg-white/90 border-b border-muted-200 flex-row items-center justify-between z-10">
        <TouchableOpacity
          onPress={() => router.back()}
          className="w-10 h-10 rounded-full bg-cream-100 items-center justify-center border border-muted-200"
        >
          <ArrowLeft size={20} color={Colors.primary} />
        </TouchableOpacity>

        <Text
          className="text-charcoal-500 font-bold text-sm flex-1 mx-3 text-center"
          numberOfLines={1}
        >
          {product.title}
        </Text>

        <View className="flex-row items-center">
          <TouchableOpacity
            onPress={() => router.push('/(tabs)/cart')}
            className="w-10 h-10 rounded-full bg-cream-100 items-center justify-center border border-muted-200 relative"
          >
            <ShoppingCart size={18} color={Colors.primary} />
            {cartCount > 0 && (
              <View className="absolute -top-1 -right-1 bg-amber-500 min-w-[18px] h-[18px] rounded-full items-center justify-center px-1">
                <Text className="text-white font-bold text-[10px]">{cartCount}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 110 }}
      >
        {/* Gallery Hero Banner */}
        <View className="bg-white pb-4 border-b border-muted-200">
          <Image
            source={{ uri: galleryImages[selectedImageIndex] }}
            style={{ width: width, height: width * 0.78 }}
            resizeMode="cover"
            className="bg-cream-200"
          />

          {/* Thumbnail strip */}
          {galleryImages.length > 1 && (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingHorizontal: 16, marginTop: 12 }}
            >
              {galleryImages.map((img, idx) => (
                <TouchableOpacity
                  key={idx}
                  activeOpacity={0.8}
                  onPress={() => setSelectedImageIndex(idx)}
                  className={`mr-2.5 rounded-xl overflow-hidden border-2 ${
                    selectedImageIndex === idx
                      ? 'border-forest-600'
                      : 'border-muted-200 opacity-60'
                  }`}
                >
                  <Image
                    source={{ uri: img }}
                    style={{ width: 56, height: 56 }}
                    resizeMode="cover"
                  />
                </TouchableOpacity>
              ))}
            </ScrollView>
          )}
        </View>

        {/* Product Details Section */}
        <View className="p-4">
          {/* Category & Origin Tags */}
          <View className="flex-row items-center justify-between mb-2">
            <View className="flex-row items-center">
              <View className="bg-forest-50 border border-forest-100 px-2.5 py-1 rounded-full mr-2">
                <Text className="text-forest-700 font-bold text-[11px] uppercase tracking-wide">
                  {product.category}
                </Text>
              </View>
              {product.organic && (
                <View className="bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-full flex-row items-center">
                  <Sparkles size={11} color={Colors.secondaryDark} />
                  <Text className="text-amber-800 font-bold text-[11px] ml-1">100% PURE</Text>
                </View>
              )}
            </View>

            {product.origin && (
              <View className="flex-row items-center">
                <MapPin size={12} color={Colors.text.muted} />
                <Text className="text-muted-500 text-xs font-medium ml-1">
                  {product.origin}
                </Text>
              </View>
            )}
          </View>

          {/* Title */}
          <Text className="text-charcoal-500 font-black text-xl leading-7">
            {product.title}
          </Text>

          {/* Dynamic Price Display */}
          <View className="flex-row items-baseline mt-3">
            <Text className="text-forest-600 font-black text-3xl">
              ₹{selectedVariant.price}
            </Text>
            {selectedVariant.originalPrice && (
              <>
                <Text className="text-muted-400 line-through text-base ml-2.5 font-medium">
                  ₹{selectedVariant.originalPrice}
                </Text>
                <View className="bg-red-50 border border-red-200 px-2 py-0.5 rounded-md ml-2.5">
                  <Text className="text-red-700 font-extrabold text-xs">
                    {discountPercent}% OFF
                  </Text>
                </View>
              </>
            )}
            <Text className="text-muted-500 text-xs ml-auto font-medium">
              Inclusive of all taxes
            </Text>
          </View>

          {/* Stock Status Badge */}
          <View className="mt-3">
            {isOutOfStock ? (
              <View className="bg-red-50 border border-red-200 rounded-xl px-3 py-2 flex-row items-center">
                <AlertCircle size={15} color="#DC2626" />
                <Text className="text-red-700 font-bold text-xs ml-1.5">
                  Out of Stock for {selectedVariant.weight}
                </Text>
              </View>
            ) : (
              <View className="bg-forest-50 border border-forest-100 rounded-xl px-3 py-2 flex-row items-center">
                <CheckCircle2 size={15} color={Colors.primary} />
                <Text className="text-forest-700 font-bold text-xs ml-1.5">
                  In Stock ({selectedVariant.stock} units available at farm)
                </Text>
              </View>
            )}
          </View>

          {/* Weight / Variant Selector (Radio Pills) */}
          <View className="mt-6 bg-white rounded-3xl p-4 border border-muted-200 shadow-sm">
            <Text className="text-charcoal-500 font-extrabold text-sm mb-3 uppercase tracking-wider">
              Select Package Size (Weight)
            </Text>

            <View className="flex-row flex-wrap gap-2.5">
              {product.variants.map((variant) => {
                const isSelected = selectedVariant.id === variant.id;
                const isVariantOut = variant.stock <= 0;

                return (
                  <TouchableOpacity
                    key={variant.id}
                    activeOpacity={0.8}
                    onPress={() => setSelectedVariant(variant)}
                    className={`flex-row items-center justify-between px-4 py-3 rounded-2xl border-2 mb-2 ${
                      isSelected
                        ? 'border-forest-600 bg-forest-50/50 shadow-xs'
                        : isVariantOut
                        ? 'border-muted-200 bg-cream-100 opacity-60'
                        : 'border-muted-200 bg-white'
                    }`}
                    style={{ minWidth: '47%' }}
                  >
                    <View>
                      <Text
                        className={`font-black text-sm ${
                          isSelected ? 'text-forest-600' : 'text-charcoal-500'
                        }`}
                      >
                        {variant.weight}
                      </Text>
                      <Text
                        className={`text-xs mt-0.5 font-bold ${
                          isSelected ? 'text-forest-700' : 'text-muted-500'
                        }`}
                      >
                        ₹{variant.price}
                      </Text>
                    </View>

                    {isSelected ? (
                      <View className="w-5 h-5 rounded-full bg-forest-600 items-center justify-center ml-2">
                        <Check size={12} color="#FFFFFF" strokeWidth={3} />
                      </View>
                    ) : isVariantOut ? (
                      <Text className="text-red-500 text-[10px] font-bold">Sold Out</Text>
                    ) : (
                      <View className="w-5 h-5 rounded-full border border-muted-300" />
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* Description */}
          <View className="mt-4 bg-white rounded-3xl p-5 border border-muted-200 shadow-sm">
            <Text className="text-charcoal-500 font-extrabold text-base mb-2">
              About This Farm Harvest
            </Text>
            <Text className="text-charcoal-500 text-sm leading-6">
              {product.description}
            </Text>
          </View>

          {/* Benefits List */}
          {product.benefits && product.benefits.length > 0 && (
            <View className="mt-4 bg-white rounded-3xl p-5 border border-muted-200 shadow-sm">
              <Text className="text-charcoal-500 font-extrabold text-base mb-3">
                Why Choose Gaon Pure?
              </Text>
              {product.benefits.map((benefit, index) => (
                <View key={index} className="flex-row items-center mb-2.5">
                  <View className="w-5 h-5 rounded-full bg-forest-50 items-center justify-center mr-2.5">
                    <Leaf size={12} color={Colors.primary} />
                  </View>
                  <Text className="text-charcoal-500 text-xs font-semibold flex-1">
                    {benefit}
                  </Text>
                </View>
              ))}
            </View>
          )}

          {/* Trust Guarantees */}
          <View className="mt-4 bg-forest-600 rounded-3xl p-5 shadow-sm">
            <View className="flex-row items-center mb-2">
              <ShieldCheck size={20} color="#D4A373" />
              <Text className="text-white font-extrabold text-sm ml-2">
                100% Gaon Pure Farm Guarantee
              </Text>
            </View>
            <Text className="text-forest-100 text-xs leading-5">
              Directly harvested and stone-processed at village mills. Zero adulteration, zero artificial preservatives, packed in eco-friendly protective bags.
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Sticky Action Bar */}
      <View className="absolute bottom-0 left-0 right-0 bg-white px-5 pt-3.5 pb-8 border-t border-muted-200 shadow-2xl flex-row items-center justify-between">
        {/* Quantity Selector */}
        <View className="flex-row items-center bg-cream-200 rounded-2xl border border-muted-300 px-2 py-1 mr-4">
          <TouchableOpacity
            onPress={() => setQuantity((q) => Math.max(1, q - 1))}
            disabled={isOutOfStock || quantity <= 1}
            className="w-8 h-8 items-center justify-center rounded-lg"
          >
            <Minus size={16} color={quantity > 1 ? Colors.primary : Colors.text.muted} />
          </TouchableOpacity>
          <Text className="text-charcoal-500 font-black text-sm px-3 min-w-[24px] text-center">
            {quantity}
          </Text>
          <TouchableOpacity
            onPress={() => setQuantity((q) => q + 1)}
            disabled={isOutOfStock || quantity >= selectedVariant.stock}
            className="w-8 h-8 items-center justify-center rounded-lg"
          >
            <Plus size={16} color={!isOutOfStock ? Colors.primary : Colors.text.muted} />
          </TouchableOpacity>
        </View>

        {/* Dynamic Add to Cart / Out of Stock Button */}
        <TouchableOpacity
          activeOpacity={0.85}
          disabled={isOutOfStock}
          onPress={handleAddToCart}
          className={`flex-1 flex-row items-center justify-center py-4 rounded-2xl shadow-md ${
            isOutOfStock ? 'bg-muted-300' : 'bg-forest-600'
          }`}
        >
          {isOutOfStock ? (
            <Text className="text-muted-500 font-bold text-sm">Out of Stock</Text>
          ) : (
            <>
              <ShoppingCart size={18} color="#FFFFFF" style={{ marginRight: 8 }} />
              <Text className="text-white font-black text-sm">
                Add to Cart • ₹{selectedVariant.price * quantity}
              </Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}
