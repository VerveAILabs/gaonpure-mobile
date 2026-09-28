import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import {
  Package,
  Clock,
  CheckCircle2,
  ChevronRight,
  Truck,
  AlertCircle,
  ShoppingBag,
  Sparkles,
} from 'lucide-react-native';
import { Colors } from '@/constants/colors';
import {
  fetchUserOrders,
  OrderRecord,
  OrderStatus,
} from '@/src/api/orders';

type OrderFilter = 'all' | 'active' | 'delivered';

export default function OrdersScreen(): React.JSX.Element {
  const router = useRouter();

  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [filter, setFilter] = useState<OrderFilter>('all');
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  const loadOrders = useCallback(async () => {
    try {
      const data = await fetchUserOrders();
      setOrders(data);
    } catch (err) {
      console.warn('[OrdersScreen] Failed to load orders:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  const onRefresh = () => {
    setRefreshing(true);
    loadOrders();
  };

  // Filter orders
  const filteredOrders = orders.filter((order) => {
    if (filter === 'active') {
      return (
        order.status === 'pending' ||
        order.status === 'processing' ||
        order.status === 'dispatched' ||
        order.status === 'in_transit' ||
        order.status === 'out_for_delivery'
      );
    }
    if (filter === 'delivered') {
      return order.status === 'delivered';
    }
    return true;
  });

  /**
   * Renders contextual status pill based on OrderStatus requirement:
   * - PENDING / PROCESSING: Yellow (#FEF3C7)
   * - DISPATCHED / IN TRANSIT: Blue (#DBEAFE)
   * - DELIVERED: Green (#D1FAE5)
   * - CANCELLED: Red (#FEE2E2)
   */
  const renderStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'delivered':
        return (
          <View
            style={{ backgroundColor: '#D1FAE5' }}
            className="px-2.5 py-1 rounded-full flex-row items-center border border-emerald-300"
          >
            <CheckCircle2 size={12} color="#065F46" />
            <Text style={{ color: '#065F46' }} className="font-extrabold text-[10px] ml-1 uppercase">
              Delivered
            </Text>
          </View>
        );

      case 'dispatched':
      case 'in_transit':
      case 'out_for_delivery':
        return (
          <View
            style={{ backgroundColor: '#DBEAFE' }}
            className="px-2.5 py-1 rounded-full flex-row items-center border border-blue-300"
          >
            <Truck size={12} color="#1E40AF" />
            <Text style={{ color: '#1E40AF' }} className="font-extrabold text-[10px] ml-1 uppercase">
              {status === 'out_for_delivery' ? 'Out for Delivery' : 'In Transit'}
            </Text>
          </View>
        );

      case 'pending':
      case 'processing':
        return (
          <View
            style={{ backgroundColor: '#FEF3C7' }}
            className="px-2.5 py-1 rounded-full flex-row items-center border border-amber-300"
          >
            <Clock size={12} color="#92400E" />
            <Text style={{ color: '#92400E' }} className="font-extrabold text-[10px] ml-1 uppercase">
              Processing
            </Text>
          </View>
        );

      case 'cancelled':
        return (
          <View
            style={{ backgroundColor: '#FEE2E2' }}
            className="px-2.5 py-1 rounded-full flex-row items-center border border-red-300"
          >
            <AlertCircle size={12} color="#991B1B" />
            <Text style={{ color: '#991B1B' }} className="font-extrabold text-[10px] ml-1 uppercase">
              Cancelled
            </Text>
          </View>
        );

      default:
        return null;
    }
  };

  return (
    <ScrollView
      className="flex-1 bg-cream-200"
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          tintColor={Colors.primary}
        />
      }
      contentContainerStyle={{ padding: 16, paddingBottom: 40 }}
    >
      {/* Segmented Control / Filter Tabs */}
      <View className="flex-row bg-white p-1 rounded-2xl border border-muted-200 mb-4 shadow-xs">
        {(['all', 'active', 'delivered'] as const).map((tab) => {
          const isSelected = filter === tab;
          return (
            <TouchableOpacity
              key={tab}
              activeOpacity={0.8}
              onPress={() => setFilter(tab)}
              className={`flex-1 py-2.5 rounded-xl items-center ${
                isSelected ? 'bg-forest-600 shadow-xs' : 'bg-transparent'
              }`}
            >
              <Text
                className={`text-xs font-black capitalize ${
                  isSelected ? 'text-white' : 'text-charcoal-500'
                }`}
              >
                {tab === 'all' ? 'All Orders' : tab === 'active' ? 'Active' : 'Delivered'}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Loading Skeletons */}
      {loading ? (
        <View className="space-y-3">
          {[1, 2].map((n) => (
            <View
              key={n}
              className="bg-white rounded-3xl p-4 border border-muted-200 animate-pulse mb-3"
            >
              <View className="flex-row justify-between mb-3">
                <View className="w-24 h-4 bg-muted-100 rounded" />
                <View className="w-16 h-4 bg-muted-100 rounded" />
              </View>
              <View className="w-full h-16 bg-cream-100 rounded-xl mb-3" />
              <View className="w-28 h-8 bg-muted-100 rounded-xl" />
            </View>
          ))}
        </View>
      ) : filteredOrders.length === 0 ? (
        /* Empty State */
        <View className="bg-white rounded-3xl p-8 items-center justify-center border border-muted-200 shadow-sm mt-4">
          <View className="w-20 h-20 bg-forest-50 rounded-full items-center justify-center mb-4">
            <Package size={40} color={Colors.primary} />
          </View>
          <Text className="text-charcoal-500 font-black text-lg mb-1">
            No {filter !== 'all' ? filter : ''} orders found
          </Text>
          <Text className="text-muted-500 text-xs text-center mb-6 leading-5">
            Your farm harvest purchases will appear here with live tracking updates.
          </Text>
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => router.push('/(tabs)')}
            className="bg-forest-600 px-6 py-3.5 rounded-2xl shadow flex-row items-center"
          >
            <ShoppingBag size={16} color="#FFFFFF" style={{ marginRight: 8 }} />
            <Text className="text-white font-bold text-xs">Explore Farm Catalog</Text>
          </TouchableOpacity>
        </View>
      ) : (
        /* Order Cards List */
        filteredOrders.map((order) => (
          <View
            key={order.id}
            className="bg-white rounded-3xl p-4 mb-4 border border-muted-200 shadow-sm"
          >
            {/* Header: Order ID, Date & Status Badge */}
            <View className="flex-row justify-between items-center pb-3 border-b border-muted-100">
              <View>
                <Text className="text-charcoal-500 font-black text-sm">
                  #{order.orderNumber}
                </Text>
                <Text className="text-muted-400 text-[11px] font-medium mt-0.5">
                  {order.createdAt}
                </Text>
              </View>
              {renderStatusBadge(order.status)}
            </View>

            {/* Thumbnail Preview of Ordered Items */}
            <View className="py-3">
              {order.items.map((item) => (
                <View
                  key={item.id}
                  className="flex-row items-center py-1.5"
                >
                  <Image
                    source={{ uri: item.imageUrl }}
                    className="w-12 h-12 rounded-xl bg-cream-100 border border-muted-200"
                    resizeMode="cover"
                  />
                  <View className="flex-1 ml-3">
                    <Text
                      className="text-charcoal-500 font-bold text-xs"
                      numberOfLines={1}
                    >
                      {item.title}
                    </Text>
                    <View className="flex-row items-center mt-0.5">
                      <View className="bg-cream-100 px-1.5 py-0.2 rounded border border-muted-200 mr-2">
                        <Text className="text-forest-700 font-bold text-[9px]">
                          {item.variantWeight}
                        </Text>
                      </View>
                      <Text className="text-muted-500 text-[11px]">
                        Qty: {item.quantity} • ₹{item.price} each
                      </Text>
                    </View>
                  </View>
                </View>
              ))}
            </View>

            {/* Total Amount & Track Shipment Button */}
            <View className="pt-3 border-t border-muted-100 flex-row justify-between items-center">
              <View>
                <Text className="text-muted-400 text-[10px] font-bold uppercase">
                  Total Paid
                </Text>
                <Text className="text-forest-600 font-black text-base">
                  ₹{order.totalAmount}
                </Text>
              </View>

              <TouchableOpacity
                activeOpacity={0.85}
                onPress={() => router.push(`/orders/${order.id}`)}
                className="bg-forest-600 px-4 py-2.5 rounded-xl flex-row items-center shadow-xs"
              >
                <Truck size={14} color="#FFFFFF" style={{ marginRight: 6 }} />
                <Text className="text-white font-bold text-xs mr-1">
                  Track Shipment
                </Text>
                <ChevronRight size={13} color="#FFFFFF" strokeWidth={2.5} />
              </TouchableOpacity>
            </View>
          </View>
        ))
      )}
    </ScrollView>
  );
}
