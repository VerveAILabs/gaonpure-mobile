import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  RefreshControl,
  TextInput,
  Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import {
  Search,
  Sparkles,
  Leaf,
  ShieldCheck,
  Truck,
  ChevronRight,
  PackageCheck,
  Wheat,
  Star,
  X,
} from 'lucide-react-native';
import { Colors } from '@/constants/colors';
import { fetchCatalog, CATEGORIES_LIST } from '@/src/api/catalog';
import { Product } from '@/src/types/catalog';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 44) / 2;

export default function CatalogScreen(): React.JSX.Element {
  const router = useRouter();

  const [products, setProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  const loadData = useCallback(async () => {
    try {
      const data = await fetchCatalog();
      setProducts(data);
    } catch (err) {
      console.warn('[CatalogScreen] Error loading catalog:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const onRefresh = () => {
    setRefreshing(true);
    loadData();
  };

  // Filter products by category and search query
  const filteredProducts = products.filter((product) => {
    const matchesCategory =
      selectedCategory === 'All' || product.category.toLowerCase() === selectedCategory.toLowerCase();
    const matchesSearch =
      searchQuery.trim() === '' ||
      product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <ScrollView
      className="flex-1 bg-cream-200"
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          tintColor={Colors.primary}
          colors={[Colors.primary, Colors.secondary]}
        />
      }
      contentContainerStyle={{ paddingBottom: 40 }}
    >
      {/* Search Bar */}
      <View className="px-4 pt-4 pb-2">
        <View className="flex-row items-center bg-white rounded-2xl px-4 py-3 border border-muted-200 shadow-sm">
          <Search size={18} color={Colors.text.muted} />
          <TextInput
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search multigrain atta, millets, cold-pressed oils..."
            placeholderTextColor={Colors.text.light}
            className="flex-1 ml-2.5 text-charcoal-500 text-sm font-medium p-0"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')} className="p-1">
              <X size={16} color={Colors.text.muted} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Top Banner: Farm-Fresh Flours & Grains */}
      <View className="mx-4 mt-2 bg-forest-600 rounded-3xl p-5 overflow-hidden shadow-sm relative">
        <View className="flex-row items-center">
          <View className="bg-amber-500/20 px-3 py-1 rounded-full flex-row items-center border border-amber-400/30">
            <Wheat size={13} color={Colors.secondary} />
            <Text className="text-amber-300 text-[11px] font-bold ml-1.5 uppercase tracking-wide">
              Stone-Ground & Unpolished
            </Text>
          </View>
        </View>

        <Text className="text-white text-2xl font-black mt-2.5 leading-7">
          Organic Farm-Fresh Flours & Ancient Grains
        </Text>

        <Text className="text-forest-100 text-xs mt-1.5 leading-4.5">
          Slow-milled on traditional stone chakkis to preserve live bran, fibers, and rich native flavors.
        </Text>

        {/* Feature Badges */}
        <View className="flex-row items-center justify-between mt-4 pt-3.5 border-t border-forest-500/60">
          <View className="flex-row items-center">
            <Leaf size={13} color="#A3D7BB" />
            <Text className="text-forest-100 text-[11px] font-medium ml-1">100% Organic</Text>
          </View>
          <View className="flex-row items-center">
            <ShieldCheck size={13} color="#A3D7BB" />
            <Text className="text-forest-100 text-[11px] font-medium ml-1">Lab Certified</Text>
          </View>
          <View className="flex-row items-center">
            <Truck size={13} color="#A3D7BB" />
            <Text className="text-forest-100 text-[11px] font-medium ml-1">Direct Farm Dispatch</Text>
          </View>
        </View>
      </View>

      {/* Category Pills Filters */}
      <View className="mt-5">
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 16 }}
        >
          {CATEGORIES_LIST.map((cat) => {
            const isSelected = selectedCategory.toLowerCase() === cat.toLowerCase();
            return (
              <TouchableOpacity
                key={cat}
                activeOpacity={0.75}
                onPress={() => setSelectedCategory(cat)}
                className={`mr-2.5 px-4 py-2.5 rounded-2xl border ${
                  isSelected
                    ? 'bg-forest-600 border-forest-600 shadow-sm'
                    : 'bg-white border-muted-200'
                }`}
              >
                <Text
                  className={`text-xs font-bold ${
                    isSelected ? 'text-white' : 'text-charcoal-500'
                  }`}
                >
                  {cat}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Products Section Header */}
      <View className="mt-6 px-4 flex-row items-center justify-between">
        <View>
          <Text className="text-charcoal-500 font-extrabold text-lg">
            {selectedCategory === 'All' ? 'All Farm Products' : selectedCategory}
          </Text>
          <Text className="text-muted-500 text-xs">
            {filteredProducts.length} {filteredProducts.length === 1 ? 'item available' : 'items available'}
          </Text>
        </View>
      </View>

      {/* Skeletons Loading View */}
      {loading ? (
        <View className="flex-row flex-wrap justify-between px-4 mt-4">
          {[1, 2, 3, 4].map((n) => (
            <View
              key={n}
              style={{ width: CARD_WIDTH }}
              className="bg-white rounded-3xl p-3.5 mb-4 border border-muted-200"
            >
              <View className="w-full h-36 rounded-2xl bg-cream-300 animate-pulse" />
              <View className="w-16 h-4 bg-muted-100 rounded-md mt-3" />
              <View className="w-full h-5 bg-muted-100 rounded-md mt-2" />
              <View className="w-24 h-4 bg-muted-100 rounded-md mt-2" />
              <View className="w-full h-9 bg-cream-300 rounded-xl mt-3.5" />
            </View>
          ))}
        </View>
      ) : filteredProducts.length === 0 ? (
        /* Empty State */
        <View className="mx-4 mt-6 bg-white rounded-3xl p-8 items-center border border-muted-200 shadow-sm">
          <PackageCheck size={44} color={Colors.text.muted} />
          <Text className="text-charcoal-500 font-bold text-base mt-3">No products match your search</Text>
          <Text className="text-muted-500 text-xs text-center mt-1">
            Try searching for a different item or resetting the category filter.
          </Text>
          <TouchableOpacity
            onPress={() => {
              setSelectedCategory('All');
              setSearchQuery('');
            }}
            className="mt-4 bg-forest-50 px-4 py-2 rounded-xl border border-forest-100"
          >
            <Text className="text-forest-600 font-bold text-xs">Clear Filters</Text>
          </TouchableOpacity>
        </View>
      ) : (
        /* 2-Column Responsive Product Grid */
        <View className="flex-row flex-wrap justify-between px-4 mt-4">
          {filteredProducts.map((product) => {
            // Find starting minimum price across variants
            const prices = product.variants.map((v) => v.price);
            const minPrice = prices.length > 0 ? Math.min(...prices) : 0;
            const variantCount = product.variants.length;

            return (
              <TouchableOpacity
                key={product.id}
                activeOpacity={0.9}
                onPress={() => router.push(`/product/${product.id}`)}
                style={{ width: CARD_WIDTH }}
                className="bg-white rounded-3xl p-3.5 mb-4 border border-muted-200 shadow-sm justify-between"
              >
                <View>
                  {/* Image Container with Badge */}
                  <View className="relative">
                    <Image
                      source={{ uri: product.imageUrl }}
                      className="w-full h-36 rounded-2xl bg-cream-200"
                      resizeMode="cover"
                    />

                    {/* Organic Tag */}
                    {product.organic && (
                      <View className="absolute top-2 left-2 bg-forest-600/95 px-2 py-0.5 rounded-lg shadow-sm flex-row items-center">
                        <Sparkles size={10} color="#FFFFFF" />
                        <Text className="text-white text-[9px] font-extrabold ml-1">PURE</Text>
                      </View>
                    )}

                    {/* Variant Count Tag */}
                    <View className="absolute bottom-2 right-2 bg-charcoal-500/80 px-2 py-0.5 rounded-lg">
                      <Text className="text-white text-[10px] font-bold">
                        {variantCount} {variantCount === 1 ? 'Size' : 'Sizes'}
                      </Text>
                    </View>
                  </View>

                  {/* Rating & Category */}
                  <View className="flex-row items-center justify-between mt-2.5">
                    <Text className="text-muted-500 text-[10px] font-semibold uppercase tracking-wider">
                      {product.category}
                    </Text>
                    {product.rating && (
                      <View className="flex-row items-center">
                        <Star size={11} color="#E2B88E" fill="#E2B88E" />
                        <Text className="text-charcoal-500 text-[11px] font-bold ml-1">
                          {product.rating}
                        </Text>
                      </View>
                    )}
                  </View>

                  {/* Product Title */}
                  <Text
                    className="text-charcoal-500 font-bold text-sm mt-1 leading-4.5"
                    numberOfLines={2}
                  >
                    {product.title}
                  </Text>
                </View>

                {/* Price & Action Button */}
                <View className="mt-3 pt-2.5 border-t border-muted-100">
                  <View className="mb-2">
                    <Text className="text-muted-400 text-[10px] font-medium">Starting from</Text>
                    <Text className="text-forest-600 font-black text-base">
                      From ₹{minPrice}
                    </Text>
                  </View>

                  <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => router.push(`/product/${product.id}`)}
                    className="bg-forest-600 py-2.5 rounded-xl flex-row items-center justify-center shadow-xs"
                  >
                    <Text className="text-white font-bold text-xs mr-1">Select Pack</Text>
                    <ChevronRight size={13} color="#FFFFFF" strokeWidth={2.5} />
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      )}
    </ScrollView>
  );
}
