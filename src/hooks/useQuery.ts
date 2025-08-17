import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../libs/api';
import { useBookingStore } from '../store/bookingStore';
import type { Hotel, Room, Reservation, Review } from '../types';

export const useHotels = () => {
  return useQuery<Hotel[], Error>({
    queryKey: ['hotels'],
    queryFn: async () => {
      const res = await apiClient.get<Hotel[]>('/api/hotels/all');
      return res.data.map(hotel => ({
        ...hotel,
        imageUrl: hotel.imageUrl || 'https://via.placeholder.com/1000',
      }));
    },
    staleTime: 5 * 60 * 1000,
  });
};

export const useHotel = (hotelId: string) => {
  return useQuery<Hotel, Error>({
    queryKey: ['hotel', hotelId],
    queryFn: async () => {
      const res = await apiClient.get<Hotel>(`/api/hotels/${hotelId}`);
      return res.data;
    },
    staleTime: 5 * 60 * 1000,
  });
};

export const useHotelRooms = (hotelId?: string) => {
  return useQuery<Room[], Error>({
    queryKey: ['rooms', hotelId],
    enabled: !!hotelId,
    queryFn: async () => {
      if (!hotelId) throw new Error('Hotel ID is required');
      const res = await apiClient.get<Room[]>(`/api/hotels/${hotelId}/rooms`);
      return res.data.map(room => ({
        ...room,
        imageUrl: room.imageUrl || 'https://via.placeholder.com/100',
      }));
    },
    staleTime: 5 * 60 * 1000,
  });
};

export const useReservations = (guestAddress?: string) => {
  const { setBookings } = useBookingStore();

  return useQuery<Reservation[], Error>({
    queryKey: ['reservations', guestAddress],
    enabled: !!guestAddress,
    queryFn: async () => {
      if (!guestAddress) throw new Error('Guest address is required');
      const res = await apiClient.get<Reservation[]>('/api/reservations', {
        params: { guestAddress },
      });
      setBookings(res.data); // Sync with store
      return res.data;
    },
    staleTime: 5 * 60 * 1000,

  });
};



export const useReviews = (hotelId?: string) => {
  return useQuery<Review[], Error>({
    queryKey: ['reviews', hotelId],
    enabled: !!hotelId,
    queryFn: async () => {
      if (!hotelId) throw new Error('Hotel ID is required');
      const res = await apiClient.get<Review[]>(`/api/hotels/${hotelId}/reviews`);
      return res.data; // API response already matches Review interface
    },
    staleTime: 5 * 60 * 1000,
  });
};