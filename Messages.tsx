// app/(customer)/(tabs)/messages.tsx
import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator,
} from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { collection, query, where, orderBy, onSnapshot } from 'firebase/firestore';
import { Ionicons } from '@expo/vector-icons';
import { format } from 'date-fns';
import { db } from '../../../lib/firebase/config';
import { useAuthStore } from '../../../store';
import { Conversation } from '../../../types';
import { Colors, Spacing, FontSize, BorderRadius } from '../../../constants/theme';

function ConversationCard({ conv, userId }: { conv: Conversation; userId: string }) {
  const other = Object.entries(conv.participantDetails).find(([id]) => id !== userId);
  const otherName = other ? other[1].name : 'Unknown';
  const unread = conv.unreadCount?.[userId] || 0;

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => router.push(`/(customer)/chat/${conv.id}`)}
      activeOpacity={0.8}
    >
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>{otherName[0]?.toUpperCase()}</Text>
        {unread > 0 && (
          <View style={styles.unreadBadge}>
            <Text style={styles.unreadText}>{unread > 99 ? '99+' : unread}</Text>
          </View>
        )}
      </View>
      <View style={styles.info}>
        <View style={styles.infoTop}>
          <Text style={[styles.name, unread > 0 && styles.nameBold]}>{otherName}</Text>
          <Text style={styles.time}>
            {conv.lastMessageTime
              ? format(new Date(conv.lastMessageTime), 'HH:mm')
              : ''}
          </Text>
        </View>
        <Text style={[styles.lastMsg, unread > 0 && styles.lastMsgBold]} numberOfLines={1}>
          {conv.lastMessage || 'No messages yet'}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

export default function MessagesScreen() {
  const { user } = useAuthStore();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const q = query(
      collection(db, 'conversations'),
      where('participants', 'array-contains', user.id),
      orderBy('updatedAt', 'desc')
    );
    const unsub = onSnapshot(q, (snap) => {
      const convs = snap.docs.map((d) => ({
        id: d.id,
        ...d.data(),
        lastMessageTime: d.data().lastMessageTime?.toDate(),
        createdAt: d.data().createdAt?.toDate(),
        updatedAt: d.data().updatedAt?.toDate(),
      })) as Conversation[];
      setConversations(convs);
      setLoading(false);
    });
    return unsub;
  }, [user]);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>Messages</Text>
        <Text style={styles.subtitle}>{conversations.length} conversations</Text>
      </View>

      {loading ? (
        <View style={styles.loading}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      ) : (
        <FlatList
          data={conversations}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <ConversationCard conv={item} userId={user!.id} />
          )}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.empty}>
              <Ionicons name="chatbubbles-outline" size={60} color={Colors.border} />
              <Text style={styles.emptyTitle}>No conversations</Text>
              <Text style={styles.emptyText}>Book a service to start chatting with providers</Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: { paddingHorizontal: Spacing.lg, paddingBottom: Spacing.md },
  title: { fontSize: FontSize.xxxl, fontWeight: '900', color: Colors.white, letterSpacing: -0.8, marginTop: Spacing.md },
  subtitle: { fontSize: FontSize.md, color: Colors.textMuted },
  loading: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  list: { paddingHorizontal: Spacing.lg, paddingTop: Spacing.sm },
  card: {
    flexDirection: 'row', alignItems: 'center', paddingVertical: Spacing.md,
    borderBottomWidth: 1, borderBottomColor: Colors.border, gap: Spacing.md,
  },
  avatar: {
    width: 52, height: 52, borderRadius: 26, backgroundColor: Colors.card,
    alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: Colors.primary,
    position: 'relative',
  },
  avatarText: { color: Colors.primary, fontSize: FontSize.lg, fontWeight: '800' },
  unreadBadge: {
    position: 'absolute', top: -4, right: -4, backgroundColor: Colors.primary,
    borderRadius: BorderRadius.full, minWidth: 20, height: 20, alignItems: 'center', justifyContent: 'center',
    paddingHorizontal: 4,
  },
  unreadText: { color: Colors.white, fontSize: 10, fontWeight: '800' },
  info: { flex: 1 },
  infoTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 3 },
  name: { fontSize: FontSize.md, color: Colors.textMuted, fontWeight: '500' },
  nameBold: { color: Colors.white, fontWeight: '700' },
  time: { fontSize: FontSize.xs, color: Colors.textMuted },
  lastMsg: { fontSize: FontSize.sm, color: Colors.textMuted },
  lastMsgBold: { color: Colors.white, fontWeight: '600' },
  empty: { alignItems: 'center', paddingTop: 80, paddingHorizontal: Spacing.xl },
  emptyTitle: { fontSize: FontSize.xl, fontWeight: '800', color: Colors.white, marginTop: Spacing.lg, marginBottom: Spacing.sm },
  emptyText: { fontSize: FontSize.md, color: Colors.textMuted, textAlign: 'center', lineHeight: 22 },
});
