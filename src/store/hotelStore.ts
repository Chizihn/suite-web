import { create } from "zustand";
import { mockHotels } from "../data";
import type { Hotel } from "../types";

interface HotelState {
  hotels: Hotel[];
  selectedHotel: Hotel | null;
  loading: boolean;
  error: string | null;
  searchQuery: string;
  fetchHotels: () => Promise<void>;
  setSelectedHotel: (hotel: Hotel | null) => void;
  setSearchQuery: (query: string) => void;
  getHotelById: (id: string) => Hotel | undefined;
  setError: (error: string | null) => void;
}

export const useHotelStore = create<HotelState>((set, get) => ({
  hotels: [],
  selectedHotel: null,
  loading: false,
  error: null,
  searchQuery: "",
  fetchHotels: async () => {
    set({ loading: true, error: null });
    // Mock API call with error simulation
    await new Promise((resolve) => setTimeout(resolve, 1000));
    if (Math.random() < 0.2) {
      set({
        loading: false,
        error: "Failed to fetch hotels. Please try again.",
      });
      return;
    }
    set({ hotels: mockHotels, loading: false, error: null });
  },
  setSelectedHotel: (hotel) => set({ selectedHotel: hotel }),
  setSearchQuery: (query) => set({ searchQuery: query }),
  getHotelById: (id) => get().hotels.find((hotel) => hotel.id === id),
  setError: (error) => set({ error }),
}));
