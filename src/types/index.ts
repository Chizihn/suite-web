// export * from "./booking";
// export * from "./hotel";
// export * from "./review";


export interface Hotel {
    id: {id: string};
    objectId: string;
    name: string;
    physical_address: string;
    owner: string; 
    treasury: number; 
    imageUrl: string;
    rooms?: Room[]; 
    reviews?: Review[]; 
    averageRating?: number; 
    reviewCount?: number; 
  }
  

  export interface Room {
    objectId: string;
    hotel_id: string;
    id: { id: string };
    image_blob_id: string;
    is_booked: boolean;
    price_per_day: string;
    imageUrl: string;
  }
  
  export interface Reservation {
    id: string;
    roomId: string;
    hotelId: string;
    hotelName: string;
    guestAddress: string;
    startDate: number; // Timestamp
    endDate: number; // Timestamp
    totalCost: number;
    isActive: boolean;
  }
  
  export interface Review {
    _id: string; // Maps to _id from API
    hotelId: string;
    reservationId: string;
    guest: string; // Maps to guest (wallet address)
    rating: number; // 1-5
    comment: string;
    createdAt: string; // ISO date string from API
    __v?: number; // Optional, as it's typically a Mongoose version field
  }
  
  export interface BookingData {
    id: string;
    hotelId: string;
    hotelName: string;
    hotelImage: string;
    roomId: string;
    checkIn: string; // ISO date string
    checkOut: string; // ISO date string
    guests: number;
    nights: number;
    totalPrice: number;
    status: string;
    transactionId: string;
  }