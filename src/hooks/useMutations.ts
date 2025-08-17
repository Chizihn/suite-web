import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient, createHotel } from '../libs/api';
import { useBookingStore } from '../store/bookingStore';
import { queryClient } from '../libs/queryClient';
import { useWallet } from '../contexts/WalletContext';

interface BookRoomData {
  roomId: string;
  hotelId: string;
  fullName: string;
  email: string;
  phone: string;
  startDate: string; // ISO date string (YYYY-MM-DD)
  endDate: string; // ISO date string (YYYY-MM-DD)
  paymentCoinId: string;

}

interface BookRoomResponse {
  transactionBlock: string;
  reservationId: string;
}

export const useBookRoom = () => {
  const {address} = useWallet()
  const {  setError } = useBookingStore();

  return useMutation<BookRoomResponse, Error, BookRoomData>({
    mutationFn: async (data) => {
      console.log('📡 Booking room:', data);
      const response = await apiClient.post('/api/transactions/book-room', data);
      console.log('✅ Booking transaction prepared:', response.data);
      return response.data;
    },
    onSuccess: () => {
      console.log('Booking successful');
      // Invalidate reservations query to refetch bookings
      queryClient.invalidateQueries({ queryKey: ['reservations', address] });
      // Set current booking in store (optimistic update)
 
    },
    onError: (error) => {
      console.error('Booking failed:', error);
      setError(error.message);
    },
  });
};

export const useSubmitReview = (hotelId: string) => {
  const queryClient = useQueryClient();
  const { setError } = useBookingStore();

  return useMutation({
    mutationFn: async (data: {
      reservationId: string;
      guest: string;
      rating: number;
      comment: string;
    }) => {
      console.log('📡 Submitting review for hotel:', hotelId);
      const response = await apiClient.post(`/api/transactions/hotels/${hotelId}/review`, data);
      console.log('✅ Review transaction prepared');
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews', hotelId] });
    },
    onError: (error) => {
      console.error('Review submission failed:', error);
      setError(error.message);
    },
  });
};

export const useCreateHotel = () => {
  const wallet = useWallet();  const { setError } = useBookingStore();

  return useMutation({
    mutationFn: async (data: { name: string; physicalAddress: string; image: File }) => {
      const formData = new FormData();
      formData.append('name', data.name);
      formData.append('physicalAddress', data.physicalAddress);
      formData.append('image', data.image);
      
      const response = await createHotel(formData);
      // Use the wallet's signTransaction if available, otherwise just return the response
      if (wallet.signTransaction) {
        const result = await wallet.signTransaction(response.transactionBlock);
        return result;
      }
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hotels'] });
    },
    onError: (error) => {
      console.error('Hotel creation failed:', error);
      setError(error.message);
    },
  });
};