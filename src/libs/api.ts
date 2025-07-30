// src/services/api.ts
import axios from 'axios';
import type { Hotel } from '../types';

const API_BASE_URL = 'https://suite-be.vercel.app';

// Create axios instance with base configuration
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor for logging
apiClient.interceptors.request.use(
  (config) => {
    console.log('🚀 API Request:', {
      method: config.method?.toUpperCase(),
      url: config.url,
      baseURL: config.baseURL,
      fullURL: `${config.baseURL}${config.url}`,
    });
    return config;
  },
  (error) => {
    console.error('❌ Request Error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for logging
apiClient.interceptors.response.use(
  (response) => {
    console.log('✅ API Response:', {
      status: response.status,
      url: response.config.url,
      data: response.data,
    });
    return response;
  },
  (error) => {
    console.error('❌ Response Error:', {
      status: error.response?.status,
      url: error.config?.url,
      message: error.message,
      data: error.response?.data,
    });
    return Promise.reject(error);
  }
);

// API Types based on your backend documentation
export interface ApiHotel {
  objectId: string;
  name: string;
  physical_address: string;
  owner: string; // address
  treasury: number; // SUI balance
}

export interface ApiRoom {
  objectId: string;
  hotel_id: string;
  price_per_day: number;
  is_booked: boolean;
  image_blob_id: string; // Cloudinary URL
}

export interface ApiReservation {
  objectId: string;
  room_id: string;
  hotel_id: string;
  guest_address: string; // address
  start_date: number;
  end_date: number;
  total_cost: number;
  is_active: boolean;
}

// API Service functions
export const hotelApi = {
  // GET /hotels/all
  getAllHotels: async (): Promise<ApiHotel[]> => {
    console.log('📡 Fetching all hotels...');
    const response = await apiClient.get<ApiHotel[]>('/api/hotels/all');
    console.log('🏨 Hotels received:', response.data.length, 'hotels');
    return response.data;
  },

  // GET /hotels/:hotelId/rooms
  getHotelRooms: async (hotelId: string): Promise<ApiRoom[]> => {
    console.log('📡 Fetching rooms for hotel:', hotelId);
    const response = await apiClient.get<ApiRoom[]>(`/api//hotels/${hotelId}/rooms`);
    console.log('🛏️ Rooms received:', response.data.length, 'rooms');
    return response.data;
  },

  // GET /reservations?guestAddress=...
  getReservations: async (guestAddress: string): Promise<ApiReservation[]> => {
    console.log('📡 Fetching reservations for guest:', guestAddress);
    const response = await apiClient.get<ApiReservation[]>('/reservations', {
      params: { guestAddress }
    });
    console.log('📋 Reservations received:', response.data.length, 'reservations');
    return response.data;
  },
};

// Transform functions to convert API data to your frontend types
export const transformApiHotelToHotel = (apiHotel: ApiHotel): Hotel => {
  return {
    id: apiHotel.objectId,
    name: apiHotel.name,
    description: `Located at ${apiHotel.physical_address}`, // Since API doesn't provide description
    rating: 4.5, // Default rating since API doesn't provide this
    reviewCount: 0, // Default since API doesn't provide this
    price: 200, // Default price, you might want to calculate from rooms
    images: [
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'
    ], // Default images since API doesn't provide hotel images directly
    amenities: ['Free WiFi', 'Pool', 'Parking'], // Default amenities
    location: apiHotel.physical_address,
    reviews: [], // Empty reviews array
  };
};