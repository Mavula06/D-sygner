// app/(customer)/(tabs)/_layout.tsx
import { Tabs } from 'expo-router';
import { Platform, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNotificationStore } from '../../../store';
import { Colors } from '../../../constants/theme';
import { Badge } from 'react-native-paper';

function TabIcon({ name, focused, badgeCount }: { name: any; focused: boolean; badgeCount?: number }) {
  return (
    <View>
      <Ionicons
        name={focused ? name : `${name}-outline`}
        size={24}
        color={focused ? Colors.primary : Colors.textMuted}
      />
      {badgeCount && badgeCount > 0 ? (
        <Badge
          size={16}
          style={{ position: 'absolute', top: -4, right: -8, backgroundColor: Colors.primary }}
        >
          {badgeCount > 99 ? '99+' : badgeCount}
        </Badge>
      ) : null}
    </View>
  );
}

export default function CustomerTabsLayout() {
  const { unreadCount } = useNotificationStore();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.textMuted,
        tabBarStyle: {
          backgroundColor: Colors.surface,
          borderTopColor: Colors.border,
          borderTopWidth: 1,
          height: Platform.OS === 'ios' ? 88 : 68,
          paddingBottom: Platform.OS === 'ios' ? 28 : 12,
          paddingTop: 10,
        },
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '600',
          marginTop: 2,
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: 'Home',
          tabBarIcon: ({ focused }) => <TabIcon name="home" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Explore',
          tabBarIcon: ({ focused }) => <TabIcon name="grid" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="bookings"
        options={{
          title: 'Bookings',
          tabBarIcon: ({ focused }) => <TabIcon name="calendar" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="messages"
        options={{
          title: 'Messages',
          tabBarIcon: ({ focused }) => <TabIcon name="chatbubbles" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ focused }) => (
            <TabIcon name="person" focused={focused} badgeCount={unreadCount} />
          ),
        }}
      />
    </Tabs>
  );
}
