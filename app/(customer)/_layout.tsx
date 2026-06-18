// app/(customer)/_layout.tsx
import { Stack } from 'expo-router';

export default function CustomerLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="service/[id]" options={{ animation: 'slide_from_right' }} />
      <Stack.Screen name="category/[id]" options={{ animation: 'slide_from_right' }} />
      <Stack.Screen name="booking/[serviceId]" options={{ animation: 'slide_from_bottom' }} />
      <Stack.Screen name="payment/[bookingId]" options={{ animation: 'slide_from_bottom' }} />
      <Stack.Screen name="booking-confirmation/[bookingId]" />
      <Stack.Screen name="chat/[conversationId]" options={{ animation: 'slide_from_right' }} />
      <Stack.Screen name="review/[bookingId]" options={{ animation: 'slide_from_bottom' }} />
      <Stack.Screen name="profile/edit" options={{ animation: 'slide_from_right' }} />
      <Stack.Screen name="search" options={{ animation: 'slide_from_bottom' }} />
    </Stack>
  );
}
