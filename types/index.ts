// types/index.ts
export type UserRole = 'customer' | 'provider' | 'admin';

export interface User {
  id: string;
  email: string;
  displayName: string;
  photoURL?: string;
  role: UserRole;
  phone?: string;
  address?: string;
  bio?: string;
  isVerified: boolean;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  fcmToken?: string;
  rating?: number;
  totalReviews?: number;
  // Provider-specific
  businessName?: string;
  businessDescription?: string;
  serviceCategories?: string[];
  totalEarnings?: number;
  availabilitySchedule?: AvailabilitySchedule;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  icon: string;
  imageURL: string;
  isActive: boolean;
  order: number;
  serviceCount?: number;
}

export interface Service {
  id: string;
  providerId: string;
  providerName: string;
  providerPhoto?: string;
  providerRating?: number;
  categoryId: string;
  categoryName: string;
  title: string;
  description: string;
  shortDescription: string;
  images: string[];
  price: number;
  priceType: 'fixed' | 'hourly' | 'quote';
  currency: string;
  duration?: number; // minutes
  location?: string;
  tags: string[];
  isActive: boolean;
  isFeatured: boolean;
  rating: number;
  totalReviews: number;
  totalBookings: number;
  createdAt: Date;
  updatedAt: Date;
}

export type BookingStatus =
  | 'pending'
  | 'confirmed'
  | 'in_progress'
  | 'completed'
  | 'cancelled'
  | 'rejected';

export interface Booking {
  id: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  providerId: string;
  providerName: string;
  serviceId: string;
  serviceName: string;
  serviceImage?: string;
  status: BookingStatus;
  scheduledDate: Date;
  scheduledTime: string;
  duration?: number;
  price: number;
  currency: string;
  totalAmount: number;
  notes?: string;
  address?: string;
  paymentStatus: 'pending' | 'paid' | 'refunded' | 'failed';
  paymentMethod?: string;
  paymentReference?: string;
  createdAt: Date;
  updatedAt: Date;
  cancelReason?: string;
  completedAt?: Date;
}

export interface Payment {
  id: string;
  bookingId: string;
  customerId: string;
  providerId: string;
  amount: number;
  currency: string;
  method: 'payfast' | 'yoco' | 'peach';
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  reference: string;
  gateway_reference?: string;
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

export interface Review {
  id: string;
  bookingId: string;
  serviceId: string;
  customerId: string;
  customerName: string;
  customerPhoto?: string;
  providerId: string;
  rating: number;
  comment: string;
  images?: string[];
  providerReply?: string;
  isVisible: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  senderPhoto?: string;
  receiverId: string;
  text?: string;
  imageURL?: string;
  type: 'text' | 'image' | 'system';
  isRead: boolean;
  createdAt: Date;
}

export interface Conversation {
  id: string;
  participants: string[];
  participantDetails: {
    [userId: string]: {
      name: string;
      photo?: string;
      role: UserRole;
    };
  };
  lastMessage?: string;
  lastMessageTime?: Date;
  lastMessageSenderId?: string;
  unreadCount: { [userId: string]: number };
  bookingId?: string;
  serviceId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  body: string;
  type:
    | 'booking_request'
    | 'booking_confirmed'
    | 'booking_cancelled'
    | 'booking_completed'
    | 'payment_received'
    | 'new_review'
    | 'new_message'
    | 'system';
  data?: Record<string, any>;
  isRead: boolean;
  createdAt: Date;
}

export interface CartItem {
  serviceId: string;
  serviceName: string;
  serviceImage?: string;
  providerId: string;
  providerName: string;
  price: number;
  currency: string;
  quantity: number;
}

export interface AvailabilitySchedule {
  monday: DaySchedule;
  tuesday: DaySchedule;
  wednesday: DaySchedule;
  thursday: DaySchedule;
  friday: DaySchedule;
  saturday: DaySchedule;
  sunday: DaySchedule;
}

export interface DaySchedule {
  isAvailable: boolean;
  startTime: string;
  endTime: string;
}

export interface Analytics {
  totalRevenue: number;
  totalBookings: number;
  completedBookings: number;
  cancelledBookings: number;
  activeUsers: number;
  activeProviders: number;
  activeServices: number;
  revenueByMonth: { month: string; revenue: number }[];
  bookingsByStatus: { status: string; count: number }[];
  topServices: { name: string; bookings: number }[];
  topProviders: { name: string; earnings: number }[];
}

export interface PaymentConfig {
  provider: 'payfast' | 'yoco' | 'peach';
  amount: number;
  currency: string;
  description: string;
  reference: string;
  customerEmail: string;
  customerName: string;
  returnUrl?: string;
  cancelUrl?: string;
  notifyUrl?: string;
}
