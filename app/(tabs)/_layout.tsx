import React from 'react';
import { Tabs } from 'expo-router';
import { Platform } from 'react-native';
import { Store, ShoppingCart, Package, User } from 'lucide-react-native';
import { Colors } from '@/constants/colors';
import { useCartCount } from '@/store/useCartStore';

export default function TabLayout(): React.JSX.Element {
  const cartItemCount = useCartCount();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.text.muted,
        tabBarStyle: {
          backgroundColor: Colors.card,
          borderTopColor: Colors.border,
          borderTopWidth: 1,
          height: Platform.OS === 'ios' ? 88 : 68,
          paddingBottom: Platform.OS === 'ios' ? 28 : 10,
          paddingTop: 10,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
        headerStyle: {
          backgroundColor: Colors.background,
          borderBottomWidth: 1,
          borderBottomColor: Colors.border,
          elevation: 0,
          shadowOpacity: 0,
        },
        headerTintColor: Colors.primary,
        headerTitleStyle: {
          fontWeight: '700',
          fontSize: 18,
          color: Colors.text.primary,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Store',
          headerTitle: 'Gaon Pure',
          tabBarIcon: ({ color, size }: { color: string; size: number }) => (
            <Store color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="cart"
        options={{
          title: 'Cart',
          headerTitle: 'Your Cart',
          tabBarBadge: cartItemCount > 0 ? cartItemCount : undefined,
          tabBarBadgeStyle: {
            backgroundColor: Colors.secondary,
            color: '#FFFFFF',
            fontSize: 11,
            fontWeight: '700',
            minWidth: 18,
            height: 18,
            lineHeight: 16,
            borderRadius: 9,
          },
          tabBarIcon: ({ color, size }: { color: string; size: number }) => (
            <ShoppingCart color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="orders"
        options={{
          title: 'My Orders',
          headerTitle: 'Order History',
          tabBarIcon: ({ color, size }: { color: string; size: number }) => (
            <Package color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          headerTitle: 'Account & Settings',
          tabBarIcon: ({ color, size }: { color: string; size: number }) => (
            <User color={color} size={size} />
          ),
        }}
      />
    </Tabs>
  );
}
