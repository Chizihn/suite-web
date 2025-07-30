// src/store/hotelStore.ts
import { create } from "zustand";
import type { Hotel } from "../types";

interface HotelState {
  hotels: Hotel[];
  selectedHotel: Hotel | null;
  loading: boolean;
  error: string | null;
  searchQuery: string;
  // Keep original methods commented for fallback
  // fetchHotels: () => Promise<void>;
  setSelectedHotel: (hotel: Hotel | null) => void;
  setSearchQuery: (query: string) => void;
  getHotelById: (id: string) => Hotel | undefined;
  setError: (error: string | null) => void;
  // New methods for API integration
  setHotels: (hotels: Hotel[]) => void;
  setLoading: (loading: boolean) => void;
}

export const useHotelStore = create<HotelState>((set, get) => ({
  hotels: [],
  selectedHotel: null,
  loading: false,
  error: null,
  searchQuery: "",
  
  // COMMENTED OUT: Original mock fetch method (keep for fallback)
  /*
  fetchHotels: async () => {
    console.log('🔄 [MOCK] Fetching hotels with mock data...');
    set({ loading: true, error: null });
    // Mock API call with error simulation
    await new Promise((resolve) => setTimeout(resolve, 1000));
    if (Math.random() < 0.2) {
      console.error('❌ [MOCK] Simulated error occurred');
      set({
        loading: false,
        error: "Failed to fetch hotels. Please try again.",
      });
      return;
    }
    console.log('✅ [MOCK] Mock hotels loaded:', mockHotels.length, 'hotels');
    set({ hotels: mockHotels, loading: false, error: null });
  },
  */

  // New methods for API integration
  setHotels: (hotels) => {
    console.log('🏨 [STORE] Setting hotels in store:', hotels.length, 'hotels');
    set({ hotels, error: null });
  },
  
  setLoading: (loading) => {
    console.log('⏳ [STORE] Setting loading state:', loading);
    set({ loading });
  },
  
  setSelectedHotel: (hotel) => {
    console.log('🎯 [STORE] Setting selected hotel:', hotel?.name || 'null');
    set({ selectedHotel: hotel });
  },
  
  setSearchQuery: (query) => {
    console.log('🔍 [STORE] Setting search query:', query);
    set({ searchQuery: query });
  },
  
  getHotelById: (id) => {
    const hotel = get().hotels.find((hotel) => hotel.id === id);
    console.log('🔍 [STORE] Getting hotel by ID:', id, hotel ? 'found' : 'not found');
    return hotel;
  },
  
  setError: (error) => {
    console.log('❌ [STORE] Setting error:', error);
    set({ error });
  },
}));