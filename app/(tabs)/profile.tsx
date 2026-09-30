import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import {
  User,
  MapPin,
  Heart,
  CreditCard,
  Bell,
  HelpCircle,
  FileText,
  LogOut,
  ChevronRight,
  ShieldCheck,
  Sparkles,
  LogIn,
  LucideIcon,
} from 'lucide-react-native';
import { Colors } from '@/constants/colors';
import { useUserStore } from '@/src/store/userStore';

interface MenuItem {
  icon: LucideIcon;
  title: string;
  subtitle?: string;
  onPress: () => void;
  destructive?: boolean;
}

export default function ProfileScreen(): React.JSX.Element {
  const router = useRouter();
  const { user, isAuthenticated, logOut } = useUserStore();

  const handleLogOut = () => {
    Alert.alert(
      'Log Out',
      'Are you sure you want to log out of your Gaon Pure account?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Log Out',
          style: 'destructive',
          onPress: async () => {
            await logOut();
          },
        },
      ]
    );
  };

  const accountSections: { title: string; items: MenuItem[] }[] = [
    {
      title: 'Personal Info & Orders',
      items: [
        {
          icon: MapPin,
          title: 'Saved Delivery Addresses',
          subtitle: 'Home, Work, Village farm',
          onPress: () => router.push('/modal'),
        },
        {
          icon: Heart,
          title: 'Favorite Products',
          subtitle: 'Items saved for quick reorder',
          onPress: () => router.push('/modal'),
        },
        {
          icon: CreditCard,
          title: 'Payment Methods & UPI',
          subtitle: 'Cards, UPI ID, Net Banking',
          onPress: () => router.push('/modal'),
        },
      ],
    },
    {
      title: 'Preferences & Support',
      items: [
        {
          icon: Bell,
          title: 'Notification Preferences',
          subtitle: 'Order updates and farm harvest alerts',
          onPress: () => router.push('/modal'),
        },
        {
          icon: HelpCircle,
          title: 'Help & Customer Support',
          subtitle: 'WhatsApp support & FAQs',
          onPress: () => router.push('/modal'),
        },
        {
          icon: FileText,
          title: 'Pure Farm Quality Promise',
          subtitle: 'Purity testing reports & certification',
          onPress: () => router.push('/modal'),
        },
      ],
    },
  ];

  return (
    <ScrollView
      className="flex-1 bg-cream-200"
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ padding: 16, paddingBottom: 40 }}
    >
      {/* Profile Header Card */}
      {isAuthenticated && user ? (
        <View className="bg-white rounded-3xl p-5 border border-muted-200 shadow-sm mb-4">
          <View className="flex-row items-center">
            <View className="w-16 h-16 rounded-full bg-forest-50 border-2 border-forest-600 items-center justify-center">
              <User size={30} color={Colors.primary} />
            </View>

            <View className="ml-4 flex-1">
              <View className="flex-row items-center">
                <Text className="text-charcoal-500 font-black text-lg" numberOfLines={1}>
                  {user.displayName || 'Gaon Pure Customer'}
                </Text>
                <ShieldCheck size={16} color={Colors.primary} style={{ marginLeft: 6 }} />
              </View>
              {user.email && (
                <Text className="text-muted-500 text-xs mt-0.5" numberOfLines={1}>
                  {user.email}
                </Text>
              )}
              {user.phoneNumber && (
                <Text className="text-muted-500 text-xs font-semibold">
                  {user.phoneNumber}
                </Text>
              )}
            </View>
          </View>

          {/* Member Loyalty Badge */}
          <View className="mt-4 pt-3 border-t border-muted-100 flex-row items-center justify-between">
            <View className="flex-row items-center">
              <View className="w-2.5 h-2.5 rounded-full bg-amber-500 mr-2" />
              <Text className="text-charcoal-500 font-bold text-xs">
                Gaon Pure Organic Club Member
              </Text>
            </View>
            <Text className="text-forest-600 font-black text-xs">240 Farm Coins</Text>
          </View>
        </View>
      ) : (
        /* Unauthenticated Guest Promo Card */
        <View className="bg-white rounded-3xl p-5 border border-muted-200 shadow-sm mb-4">
          <View className="flex-row items-center mb-3">
            <View className="w-12 h-12 rounded-2xl bg-forest-50 border border-forest-100 items-center justify-center mr-3">
              <Sparkles size={22} color={Colors.primary} />
            </View>
            <View className="flex-1">
              <Text className="text-charcoal-500 font-black text-base">
                Welcome to Gaon Pure
              </Text>
              <Text className="text-muted-500 text-xs mt-0.5">
                Sign in to track orders, save addresses, and earn Farm Coins.
              </Text>
            </View>
          </View>

          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => router.push('/login')}
            className="bg-forest-600 py-3.5 rounded-2xl flex-row items-center justify-center shadow-xs"
          >
            <LogIn size={16} color="#FFFFFF" style={{ marginRight: 6 }} />
            <Text className="text-white font-black text-xs">
              Sign In / Create Account
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Menu Groups */}
      {accountSections.map((section) => (
        <View key={section.title} className="mb-4">
          <Text className="text-muted-500 font-bold text-xs uppercase tracking-wider mb-2 ml-1">
            {section.title}
          </Text>
          <View className="bg-white rounded-3xl border border-muted-200 shadow-sm overflow-hidden">
            {section.items.map((item, index) => {
              const IconComponent = item.icon;
              const isLast = index === section.items.length - 1;
              return (
                <TouchableOpacity
                  key={item.title}
                  activeOpacity={0.7}
                  onPress={item.onPress}
                  className={`flex-row items-center p-4 ${
                    !isLast ? 'border-b border-muted-100' : ''
                  }`}
                >
                  <View className="w-9 h-9 rounded-xl bg-cream-200 items-center justify-center mr-3">
                    <IconComponent size={18} color={Colors.primary} />
                  </View>

                  <View className="flex-1">
                    <Text className="text-charcoal-500 font-bold text-sm">{item.title}</Text>
                    {item.subtitle && (
                      <Text className="text-muted-500 text-xs mt-0.5">{item.subtitle}</Text>
                    )}
                  </View>

                  <ChevronRight size={16} color={Colors.text.muted} />
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      ))}

      {/* Auth Action: Log Out (if authenticated) or Switch Account */}
      {isAuthenticated ? (
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={handleLogOut}
          className="bg-white rounded-2xl p-4 border border-red-200 flex-row items-center justify-center mt-2 shadow-xs"
        >
          <LogOut size={16} color="#DC2626" />
          <Text className="text-red-600 font-bold text-sm ml-2">Log Out</Text>
        </TouchableOpacity>
      ) : null}

      {/* App Version Info */}
      <Text className="text-center text-muted-400 text-[11px] mt-6">
        Gaon Pure v1.0.0 • Pure & Organic Deliveries
      </Text>
    </ScrollView>
  );
}
