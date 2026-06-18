// app/(customer)/(tabs)/home.tsx
import React, { useEffect, useState, useCallback } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  RefreshControl, FlatList, Dimensions, Image,
} from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuthStore } from '../../../store';
import { categoryService, serviceService } from '../../../services/dataService';
import { Category, Service } from '../../../types';
import { Colors, Spacing, FontSize, BorderRadius, Shadow } from '../../../constants/theme';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.68;

function ServiceCard({ service, onPress }: { service: Service; onPress: () => void }) {
  return (
    <TouchableOpacity style={styles.serviceCard} onPress={onPress} activeOpacity={0.88}>
      <View style={styles.serviceImageContainer}>
        {service.images[0] ? (
          <Image source={{ uri: service.images[0] }} style={styles.serviceImage} />
        ) : (
          <LinearGradient colors={['#1A1A1A', '#242424']} style={styles.serviceImage}>
            <Ionicons name="image-outline" size={36} color={Colors.border} />
          </LinearGradient>
        )}
        <View style={styles.serviceBadge}>
          <Text style={styles.serviceBadgeText}>
            {service.currency} {service.price.toLocaleString()}
          </Text>
        </View>
        {service.isFeatured && (
          <View style={styles.featuredBadge}>
            <Text style={styles.featuredText}>✦ Featured</Text>
          </View>
        )}
      </View>
      <View style={styles.serviceInfo}>
        <Text style={styles.serviceTitle} numberOfLines={1}>{service.title}</Text>
        <Text style={styles.serviceProvider} numberOfLines={1}>by {service.providerName}</Text>
        <View style={styles.serviceRating}>
          <Ionicons name="star" size={13} color={Colors.gold} />
          <Text style={styles.ratingText}>{service.rating.toFixed(1)}</Text>
          <Text style={styles.reviewCount}>({service.totalReviews})</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

function CategoryChip({ category, onPress }: { category: Category; onPress: () => void }) {
  return (
    <TouchableOpacity style={styles.categoryChip} onPress={onPress} activeOpacity={0.8}>
      <Text style={styles.categoryIcon}>{category.icon}</Text>
      <Text style={styles.categoryName}>{category.name}</Text>
    </TouchableOpacity>
  );
}

export default function HomeScreen() {
  const { user } = useAuthStore();
  const [categories, setCategories] = useState<Category[]>([]);
  const [featuredServices, setFeaturedServices] = useState<Service[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    try {
      const [cats, services] = await Promise.all([
        categoryService.getAll(),
        serviceService.getFeatured(10),
      ]);
      setCategories(cats);
      setFeaturedServices(services);
    } catch (e) {
      console.error('Failed to load home data:', e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  const onRefresh = () => { setRefreshing(true); loadData(); };

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.primary} />}
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>{greeting} 👋</Text>
            <Text style={styles.userName}>{user?.displayName?.split(' ')[0] || 'there'}</Text>
          </View>
          <View style={styles.headerActions}>
            <TouchableOpacity
              style={styles.headerBtn}
              onPress={() => router.push('/(customer)/search')}
            >
              <Ionicons name="search-outline" size={22} color={Colors.white} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.headerBtn}>
              <Ionicons name="notifications-outline" size={22} color={Colors.white} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Hero Banner */}
        <TouchableOpacity
          style={styles.heroBanner}
          onPress={() => router.push('/(customer)/search')}
          activeOpacity={0.9}
        >
          <LinearGradient
            colors={[Colors.primaryDark, Colors.primary, '#FF8C33']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.heroGradient}
          >
            <View style={styles.heroContent}>
              <Text style={styles.heroTitle}>Book Professional{'
'}Services Today</Text>
              <Text style={styles.heroSubtitle}>500+ verified professionals near you</Text>
              <View style={styles.heroSearchBar}>
                <Ionicons name="search-outline" size={18} color={Colors.textMuted} />
                <Text style={styles.heroSearchText}>Search any service...</Text>
              </View>
            </View>
            <View style={styles.heroDecor}>
              <Text style={styles.heroDecorText}>✦</Text>
            </View>
          </LinearGradient>
        </TouchableOpacity>

        {/* Categories */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Categories</Text>
            <TouchableOpacity onPress={() => router.push('/(customer)/(tabs)/explore')}>
              <Text style={styles.seeAll}>See all</Text>
            </TouchableOpacity>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoriesRow}>
            {(categories.length > 0 ? categories : PLACEHOLDER_CATEGORIES).map((cat) => (
              <CategoryChip
                key={cat.id}
                category={cat}
                onPress={() => router.push(`/(customer)/category/${cat.id}`)}
              />
            ))}
          </ScrollView>
        </View>

        {/* Featured Services */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Featured Services</Text>
            <TouchableOpacity onPress={() => router.push('/(customer)/(tabs)/explore')}>
              <Text style={styles.seeAll}>See all</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={featuredServices.length > 0 ? featuredServices : PLACEHOLDER_SERVICES}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.servicesRow}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={{ width: CARD_WIDTH, marginRight: Spacing.md }}>
                <ServiceCard
                  service={item}
                  onPress={() => router.push(`/(customer)/service/${item.id}`)}
                />
              </View>
            )}
          />
        </View>

        {/* Stats Banner */}
        <View style={styles.statsBanner}>
          {[
            { value: '500+', label: 'Professionals' },
            { value: '50+', label: 'Categories' },
            { value: '10K+', label: 'Bookings' },
            { value: '4.9', label: 'Avg Rating' },
          ].map((stat) => (
            <View key={stat.label} style={styles.statItem}>
              <Text style={styles.statValue}>{stat.value}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </View>
          ))}
        </View>

        <View style={{ height: Spacing.xxl }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const PLACEHOLDER_CATEGORIES: Category[] = [
  { id: '1', name: 'Cleaning', icon: '🧹', description: '', imageURL: '', isActive: true, order: 1 },
  { id: '2', name: 'Plumbing', icon: '🔧', description: '', imageURL: '', isActive: true, order: 2 },
  { id: '3', name: 'Electrical', icon: '⚡', description: '', imageURL: '', isActive: true, order: 3 },
  { id: '4', name: 'Design', icon: '🎨', description: '', imageURL: '', isActive: true, order: 4 },
  { id: '5', name: 'IT & Tech', icon: '💻', description: '', imageURL: '', isActive: true, order: 5 },
  { id: '6', name: 'Moving', icon: '📦', description: '', imageURL: '', isActive: true, order: 6 },
];

const PLACEHOLDER_SERVICES: Service[] = [
  {
    id: '1', title: 'Deep Home Cleaning', description: 'Professional deep cleaning', shortDescription: 'Full home clean',
    providerId: 'p1', providerName: 'CleanPro Services', categoryId: '1', categoryName: 'Cleaning',
    images: [], price: 850, priceType: 'fixed', currency: 'ZAR', tags: ['cleaning', 'home'],
    isActive: true, isFeatured: true, rating: 4.9, totalReviews: 124, totalBookings: 200,
    createdAt: new Date(), updatedAt: new Date(),
  },
  {
    id: '2', title: 'Emergency Plumbing', description: 'Fast plumbing solutions', shortDescription: '24/7 plumbing',
    providerId: 'p2', providerName: 'QuickFix Plumbers', categoryId: '2', categoryName: 'Plumbing',
    images: [], price: 650, priceType: 'hourly', currency: 'ZAR', tags: ['plumbing', 'emergency'],
    isActive: true, isFeatured: true, rating: 4.7, totalReviews: 89, totalBookings: 150,
    createdAt: new Date(), updatedAt: new Date(),
  },
];

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: Spacing.lg, paddingVertical: Spacing.md,
  },
  greeting: { fontSize: FontSize.sm, color: Colors.textMuted },
  userName: { fontSize: FontSize.xxl, fontWeight: '900', color: Colors.white, letterSpacing: -0.5 },
  headerActions: { flexDirection: 'row', gap: Spacing.sm },
  headerBtn: {
    width: 42, height: 42, borderRadius: 21, backgroundColor: Colors.card,
    alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: Colors.border,
  },
  heroBanner: { marginHorizontal: Spacing.lg, borderRadius: BorderRadius.lg, overflow: 'hidden', marginBottom: Spacing.xl },
  heroGradient: { padding: Spacing.xl, minHeight: 180 },
  heroContent: { flex: 1 },
  heroTitle: { fontSize: FontSize.xxl, fontWeight: '900', color: Colors.white, letterSpacing: -0.5, marginBottom: Spacing.sm },
  heroSubtitle: { fontSize: FontSize.sm, color: 'rgba(255,255,255,0.8)', marginBottom: Spacing.lg },
  heroSearchBar: {
    flexDirection: 'row', alignItems: 'center', gap: Spacing.sm,
    backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: BorderRadius.full,
    paddingHorizontal: Spacing.md, paddingVertical: 10, borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)',
  },
  heroSearchText: { color: 'rgba(255,255,255,0.7)', fontSize: FontSize.sm },
  heroDecor: { position: 'absolute', right: Spacing.xl, top: Spacing.lg },
  heroDecorText: { fontSize: 60, color: 'rgba(255,255,255,0.1)' },
  section: { marginBottom: Spacing.xl },
  sectionHeader: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: Spacing.lg, marginBottom: Spacing.md,
  },
  sectionTitle: { fontSize: FontSize.lg, fontWeight: '800', color: Colors.white },
  seeAll: { fontSize: FontSize.sm, color: Colors.primary, fontWeight: '600' },
  categoriesRow: { paddingHorizontal: Spacing.lg, gap: Spacing.sm },
  categoryChip: {
    alignItems: 'center', backgroundColor: Colors.card, borderRadius: BorderRadius.md,
    paddingVertical: Spacing.md, paddingHorizontal: Spacing.lg, borderWidth: 1, borderColor: Colors.border, gap: 6,
  },
  categoryIcon: { fontSize: 24 },
  categoryName: { fontSize: FontSize.xs, color: Colors.white, fontWeight: '600' },
  servicesRow: { paddingHorizontal: Spacing.lg },
  serviceCard: {
    backgroundColor: Colors.card, borderRadius: BorderRadius.lg, overflow: 'hidden',
    borderWidth: 1, borderColor: Colors.border, ...Shadow.md,
  },
  serviceImageContainer: { position: 'relative' },
  serviceImage: { width: '100%', height: 150, alignItems: 'center', justifyContent: 'center' },
  serviceBadge: {
    position: 'absolute', bottom: Spacing.sm, right: Spacing.sm,
    backgroundColor: Colors.primary, borderRadius: BorderRadius.full,
    paddingHorizontal: Spacing.sm, paddingVertical: 3,
  },
  serviceBadgeText: { color: Colors.white, fontSize: FontSize.xs, fontWeight: '700' },
  featuredBadge: {
    position: 'absolute', top: Spacing.sm, left: Spacing.sm,
    backgroundColor: 'rgba(0,0,0,0.75)', borderRadius: BorderRadius.full,
    paddingHorizontal: Spacing.sm, paddingVertical: 3, borderWidth: 1, borderColor: Colors.primary,
  },
  featuredText: { color: Colors.primary, fontSize: 10, fontWeight: '700' },
  serviceInfo: { padding: Spacing.md },
  serviceTitle: { fontSize: FontSize.md, fontWeight: '700', color: Colors.white, marginBottom: 2 },
  serviceProvider: { fontSize: FontSize.xs, color: Colors.textMuted, marginBottom: Spacing.sm },
  serviceRating: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  ratingText: { fontSize: FontSize.sm, color: Colors.white, fontWeight: '700' },
  reviewCount: { fontSize: FontSize.xs, color: Colors.textMuted },
  statsBanner: {
    flexDirection: 'row', marginHorizontal: Spacing.lg, backgroundColor: Colors.card,
    borderRadius: BorderRadius.lg, padding: Spacing.lg, borderWidth: 1, borderColor: Colors.border,
    justifyContent: 'space-around',
  },
  statItem: { alignItems: 'center' },
  statValue: { fontSize: FontSize.xl, fontWeight: '900', color: Colors.primary },
  statLabel: { fontSize: FontSize.xs, color: Colors.textMuted, marginTop: 2 },
});
