export interface Review {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  likes: number;
  dislikes: number;
  comment: string;
  date: string;
  images?: string[];
}
