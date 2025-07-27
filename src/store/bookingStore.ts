import { create } from "zustand";
import { mockBookings } from "../data";
import type { Booking } from "../types";

interface BookingState {
  bookings: Booking[];
  savedBookings: Booking[];
  currentBooking: Booking | null;
  loading: boolean;
  error: string | null;

  fetchBookings: () => Promise<void>;
  createBooking: (
    bookingData: Omit<Booking, "id" | "status" | "transactionId">
  ) => Promise<Booking>;
  setCurrentBooking: (booking: Booking | null) => void;
  saveBooking: (booking: Booking) => void;
  removeSavedBooking: (bookingId: string) => void;
  isBookingSaved: (bookingId: string) => boolean;
}

export const useBookingStore = create<BookingState>((set, get) => ({
  bookings: [],
  savedBookings: [],
  currentBooking: null,
  loading: false,
  error: null,

  fetchBookings: async () => {
    set({ loading: true });
    // Mock API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    if (Math.random() < 0.2) {
      set({
        loading: false,
        error: "Failed to fetch hotels. Please try again.",
      });
      return;
    }

    set({ bookings: mockBookings, loading: false });
  },

  createBooking: async (bookingData) => {
    set({ loading: true });
    // Mock API call
    await new Promise((resolve) => setTimeout(resolve, 2000));
    const newBooking: Booking = {
      ...bookingData,
      id: Date.now().toString(),
      status: "confirmed",
      transactionId: `0x${Math.random()
        .toString(16)
        .substr(2, 8)}...${Math.random().toString(16).substr(2, 8)}`,
      nftToken: "QR_CODE_DATA",
    };
    set((state) => ({
      bookings: [...state.bookings, newBooking],
      currentBooking: newBooking,
      loading: false,
    }));
    return newBooking;
  },

  setCurrentBooking: (booking) => set({ currentBooking: booking }),

  saveBooking: (booking) => {
    set((state) => {
      const isAlreadySaved = state.savedBookings.some(
        (saved) => saved.id === booking.id
      );
      if (isAlreadySaved) {
        return state; // Don't add duplicates
      }
      return {
        savedBookings: [...state.savedBookings, booking],
      };
    });
  },

  removeSavedBooking: (bookingId) => {
    set((state) => ({
      savedBookings: state.savedBookings.filter(
        (booking) => booking.id !== bookingId
      ),
    }));
  },

  isBookingSaved: (bookingId) => {
    const { savedBookings } = get();
    return savedBookings.some((booking) => booking.id === bookingId);
  },
}));
