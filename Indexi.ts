// store/index.ts
import { create } from 'zustand';
import { User, CartItem, Notification } from '../types';

interface AuthState {
  user: User | null;
  isLoading: boolean;
  isInitialized: boolean;
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  setInitialized: (init: boolean) => void;
  clearUser: () => void;
}

interface CartState {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (serviceId: string) => void;
  updateQuantity: (serviceId: string, qty: number) => void;
  clearCart: () => void;
  total: () => number;
}

interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  setNotifications: (notifs: Notification[]) => void;
  markRead: (id: string) => void;
  markAllRead: () => void;
  addNotification: (notif: Notification) => void;
}

interface ThemeState {
  isDark: boolean;
  toggleTheme: () => void;
  setDark: (dark: boolean) => void;
}

// Auth Store
export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: true,
  isInitialized: false,
  setUser: (user) => set({ user }),
  setLoading: (isLoading) => set({ isLoading }),
  setInitialized: (isInitialized) => set({ isInitialized }),
  clearUser: () => set({ user: null }),
}));

// Cart Store
export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  addItem: (item) =>
    set((state) => {
      const exists = state.items.find((i) => i.serviceId === item.serviceId);
      if (exists) {
        return {
          items: state.items.map((i) =>
            i.serviceId === item.serviceId ? { ...i, quantity: i.quantity + 1 } : i
          ),
        };
      }
      return { items: [...state.items, { ...item, quantity: 1 }] };
    }),
  removeItem: (serviceId) =>
    set((state) => ({ items: state.items.filter((i) => i.serviceId !== serviceId) })),
  updateQuantity: (serviceId, qty) =>
    set((state) => ({
      items:
        qty <= 0
          ? state.items.filter((i) => i.serviceId !== serviceId)
          : state.items.map((i) => (i.serviceId === serviceId ? { ...i, quantity: qty } : i)),
    })),
  clearCart: () => set({ items: [] }),
  total: () =>
    get().items.reduce((sum, item) => sum + item.price * item.quantity, 0),
}));

// Notification Store
export const useNotificationStore = create<NotificationState>((set) => ({
  notifications: [],
  unreadCount: 0,
  setNotifications: (notifications) =>
    set({
      notifications,
      unreadCount: notifications.filter((n) => !n.isRead).length,
    }),
  markRead: (id) =>
    set((state) => ({
      notifications: state.notifications.map((n) =>
        n.id === id ? { ...n, isRead: true } : n
      ),
      unreadCount: Math.max(0, state.unreadCount - 1),
    })),
  markAllRead: () =>
    set((state) => ({
      notifications: state.notifications.map((n) => ({ ...n, isRead: true })),
      unreadCount: 0,
    })),
  addNotification: (notif) =>
    set((state) => ({
      notifications: [notif, ...state.notifications],
      unreadCount: notif.isRead ? state.unreadCount : state.unreadCount + 1,
    })),
}));

// Theme Store
export const useThemeStore = create<ThemeState>((set) => ({
  isDark: true,
  toggleTheme: () => set((state) => ({ isDark: !state.isDark })),
  setDark: (isDark) => set({ isDark }),
}));
