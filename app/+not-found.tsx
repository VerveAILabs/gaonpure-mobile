import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Link, Stack } from 'expo-router';
import { HelpCircle } from 'lucide-react-native';
import { Colors } from '@/constants/colors';

export default function NotFoundScreen(): React.JSX.Element {
  return (
    <>
      <Stack.Screen options={{ title: 'Page Not Found' }} />
      <View className="flex-1 bg-cream-200 items-center justify-center p-6">
        <View className="w-16 h-16 bg-forest-50 rounded-full items-center justify-center mb-4">
          <HelpCircle size={32} color={Colors.primary} />
        </View>
        <Text className="text-xl font-bold text-charcoal-500 mb-2">This screen doesn't exist.</Text>
        <Text className="text-sm text-muted-500 text-center mb-6">
          The link you followed might be broken or the page may have been removed.
        </Text>

        <Link href="/" asChild>
          <TouchableOpacity className="bg-forest-600 px-6 py-3 rounded-xl shadow">
            <Text className="text-white font-bold text-sm">Return to Store</Text>
          </TouchableOpacity>
        </Link>
      </View>
    </>
  );
}
