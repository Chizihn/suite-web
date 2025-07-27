import type { Review } from "./review";

export interface Hotel {
  id: string;
  name: string;
  description: string;
  rating: number;
  reviewCount: number;
  price: number;
  images: string[];
  amenities: string[];
  location: string;
  reviews: Review[];
}
