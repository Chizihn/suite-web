import { create } from 'zustand';
import type { Hotel, Room, Review } from '../types';

interface HotelState {
  hotels: Hotel[];
  selectedHotel: Hotel | null;
  loading: boolean;
  error: string | null;
  setHotels: (hotels: Hotel[]) => void;
  setSelectedHotel: (hotel: Hotel | null) => void;
  getHotelById: (id: string) => Hotel | undefined;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  updateHotelRooms: (hotelId: string, rooms: Room[]) => void;
  updateHotelReviews: (hotelId: string, reviews: Review[]) => void;
}

export const useHotelStore = create<HotelState>((set, get) => ({
  hotels: [],
  selectedHotel: null,
  loading: false,
  error: null,

  setHotels: (hotels) => {
    console.log('🏨 [STORE] Setting hotels:', hotels.length);
    set({ hotels, error: null });
  },

  setSelectedHotel: (hotel) => {
    console.log('🎯 [STORE] Setting selected hotel:', hotel?.name || 'null');
    set({ selectedHotel: hotel });
  },

  getHotelById: (id) => {
    const hotel = get().hotels.find((hotel) => hotel.id.id === id);
    console.log('🔍 [STORE] Getting hotel by ID:', id, hotel ? 'found' : 'not found');
    return hotel;
  },

  setLoading: (loading) => {
    console.log('⏳ [STORE] Setting loading state:', loading);
    set({ loading });
  },

  setError: (error) => {
    console.log('❌ [STORE] Setting error:', error);
    set({ error });
  },

  updateHotelRooms: (hotelId, rooms) => {
    set((state) => ({
      hotels: state.hotels.map((hotel) =>
        hotel.id.id === hotelId ? { ...hotel, rooms } : hotel
      ),
      selectedHotel:
        state.selectedHotel?.id.id === hotelId
          ? { ...state.selectedHotel, rooms }
          : state.selectedHotel,
    }));
  },

  updateHotelReviews: (hotelId, reviews) => {
    const averageRating =
      reviews.length > 0
        ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
        : 0;
    set((state) => ({
      hotels: state.hotels.map((hotel) =>
        hotel.id.id === hotelId
          ? { ...hotel, reviews, averageRating, reviewCount: reviews.length }
          : hotel
      ),
      selectedHotel:
        state.selectedHotel?.id.id === hotelId
          ? { ...state.selectedHotel, reviews, averageRating, reviewCount: reviews.length }
          : state.selectedHotel,
    }));
  },
}));