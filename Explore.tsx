// app/(customer)/(tabs)/explore.tsx
import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity, RefreshControl,
} from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Searchbar } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { categoryService } from '../../../services/dataService';
import { Category } from '../../../types';
import { Colors, Spacing, FontSize, BorderRadius } from '../../../constants/theme';

const EMOJI_MAP: Record<string, string> = {
  cleaning: '🧹', plumbing: '🔧', electrical: '⚡', design: '🎨',
  tech: '💻', moving: '📦', gardening: '🌱', security: '🔒',
  photography: '📸', tutoring: '📚', fitness: '💪', cooking: '🍳',
  beauty: '💄', repairs: '🔨', pet: '🐾', events: '🎉',
};

export default function ExploreScreen() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [search, setSearch] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  const loadCategories = async () => {
    try {
      const cats = await categoryService.getAll();
      setCategories(cats.length > 0 ? cats : PLACEHOLDER_CATEGORIES);
    } catch {
      setCategories(PLACEHOLDER_CATEGORIES);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => { loadCategories(); }, []);

  const filtered = categories.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  const renderCategory = ({ item }: { item: Category }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => router.push(`/(customer)/category/${item.id}`)}
      activeOpacity={0.8}
    >
      <View style={styles.iconBox}>
        <Text style={styles.icon}>{item.icon || '🔧'}</Text>
      </View>
      <View style={styles.cardInfo}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.desc} numberOfLines={1}>{item.description}</Text>
        {item.serviceCount !== undefined && (
          <Text style={styles.count}>{item.serviceCount} services</Text>
        )}
      </View>
      <Ionicons name="chevron-forward" size={20} color={Colors.textMuted} />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>Explore</Text>
        <Text style={styles.subtitle}>Browse all service categories</Text>
        <Searchbar
          placeholder="Search categories..."
          value={search}
          onChangeText={setSearch}
          style={styles.searchBar}
          inputStyle={{ color: Colors.white, fontSize: FontSize.md }}
          iconColor={Colors.textMuted}
          placeholderTextColor={Colors.textMuted}
          theme={{ colors: { primary: Colors.primary } }}
        />
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        renderItem={renderCategory}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); loadCategories(); }} tintColor={Colors.primary} />
        }
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyIcon}>🔍</Text>
            <Text style={styles.emptyText}>No categories found</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const PLACEHOLDER_CATEGORIES: Category[] = [
  { id: '1', name: 'Cleaning', icon: '🧹', description: 'Professional home and office cleaning', imageURL: '', isActive: true, order: 1, serviceCount: 24 },
  { id: '2', name: 'Plumbing', icon: '🔧', description: 'Pipe repairs, installations, and maintenance', imageURL: '', isActive: true, order: 2, serviceCount: 18 },
  { id: '3', name: 'Electrical', icon: '⚡', description: 'Electrical repairs and installations', imageURL: '', isActive: true, order: 3, serviceCount: 15 },
  { id: '4', name: 'Design & Art', icon: '🎨', description: 'Graphic design and creative services', imageURL: '', isActive: true, order: 4, serviceCount: 32 },
  { id: '5', name: 'IT & Tech', icon: '💻', description: 'Computer and tech support services', imageURL: '', isActive: true, order: 5, serviceCount: 28 },
  { id: '6', name: 'Moving', icon: '📦', description: 'Home and office moving services', imageURL: '', isActive: true, order: 6, serviceCount: 12 },
  { id: '7', name: 'Gardening', icon: '🌱', description: 'Garden maintenance and landscaping', imageURL: '', isActive: true, order: 7, serviceCount: 20 },
  { id: '8', name: 'Security', icon: '🔒', description: 'Security systems and guard services', imageURL: '', isActive: true, order: 8, serviceCount: 9 },
  { id: '9', name: 'Photography', icon: '📸', description: 'Professional photography services', imageURL: '', isActive: true, order: 9, serviceCount: 35 },
  { id: '10', name: 'Tutoring', icon: '📚', description: 'Academic and skills tutoring', imageURL: '', isActive: true, order: 10, serviceCount: 45 },
  { id: '11', name: 'Fitness', icon: '💪', description: 'Personal training and fitness coaching', imageURL: '', isActive: true, order: 11, serviceCount: 22 },
  { id: '12', name: 'Beauty', icon: '💄', description: 'Hair, makeup, and beauty services', imageURL: '', isActive: true, order: 12, serviceCount: 38 },
];

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: { paddingHorizontal: Spacing.lg, paddingBottom: Spacing.md },
  title: { fontSize: FontSize.xxxl, fontWeight: '900', color: Colors.white, letterSpacing: -0.8, marginTop: Spacing.md },
  subtitle: { fontSize: FontSize.md, color: Colors.textMuted, marginBottom: Spacing.md },
  searchBar: { backgroundColor: Colors.card, borderRadius: BorderRadius.md, borderWidth: 1, borderColor: Colors.border },
  list: { paddingHorizontal: Spacing.lg, paddingTop: Spacing.md, gap: Spacing.sm },
  card: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.card,
    borderRadius: BorderRadius.md, padding: Spacing.md, gap: Spacing.md,
    borderWidth: 1, borderColor: Colors.border,
  },
  iconBox: {
    width: 52, height: 52, borderRadius: BorderRadius.sm, backgroundColor: Colors.surface,
    alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: Colors.border,
  },
  icon: { fontSize: 26 },
  cardInfo: { flex: 1 },
  name: { fontSize: FontSize.md, fontWeight: '700', color: Colors.white, marginBottom: 2 },
  desc: { fontSize: FontSize.xs, color: Colors.textMuted, marginBottom: 3 },
  count: { fontSize: FontSize.xs, color: Colors.primary, fontWeight: '600' },
  empty: { alignItems: 'center', paddingTop: 80 },
  emptyIcon: { fontSize: 48, marginBottom: Spacing.md },
  emptyText: { color: Colors.textMuted, fontSize: FontSize.md },
});
