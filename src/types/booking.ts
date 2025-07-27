export interface Booking {
  id: string;
  hotelId: string;
  hotelName: string;
  hotelImage: string;
  roomType: string;
  checkIn: string;
  checkOut: string;
  nights: number;
  guests: number;
  totalPrice: number;
  status: "confirmed" | "pending" | "cancelled";
  transactionId: string;
  nftToken?: string;
}
