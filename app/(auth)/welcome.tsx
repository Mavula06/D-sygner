// app/(auth)/welcome.tsx
import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  FlatList,
  TouchableOpacity,
  Animated,
} from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { Colors, Spacing, FontSize, BorderRadius } from '../../constants/theme';

const { width, height } = Dimensions.get('window');

const slides = [
  {
    id: '1',
    emoji: '✦',
    title: 'Book Services\nAnywhere',
    subtitle: 'Connect with top professionals in your area for any service you need.',
    accent: Colors.primary,
  },
  {
    id: '2',
    emoji: '◈',
    title: 'Verified\nProfessionals',
    subtitle: 'All service providers are vetted and reviewed by real customers.',
    accent: '#FF8C33',
  },
  {
    id: '3',
    emoji: '⬡',
    title: 'Secure\nPayments',
    subtitle: 'Multiple payment options with full transaction protection and receipts.',
    accent: Colors.primary,
  },
];

export default function WelcomeScreen() {
  const [current, setCurrent] = useState(0);
  const flatListRef = useRef<FlatList>(null);
  const fadeAnim = useRef(new Animated.Value(1)).current;

  const goNext = () => {
    if (current < slides.length - 1) {
      const next = current + 1;
      flatListRef.current?.scrollToIndex({ index: next });
      setCurrent(next);
    } else {
      router.push('/(auth)/login');
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <LinearGradient colors={['#0A0A0A', '#1A1A1A', '#0A0A0A']} style={StyleSheet.absoluteFill} />

      {/* Logo */}
      <View style={styles.logoContainer}>
        <Text style={styles.logo}>D,sygner</Text>
        <View style={styles.logoDot} />
      </View>

      {/* Slides */}
      <FlatList
        ref={flatListRef}
        data={slides}
        horizontal
        pagingEnabled
        scrollEnabled={false}
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.slide}>
            <View style={[styles.iconContainer, { borderColor: item.accent }]}> 
              <Text style={[styles.icon, { color: item.accent }]}>{item.emoji}</Text>
            </View>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.subtitle}>{item.subtitle}</Text>
          </View>
        )}
      />

      {/* Dots */}
      <View style={styles.dotsContainer}>
        {slides.map((_, i) => (
          <View
            key={i}
            style={[
              styles.dot,
              i === current && styles.dotActive,
            ]}
          />
        ))}
      </View>

      {/* CTA */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.primaryBtn} onPress={goNext} activeOpacity={0.85}>
          <LinearGradient
            colors={[Colors.primary, Colors.primaryDark]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.btnGradient}
          >
            <Text style={styles.primaryBtnText}>
              {current === slides.length - 1 ? 'Get Started' : 'Continue'}
            </Text>
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push('/(auth)/register')} style={styles.secondaryBtn}>
          <Text style={styles.secondaryBtnText}>
            New here?{' '}
            <Text style={{ color: Colors.primary }}>Create account</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 70,
    paddingHorizontal: Spacing.lg,
  },
  logo: {
    fontSize: 28,
    fontWeight: '900',
    color: Colors.white,
    letterSpacing: -0.5,
  },
  logoDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.primary,
    marginLeft: 4,
    marginTop: -12,
  },
  slide: {
    width,
    paddingHorizontal: Spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    paddingTop: Spacing.xxl,
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.xl,
  },
  icon: {
    fontSize: 52,
  },
  title: {
    fontSize: 40,
    fontWeight: '900',
    color: Colors.white,
    textAlign: 'center',
    lineHeight: 46,
    letterSpacing: -1,
    marginBottom: Spacing.md,
  },
  subtitle: {
    fontSize: FontSize.md,
    color: Colors.textMuted,
    textAlign: 'center',
    lineHeight: 24,
    maxWidth: 300,
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    marginBottom: Spacing.xl,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.border,
  },
  dotActive: {
    width: 24,
    backgroundColor: Colors.primary,
  },
  footer: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: 50,
    gap: Spacing.md,
  },
  primaryBtn: {
    borderRadius: BorderRadius.md,
    overflow: 'hidden',
  },
  btnGradient: {
    paddingVertical: 18,
    alignItems: 'center',
  },
  primaryBtnText: {
    color: Colors.white,
    fontSize: FontSize.lg,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  secondaryBtn: {
    alignItems: 'center',
    paddingVertical: Spacing.sm,
  },
  secondaryBtnText: {
    color: Colors.textMuted,
    fontSize: FontSize.md,
  },
});
