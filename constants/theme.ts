// constants/theme.ts
import { MD3DarkTheme, MD3LightTheme } from 'react-native-paper';
import type { MD3Theme } from 'react-native-paper';

export const Colors = {
  primary: '#FF6B00',
  primaryDark: '#CC5500',
  primaryLight: '#FF8C33',
  background: '#0A0A0A',
  backgroundLight: '#FFFFFF',
  surface: '#1A1A1A',
  surfaceLight: '#F5F5F5',
  card: '#242424',
  cardLight: '#FFFFFF',
  text: '#FFFFFF',
  textLight: '#0A0A0A',
  textMuted: '#888888',
  textMutedLight: '#666666',
  border: '#333333',
  borderLight: '#E0E0E0',
  success: '#22C55E',
  error: '#EF4444',
  warning: '#F59E0B',
  info: '#3B82F6',
  orange: '#FF6B00',
  white: '#FFFFFF',
  black: '#0A0A0A',
  gold: '#FFB800',
  overlay: 'rgba(0,0,0,0.6)',
};

export const DarkTheme: MD3Theme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    primary: Colors.primary,
    primaryContainer: Colors.primaryDark,
    secondary: Colors.primaryLight,
    background: Colors.background,
    surface: Colors.surface,
    surfaceVariant: Colors.card,
    onPrimary: Colors.white,
    onBackground: Colors.text,
    onSurface: Colors.text,
    outline: Colors.border,
    error: Colors.error,
    onError: Colors.white,
    elevation: {
      level0: 'transparent',
      level1: '#1E1E1E',
      level2: '#222222',
      level3: '#262626',
      level4: '#282828',
      level5: '#2C2C2C',
    },
  },
};

export const LightTheme: MD3Theme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: Colors.primary,
    primaryContainer: '#FFE4CC',
    secondary: Colors.primaryLight,
    background: Colors.backgroundLight,
    surface: Colors.surfaceLight,
    surfaceVariant: '#F0F0F0',
    onPrimary: Colors.white,
    onBackground: Colors.textLight,
    onSurface: Colors.textLight,
    outline: Colors.borderLight,
    error: Colors.error,
    onError: Colors.white,
    elevation: {
      level0: 'transparent',
      level1: '#F8F8F8',
      level2: '#F5F5F5',
      level3: '#F0F0F0',
      level4: '#EBEBEB',
      level5: '#E8E8E8',
    },
  },
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const BorderRadius = {
  sm: 6,
  md: 12,
  lg: 18,
  xl: 24,
  full: 9999,
};

export const FontSize = {
  xs: 11,
  sm: 13,
  md: 15,
  lg: 17,
  xl: 20,
  xxl: 24,
  xxxl: 30,
  display: 38,
};

export const FontWeight = {
  regular: '400' as const,
  medium: '500' as const,
  semibold: '600' as const,
  bold: '700' as const,
  black: '900' as const,
};

export const Shadow = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.18,
    shadowRadius: 2,
    elevation: 2,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.24,
    shadowRadius: 6,
    elevation: 5,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 10,
  },
};
