import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
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
  LucideIcon,
} from 'lucide-react-native';
import { Colors } from '@/constants/colors';

interface MenuItem {
  icon: LucideIcon;
  title: string;
  subtitle?: string;
  onPress: () => void;
  destructive?: boolean;
}

export default function ProfileScreen(): React.JSX.Element {
  const router = useRouter();

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
      <View className="bg-white rounded-2xl p-5 border border-muted-200 shadow-sm mb-4">
        <View className="flex-row items-center">
          <View className="w-16 h-16 rounded-full bg-forest-50 border-2 border-forest-600 items-center justify-center">
            <User size={30} color={Colors.primary} />
          </View>

          <View className="ml-4 flex-1">
            <View className="flex-row items-center">
              <Text className="text-charcoal-500 font-bold text-lg">Aarav Sharma</Text>
              <ShieldCheck size={16} color={Colors.primary} style={{ marginLeft: 6 }} />
            </View>
            <Text className="text-muted-500 text-xs mt-0.5">+91 98765 43210</Text>
            <Text className="text-muted-500 text-xs">aarav.sharma@gaonpure.com</Text>
          </View>
        </View>

        {/* Member Badge */}
        <View className="mt-4 pt-3 border-t border-muted-100 flex-row items-center justify-between">
          <View className="flex-row items-center">
            <View className="w-2.5 h-2.5 rounded-full bg-amber-500 mr-2" />
            <Text className="text-charcoal-500 font-semibold text-xs">
              Gaon Pure Organic Club Member
            </Text>
          </View>
          <Text className="text-forest-600 font-bold text-xs">240 Farm Coins</Text>
        </View>
      </View>

      {/* Menu Groups */}
      {accountSections.map((section) => (
        <View key={section.title} className="mb-4">
          <Text className="text-muted-500 font-semibold text-xs uppercase tracking-wider mb-2 ml-1">
            {section.title}
          </Text>
          <View className="bg-white rounded-2xl border border-muted-200 shadow-sm overflow-hidden">
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

      {/* Auth Actions: Sign In / Switch Account & Log Out */}
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => router.push('/login')}
        className="bg-forest-600 rounded-2xl p-4 flex-row items-center justify-center mt-2 shadow-sm"
      >
        <User size={16} color="#FFFFFF" />
        <Text className="text-white font-bold text-sm ml-2">Sign In / Switch Account</Text>
      </TouchableOpacity>

      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => router.push('/login')}
        className="bg-white rounded-2xl p-4 border border-red-200 flex-row items-center justify-center mt-3 shadow-sm"
      >
        <LogOut size={16} color="#DC2626" />
        <Text className="text-red-600 font-bold text-sm ml-2">Log Out</Text>
      </TouchableOpacity>

      {/* App Version Info */}
      <Text className="text-center text-muted-400 text-[11px] mt-6">
        Gaon Pure v1.0.0 • Pure & Organic Deliveries
      </Text>
    </ScrollView>
  );
}
