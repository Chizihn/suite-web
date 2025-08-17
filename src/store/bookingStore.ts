import { create } from 'zustand';
import type { Reservation } from '../types';

interface BookingState {
  bookings: Reservation[];
  currentBooking: Reservation | null;
  loading: boolean;
  error: string | null;
  setBookings: (bookings: Reservation[]) => void;
  setCurrentBooking: (booking: Reservation | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useBookingStore = create<BookingState>((set) => ({
  bookings: [],
  currentBooking: null,
  loading: false,
  error: null,

  setBookings: (bookings: Reservation[]) => {
    console.log('📋 [STORE] Setting bookings:', bookings.length);
    set({
      bookings: bookings.filter(
        (booking, index, self) => index === self.findIndex((b) => b.id === booking.id)
      ),
      error: null,
    });
  },

  setCurrentBooking: (booking: Reservation | null) => {
    console.log('🎯 [STORE] Setting current booking:', booking?.id || 'null');
    set({ currentBooking: booking, error: null });
  },

  setLoading: (loading: boolean) => {
    console.log('⏳ [STORE] Setting loading state:', loading);
    set({ loading, error: null });
  },

  setError: (error: string | null) => {
    console.log('❌ [STORE] Setting error:', error);
    set({ error });
  },
}));