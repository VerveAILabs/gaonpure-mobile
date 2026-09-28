import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { ShieldCheck, Sparkles, X } from 'lucide-react-native';
import { Colors } from '@/constants/colors';

export default function ModalScreen(): React.JSX.Element {
  const router = useRouter();

  return (
    <ScrollView className="flex-1 bg-cream-200" contentContainerStyle={{ padding: 20 }}>
      <View className="bg-white rounded-2xl p-6 border border-muted-200 shadow-sm">
        <View className="flex-row items-center justify-between mb-4">
          <View className="flex-row items-center">
            <View className="w-8 h-8 rounded-full bg-forest-50 items-center justify-center mr-2">
              <Sparkles size={16} color={Colors.primary} />
            </View>
            <Text className="text-charcoal-500 font-bold text-lg">Gaon Pure Promise</Text>
          </View>
          <TouchableOpacity onPress={() => router.back()} className="p-1">
            <X size={20} color={Colors.text.muted} />
          </TouchableOpacity>
        </View>

        <Text className="text-charcoal-500 text-sm leading-6 mb-4">
          At Gaon Pure, we bridge the gap between traditional village farmers and health-conscious families.
          All our products are 100% natural, pesticide-free, and ethically sourced.
        </Text>

        <View className="bg-forest-50 p-4 rounded-xl border border-forest-100 flex-row items-start mb-6">
          <ShieldCheck size={20} color={Colors.primary} style={{ marginTop: 2 }} />
          <View className="ml-3 flex-1">
            <Text className="text-forest-600 font-bold text-sm">Certified Lab Testing</Text>
            <Text className="text-forest-700 text-xs mt-1">
              Every batch is tested for zero heavy metals, zero synthetic chemicals, and 100% purity.
            </Text>
          </View>
        </View>

        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => router.back()}
          className="bg-forest-600 py-3.5 rounded-xl items-center shadow"
        >
          <Text className="text-white font-bold text-sm">Got it</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
