// app/index.tsx
import { useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import { useAuthStore } from '../store';
import { Colors } from '../constants/theme';

export default function Index() {
  const { user, isInitialized, isLoading } = useAuthStore();

  useEffect(() => {
    if (!isInitialized || isLoading) return;

    if (!user) {
      router.replace('/(auth)/welcome');
      return;
    }

    switch (user.role) {
      case 'admin':
        router.replace('/(admin)/(tabs)/dashboard');
        break;
      case 'provider':
        router.replace('/(provider)/(tabs)/dashboard');
        break;
      default:
        router.replace('/(customer)/(tabs)/home');
    }
  }, [user, isInitialized, isLoading]);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.background }}>
      <ActivityIndicator size="large" color={Colors.primary} />
    </View>
  );
}
