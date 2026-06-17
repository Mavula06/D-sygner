// app/(customer)/(tabs)/bookings.tsx
import React, { useEffect, useState, useCallback } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity,
  RefreshControl, ActivityIndicator,
} from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { format } from 'date-fns';
import { useAuthStore } from '../../../store';
import { bookingService } from '../../../services/dataService';
import { Booking, BookingStatus } from '../../../types';
import { Colors, Spacing, FontSize, BorderRadius } from '../../../constants/theme';

const STATUS_CONFIG: Record<BookingStatus, { label: string; color: string; icon: string }> = {
  pending: { label: 'Pending', color: Colors.warning, icon: 'time-outline' },
  confirmed: { label: 'Confirmed', color: Colors.info, icon: 'checkmark-circle-outline' },
  in_progress: { label: 'In Progress', color: Colors.primary, icon: 'refresh-outline' },
  completed: { label: 'Completed', color: Colors.success, icon: 'checkmark-done-outline' },
  cancelled: { label: 'Cancelled', color: Colors.error, icon: 'close-circle-outline' },
  rejected: { label: 'Rejected', color: Colors.error, icon: 'ban-outline' },
};

const FILTERS: { key: string; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'pending', label: 'Pending' },
  { key: 'confirmed', label: 'Confirmed' },
  { key: 'completed', label: 'Completed' },
  { key: 'cancelled', label: 'Cancelled' },
];

function BookingCard({ booking }: { booking: Booking }) {
  const status = STATUS_CONFIG[booking.status];
  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => router.push(`/(customer)/booking-confirmation/${booking.id}`)}
      activeOpacity={0.85}
    >
      <View style={styles.cardHeader}>
        <View style={styles.cardLeft}>
          <Text style={styles.serviceName} numberOfLines={1}>{booking.serviceName}</Text>
          <Text style={styles.providerName}>by {booking.providerName}</Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: `${status.color}20`, borderColor: `${status.color}40` }]}>
          <Ionicons name={status.icon as any} size={12} color={status.color} />
          <Text style={[styles.statusText, { color: status.color }]}>{status.label}</Text>
        </View>
      </View>
      <View style={styles.cardDivider} />
      <View style={styles.cardFooter}>
        <View style={styles.footerItem}>
          <Ionicons name="calendar-outline" size={14} color={Colors.textMuted} />
          <Text style={styles.footerText}>
            {booking.scheduledDate instanceof Date
              ? format(booking.scheduledDate, 'MMM d, yyyy')
              : 'TBD'}
          </Text>
        </View>
        <View style={styles.footerItem}>
          <Ionicons name="time-outline" size={14} color={Colors.textMuted} />
          <Text style={styles.footerText}>{booking.scheduledTime}</Text>
        </View>
        <Text style={styles.amount}>
          {booking.currency} {booking.totalAmount.toLocaleString()}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

export default function BookingsScreen() {
  const { user } = useAuthStore();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    if (!user) return;
    try {
      const data = await bookingService.getByCustomer(user.id);
      setBookings(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [user]);

  useEffect(() => { load(); }, [load]);

  const filtered = filter === 'all' ? bookings : bookings.filter((b) => b.status === filter);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>My Bookings</Text>
        <Text style={styles.subtitle}>{bookings.length} total bookings</Text>
      </View>

      {/* Filters */}
      <FlatList
        data={FILTERS}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filters}
        keyExtractor={(item) => item.key}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.filterChip, filter === item.key && styles.filterChipActive]}
            onPress={() => setFilter(item.key)}
          >
            <Text style={[styles.filterText, filter === item.key && styles.filterTextActive]}>
              {item.label}
            </Text>
          </TouchableOpacity>
        )}
      />

      {loading ? (
        <View style={styles.loading}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <BookingCard booking={item} />}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); load(); }} tintColor={Colors.primary} />
          }
          ListEmptyComponent={
            <View style={styles.empty}>
              <Ionicons name="calendar-outline" size={60} color={Colors.border} />
              <Text style={styles.emptyTitle}>No bookings yet</Text>
              <Text style={styles.emptyText}>Browse services and book your first appointment</Text>
              <TouchableOpacity
                style={styles.browseBtn}
                onPress={() => router.push('/(customer)/(tabs)/explore')}
              >
                <Text style={styles.browseBtnText}>Browse Services</Text>
              </TouchableOpacity>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: { paddingHorizontal: Spacing.lg, paddingBottom: Spacing.sm },
  title: { fontSize: FontSize.xxxl, fontWeight: '900', color: Colors.white, letterSpacing: -0.8, marginTop: Spacing.md },
  subtitle: { fontSize: FontSize.md, color: Colors.textMuted },
  filters: { paddingHorizontal: Spacing.lg, paddingVertical: Spacing.md, gap: Spacing.sm },
  filterChip: {
    paddingHorizontal: Spacing.md, paddingVertical: 8, borderRadius: BorderRadius.full,
    backgroundColor: Colors.card, borderWidth: 1, borderColor: Colors.border,
  },
  filterChipActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  filterText: { color: Colors.textMuted, fontSize: FontSize.sm, fontWeight: '600' },
  filterTextActive: { color: Colors.white },
  loading: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  list: { padding: Spacing.lg, gap: Spacing.md },
  card: {
    backgroundColor: Colors.card, borderRadius: BorderRadius.lg, padding: Spacing.md,
    borderWidth: 1, borderColor: Colors.border,
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  cardLeft: { flex: 1, marginRight: Spacing.sm },
  serviceName: { fontSize: FontSize.md, fontWeight: '700', color: Colors.white, marginBottom: 3 },
  providerName: { fontSize: FontSize.sm, color: Colors.textMuted },
  statusBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    paddingHorizontal: 10, paddingVertical: 4, borderRadius: BorderRadius.full, borderWidth: 1,
  },
  statusText: { fontSize: 11, fontWeight: '700' },
  cardDivider: { height: 1, backgroundColor: Colors.border, marginVertical: Spacing.md },
  cardFooter: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md },
  footerItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  footerText: { fontSize: FontSize.xs, color: Colors.textMuted },
  amount: { marginLeft: 'auto', fontSize: FontSize.md, fontWeight: '800', color: Colors.primary },
  empty: { alignItems: 'center', paddingTop: 80, paddingHorizontal: Spacing.xl },
  emptyTitle: { fontSize: FontSize.xl, fontWeight: '800', color: Colors.white, marginTop: Spacing.lg, marginBottom: Spacing.sm },
  emptyText: { fontSize: FontSize.md, color: Colors.textMuted, textAlign: 'center', lineHeight: 22, marginBottom: Spacing.xl },
  browseBtn: {
    backgroundColor: Colors.primary, borderRadius: BorderRadius.md,
    paddingVertical: 14, paddingHorizontal: Spacing.xl,
  },
  browseBtnText: { color: Colors.white, fontWeight: '700', fontSize: FontSize.md },
});
