// services/serviceService.ts
import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  serverTimestamp,
  increment,
  DocumentSnapshot,
} from 'firebase/firestore';
import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
} from 'firebase/storage';
import { db, storage } from '../lib/firebase/config';
import { Service, Category, Booking, Review, Payment, Notification } from '../types';

// ---- Categories ----
export const categoryService = {
  async getAll(): Promise<Category[]> {
    const q = query(collection(db, 'categories'), orderBy('order'), where('isActive', '==', true));
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Category));
  },

  async create(data: Omit<Category, 'id'>): Promise<string> {
    const ref = await addDoc(collection(db, 'categories'), {
      ...data,
      createdAt: serverTimestamp(),
    });
    return ref.id;
  },

  async update(id: string, data: Partial<Category>): Promise<void> {
    await updateDoc(doc(db, 'categories', id), { ...data, updatedAt: serverTimestamp() });
  },

  async delete(id: string): Promise<void> {
    await deleteDoc(doc(db, 'categories', id));
  },
};

// ---- Services ----
export const serviceService = {
  async getFeatured(limitCount = 8): Promise<Service[]> {
    const q = query(
      collection(db, 'services'),
      where('isFeatured', '==', true),
      where('isActive', '==', true),
      orderBy('rating', 'desc'),
      limit(limitCount)
    );
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({
      id: d.id,
      ...d.data(),
      createdAt: d.data().createdAt?.toDate(),
      updatedAt: d.data().updatedAt?.toDate(),
    } as Service));
  },

  async getByCategory(categoryId: string, lastDoc?: DocumentSnapshot): Promise<Service[]> {
    let q = query(
      collection(db, 'services'),
      where('categoryId', '==', categoryId),
      where('isActive', '==', true),
      orderBy('rating', 'desc'),
      limit(20)
    );
    if (lastDoc) q = query(q, startAfter(lastDoc));
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({
      id: d.id,
      ...d.data(),
      createdAt: d.data().createdAt?.toDate(),
      updatedAt: d.data().updatedAt?.toDate(),
    } as Service));
  },

  async getById(id: string): Promise<Service | null> {
    const snap = await getDoc(doc(db, 'services', id));
    if (!snap.exists()) return null;
    return {
      id: snap.id,
      ...snap.data(),
      createdAt: snap.data().createdAt?.toDate(),
      updatedAt: snap.data().updatedAt?.toDate(),
    } as Service;
  },

  async getByProvider(providerId: string): Promise<Service[]> {
    const q = query(
      collection(db, 'services'),
      where('providerId', '==', providerId),
      orderBy('createdAt', 'desc')
    );
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({
      id: d.id,
      ...d.data(),
      createdAt: d.data().createdAt?.toDate(),
      updatedAt: d.data().updatedAt?.toDate(),
    } as Service));
  },

  async search(searchTerm: string): Promise<Service[]> {
    // Simple search - in production use Algolia or Firebase full-text search
    const q = query(
      collection(db, 'services'),
      where('isActive', '==', true),
      orderBy('title'),
      limit(50)
    );
    const snap = await getDocs(q);
    const term = searchTerm.toLowerCase();
    return snap.docs
      .map((d) => ({ id: d.id, ...d.data() } as Service))
      .filter(
        (s) =>
          s.title.toLowerCase().includes(term) ||
          s.description.toLowerCase().includes(term) ||
          s.tags.some((t) => t.toLowerCase().includes(term))
      );
  },

  async create(data: Omit<Service, 'id'>): Promise<string> {
    const ref = await addDoc(collection(db, 'services'), {
      ...data,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return ref.id;
  },

  async update(id: string, data: Partial<Service>): Promise<void> {
    await updateDoc(doc(db, 'services', id), { ...data, updatedAt: serverTimestamp() });
  },

  async delete(id: string): Promise<void> {
    await deleteDoc(doc(db, 'services', id));
  },

  async uploadImage(
    serviceId: string,
    uri: string,
    onProgress?: (pct: number) => void
  ): Promise<string> {
    const response = await fetch(uri);
    const blob = await response.blob();
    const storageRef = ref(storage, `services/${serviceId}/${Date.now()}`);
    return new Promise((resolve, reject) => {
      const task = uploadBytesResumable(storageRef, blob);
      task.on(
        'state_changed',
        (snap) => onProgress && onProgress((snap.bytesTransferred / snap.totalBytes) * 100),
        reject,
        async () => resolve(await getDownloadURL(task.snapshot.ref))
      );
    });
  },
};

// ---- Bookings ----
export const bookingService = {
  async create(data: Omit<Booking, 'id'>): Promise<string> {
    const ref = await addDoc(collection(db, 'bookings'), {
      ...data,
      scheduledDate: data.scheduledDate,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return ref.id;
  },

  async getById(id: string): Promise<Booking | null> {
    const snap = await getDoc(doc(db, 'bookings', id));
    if (!snap.exists()) return null;
    return {
      id: snap.id,
      ...snap.data(),
      scheduledDate: snap.data().scheduledDate?.toDate(),
      createdAt: snap.data().createdAt?.toDate(),
      updatedAt: snap.data().updatedAt?.toDate(),
      completedAt: snap.data().completedAt?.toDate(),
    } as Booking;
  },

  async getByCustomer(customerId: string): Promise<Booking[]> {
    const q = query(
      collection(db, 'bookings'),
      where('customerId', '==', customerId),
      orderBy('createdAt', 'desc')
    );
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({
      id: d.id,
      ...d.data(),
      scheduledDate: d.data().scheduledDate?.toDate(),
      createdAt: d.data().createdAt?.toDate(),
      updatedAt: d.data().updatedAt?.toDate(),
    } as Booking));
  },

  async getByProvider(providerId: string): Promise<Booking[]> {
    const q = query(
      collection(db, 'bookings'),
      where('providerId', '==', providerId),
      orderBy('createdAt', 'desc')
    );
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({
      id: d.id,
      ...d.data(),
      scheduledDate: d.data().scheduledDate?.toDate(),
      createdAt: d.data().createdAt?.toDate(),
      updatedAt: d.data().updatedAt?.toDate(),
    } as Booking));
  },

  async updateStatus(
    id: string,
    status: Booking['status'],
    extras?: Partial<Booking>
  ): Promise<void> {
    await updateDoc(doc(db, 'bookings', id), {
      status,
      ...extras,
      updatedAt: serverTimestamp(),
      ...(status === 'completed' ? { completedAt: serverTimestamp() } : {}),
    });
  },

  async getAll(limitCount = 50): Promise<Booking[]> {
    const q = query(collection(db, 'bookings'), orderBy('createdAt', 'desc'), limit(limitCount));
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({
      id: d.id,
      ...d.data(),
      scheduledDate: d.data().scheduledDate?.toDate(),
      createdAt: d.data().createdAt?.toDate(),
      updatedAt: d.data().updatedAt?.toDate(),
    } as Booking));
  },
};

