// app/_layout.tsx
import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { PaperProvider } from 'react-native-paper';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import * as Notifications from 'expo-notifications';
import { useAuthStore, useThemeStore } from '../store';
import { authService } from '../services/authService';
import { DarkTheme, LightTheme } from '../constants/theme';
import { Platform } from 'react-native';

SplashScreen.preventAutoHideAsync();

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export default function RootLayout() {
  const { setUser, setLoading, setInitialized } = useAuthStore();
  const { isDark } = useThemeStore();

  useEffect(() => {
    const unsubscribe = authService.onAuthStateChange(async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const userData = await authService.getUserData(firebaseUser.uid);
          setUser(userData);
        } catch (e) {
          setUser(null);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
      setInitialized(true);
      SplashScreen.hideAsync();
    });

    // Register for push notifications
    registerForPushNotifications();

    return unsubscribe;
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <PaperProvider theme={isDark ? DarkTheme : LightTheme}>
          <StatusBar style={isDark ? 'light' : 'dark'} />
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="index" />
            <Stack.Screen name="(auth)" />
            <Stack.Screen name="(customer)" />
            <Stack.Screen name="(provider)" />
            <Stack.Screen name="(admin)" />
          </Stack>
        </PaperProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

async function registerForPushNotifications() {
  if (Platform.OS === 'web') return;
  try {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') return;

    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF6B00',
      });
    }
  } catch (e) {
    console.warn('Push notification registration failed:', e);
  }
}
