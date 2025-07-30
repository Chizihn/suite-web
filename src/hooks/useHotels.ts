// src/hooks/useHotels.ts
import { useQuery, type UseQueryResult, } from '@tanstack/react-query';
import type { Hotel } from '../types';
import { hotelApi, transformApiHotelToHotel, type ApiHotel } from '../libs/api';

// Query keys for cache management
export const HOTEL_QUERY_KEYS = {
  all: ['hotels'] as const,
  detail: (id: string) => ['hotels', id] as const,
  rooms: (hotelId: string) => ['hotels', hotelId, 'rooms'] as const,
  reservations: (guestAddress: string) => ['reservations', guestAddress] as const,
};

// Custom hook for fetching all hotels
export const useHotels = (): UseQueryResult<Hotel[], Error> & {
  rawData: ApiHotel[] | undefined;
} => {
  console.log('🔄 useHotels hook called');
  
  const query = useQuery({
    queryKey: HOTEL_QUERY_KEYS.all,
    queryFn: async () => {
      console.log('🔄 Query function executing...');
      try {
        const apiHotels = await hotelApi.getAllHotels();
        console.log('🔄 Raw API data:', apiHotels);
        
        // Transform API data to frontend format
        const transformedHotels = apiHotels.map(transformApiHotelToHotel);
        console.log('🔄 Transformed hotels:', transformedHotels);
        
        return transformedHotels;
      } catch (error) {
        console.error('❌ Error in useHotels query:', error);
        throw error;
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  // Get raw API data for debugging
  const rawQuery = useQuery({
    queryKey: [...HOTEL_QUERY_KEYS.all, 'raw'],
    queryFn: hotelApi.getAllHotels,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });

  console.log('🔄 Query state:', {
    isLoading: query.isLoading,
    isError: query.isError,
    isSuccess: query.isSuccess,
    dataLength: query.data?.length,
    error: query.error?.message,
  });

  return {
    ...query,
    rawData: rawQuery.data,
  };
};

// Custom hook for fetching hotel rooms
export const useHotelRooms = (hotelId: string) => {
  console.log('🔄 useHotelRooms hook called for hotel:', hotelId);
  
  return useQuery({
    queryKey: HOTEL_QUERY_KEYS.rooms(hotelId),
    queryFn: () => hotelApi.getHotelRooms(hotelId),
    enabled: !!hotelId, // Only run query if hotelId exists
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Custom hook for fetching user reservations
export const useReservations = (guestAddress: string) => {
  console.log('🔄 useReservations hook called for guest:', guestAddress);
  
  return useQuery({
    queryKey: HOTEL_QUERY_KEYS.reservations(guestAddress),
    queryFn: () => hotelApi.getReservations(guestAddress),
    enabled: !!guestAddress, // Only run query if guestAddress exists
    staleTime: 1 * 60 * 1000, // 1 minute
    gcTime: 3 * 60 * 1000, // 3 minutes
  });
};