// ---- Reviews ----
export const reviewService = {
  async create(data: Omit<Review, 'id'>): Promise<string> {
    const ref = await addDoc(collection(db, 'reviews'), {
      ...data,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    // Update service rating
    const serviceRef = doc(db, 'services', data.serviceId);
    const serviceSnap = await getDoc(serviceRef);
    if (serviceSnap.exists()) {
      const { rating, totalReviews } = serviceSnap.data();
      const newTotal = (totalReviews || 0) + 1;
      const newRating = ((rating || 0) * (totalReviews || 0) + data.rating) / newTotal;
      await updateDoc(serviceRef, {
        rating: newRating,
        totalReviews: newTotal,
        updatedAt: serverTimestamp(),
      });
    }
    return ref.id;
  },

  async getByService(serviceId: string): Promise<Review[]> {
    const q = query(
      collection(db, 'reviews'),
      where('serviceId', '==', serviceId),
      where('isVisible', '==', true),
      orderBy('createdAt', 'desc')
    );
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({
      id: d.id,
      ...d.data(),
      createdAt: d.data().createdAt?.toDate(),
      updatedAt: d.data().updatedAt?.toDate(),
    } as Review));
  },

  async addProviderReply(id: string, reply: string): Promise<void> {
    await updateDoc(doc(db, 'reviews', id), {
      providerReply: reply,
      updatedAt: serverTimestamp(),
    });
  },
};

// ---- Notifications ----
export const notificationService = {
  async create(data: Omit<Notification, 'id'>): Promise<string> {
    const ref = await addDoc(collection(db, 'notifications'), {
      ...data,
      createdAt: serverTimestamp(),
    });
    return ref.id;
  },

  async getByUser(userId: string): Promise<Notification[]> {
    const q = query(
      collection(db, 'notifications'),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc'),
      limit(50)
    );
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({
      id: d.id,
      ...d.data(),
      createdAt: d.data().createdAt?.toDate(),
    } as Notification));
  },

  async markRead(id: string): Promise<void> {
    await updateDoc(doc(db, 'notifications', id), { isRead: true });
  },

  async markAllRead(userId: string): Promise<void> {
    const q = query(
      collection(db, 'notifications'),
      where('userId', '==', userId),
      where('isRead', '==', false)
    );
    const snap = await getDocs(q);
    await Promise.all(snap.docs.map((d) => updateDoc(d.ref, { isRead: true })));
  },
};

// ---- Payments ----
export const paymentService = {
  async create(data: Omit<Payment, 'id'>): Promise<string> {
    const ref = await addDoc(collection(db, 'payments'), {
      ...data,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return ref.id;
  },

  async updateStatus(id: string, status: Payment['status'], gatewayRef?: string): Promise<void> {
    await updateDoc(doc(db, 'payments', id), {
      status,
      gateway_reference: gatewayRef,
      updatedAt: serverTimestamp(),
    });
  },

  async getByBooking(bookingId: string): Promise<Payment | null> {
    const q = query(collection(db, 'payments'), where('bookingId', '==', bookingId), limit(1));
    const snap = await getDocs(q);
    if (snap.empty) return null;
    return { id: snap.docs[0].id, ...snap.docs[0].data() } as Payment;
  },

  async getByProvider(providerId: string): Promise<Payment[]> {
    const q = query(
      collection(db, 'payments'),
      where('providerId', '==', providerId),
      where('status', '==', 'completed'),
      orderBy('createdAt', 'desc')
    );
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Payment));
  },

  async getAll(limitCount = 100): Promise<Payment[]> {
    const q = query(collection(db, 'payments'), orderBy('createdAt', 'desc'), limit(limitCount));
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Payment));
  },
};
