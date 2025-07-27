import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Award,
  MapPin,
  Wifi,
  Utensils,
  Dumbbell,
  Car,
  Coffee,
  Users,
  ShieldCheck,
  Star,
  ThumbsDown,
  ThumbsUp,
  ChevronLeft,
  ChevronRight,
  Share2,
  Heart,
} from "lucide-react";
import { useHotelStore } from "../store/hotelStore";
import { useAuthStore } from "../store/authStore";
import Input from "../components/ui/Input";
import Loading from "../components/Loading";
import { Button } from "../components/ui/Button";
import { Modal } from "../components/ui/Modal";
import ReviewCard from "../components/ui/ReviewCard";
import type { Hotel, Review } from "../types";

const HotelDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getHotelById, setSelectedHotel } = useHotelStore();
  const { user } = useAuthStore();
  const [hotel, setHotel] = useState<Hotel | null>(null);
  const [showReviewsModal, setShowReviewsModal] = useState(false);
  const [reviewText, setReviewText] = useState("");
  const [reviewRating, setReviewRating] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  // Hotel amenities data
  const hotelAmenities = [
    { name: "Free WiFi", icon: <Wifi size={24} style={{ color: 'var(--primary)' }} /> },
    { name: "Restaurant", icon: <Utensils size={24} style={{ color: 'var(--primary)' }} /> },
    { name: "Fitness Center", icon: <Dumbbell size={24} style={{ color: 'var(--primary)' }} /> },
    { name: "Free Parking", icon: <Car size={24} style={{ color: 'var(--primary)' }} /> },
    { name: "Breakfast", icon: <Coffee size={24} style={{ color: 'var(--primary)' }} /> },
    { name: "24/7 Front Desk", icon: <Users size={24} style={{ color: 'var(--primary)' }} /> },
  ] as const;

  useEffect(() => {
    if (id) {
      const foundHotel = getHotelById(id);
      if (foundHotel) {
        setHotel(foundHotel);
        setSelectedHotel(foundHotel);
      }
    }
  }, [id, getHotelById, setSelectedHotel]);

  const handleBookNow = () => {
    if (hotel) {
      setSelectedHotel(hotel);
      navigate("/hotels/book");
    }
  };

  const handleSubmitReview = () => {
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setShowReviewsModal(false);
      setReviewText("");
      setReviewRating(0);
    }, 1200);
  };

  const ratingDistribution = [
    { stars: 5, percentage: 40 },
    { stars: 4, percentage: 30 },
    { stars: 3, percentage: 15 },
    { stars: 2, percentage: 10 },
    { stars: 1, percentage: 5 },
  ];

  if (!hotel) return <Loading message="Loading hotel details..." />;

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--background-primary)' }}>
      {/* Header with Back Button */}
      <div className=" border-b p-4" style={{ 
        backgroundColor: 'var(--background-primary)', 
        borderColor: 'var(--border-primary)' 
      }}>
        <div className="container flex items-center">
          <button 
            onClick={() => navigate(-1)}
            className="p-3 rounded-full transition-all hover:scale-105"
            style={{ backgroundColor: 'var(--surface-secondary)' }}
            aria-label="Go back"
          >
            <ArrowLeft size={24} style={{ color: 'var(--text-primary)' }} />
          </button>
          <h1 className="text-xl font-semibold ml-4" style={{ color: 'var(--text-primary)' }}>
            {hotel?.name || 'Hotel Details'}
          </h1>
          <div className="ml-auto flex gap-3">
            <button 
              className="p-3 rounded-full transition-all hover:scale-105" 
              style={{ backgroundColor: 'var(--surface-secondary)' }}
              aria-label="Share"
            >
              <Share2 size={20} style={{ color: 'var(--text-secondary)' }} />
            </button>
            <button 
              className="p-3 rounded-full transition-all hover:scale-105" 
              style={{ backgroundColor: 'var(--surface-secondary)' }}
              aria-label="Save"
            >
              <Heart size={20} style={{ color: 'var(--text-secondary)' }} />
            </button>
          </div>
        </div>
      </div>

      {/* Image Gallery */}
      <div className="relative h-96 md:h-[40rem] w-full overflow-hidden">
        <div 
          className="absolute inset-0 flex transition-transform duration-500 ease-in-out" 
          style={{ transform: `translateX(-${currentImageIndex * 100}%)` }}
        >
          {hotel.images.map((image, index) => (
            <div key={index} className="w-full h-full flex-shrink-0 relative">
              <img
                src={image}
                alt={`${hotel.name} - ${index + 1}`}
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-6 right-6 px-3 py-2 rounded-full text-sm font-medium text-white"
                   style={{ backgroundColor: 'rgba(0, 0, 0, 0.7)' }}>
                {index + 1} / {hotel.images.length}
              </div>
            </div>
          ))}
        </div>
        
        {/* Navigation Arrows */}
        {hotel.images.length > 1 && (
          <>
            <button 
              onClick={() => setCurrentImageIndex(prev => (prev === 0 ? hotel.images.length - 1 : prev - 1))}
              className="absolute left-6 top-1/2 -translate-y-1/2 p-3 rounded-full text-white transition-all hover:scale-110"
              style={{ backgroundColor: 'rgba(0, 0, 0, 0.6)' }}
              aria-label="Previous image"
            >
              <ChevronLeft size={28} />
            </button>
            <button 
              onClick={() => setCurrentImageIndex(prev => (prev === hotel.images.length - 1 ? 0 : prev + 1))}
              className="absolute right-6 top-1/2 -translate-y-1/2 p-3 rounded-full text-white transition-all hover:scale-110"
              style={{ backgroundColor: 'rgba(0, 0, 0, 0.6)' }}
              aria-label="Next image"
            >
              <ChevronRight size={28} />
            </button>
          </>
        )}
        
        {/* Image Dots */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
          {hotel.images.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentImageIndex(index)}
              className={`h-3 rounded-full transition-all ${currentImageIndex === index ? 'w-8' : 'w-3'}`}
              style={{ 
                backgroundColor: currentImageIndex === index ? 'white' : 'rgba(255, 255, 255, 0.5)' 
              }}
              aria-label={`Go to image ${index + 1}`}
            />
          ))}
        </div>
      </div>

      <div className="p-6 md:p-8 card" style={{ backgroundColor: 'var(--surface-primary)' }}>
        {/* Hotel Info */}
        <div className="mb-8">
          <div className="flex justify-between items-start mb-4">
            <h1 className="text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>
              {hotel.name}
            </h1>
            <div className="flex items-center px-4 py-2 rounded-full" style={{ backgroundColor: 'var(--surface-secondary)' }}>
              <Star size={18} style={{ color: 'var(--warning)' }} fill="currentColor" className="mr-2" />
              <span className="text-base font-semibold" style={{ color: 'var(--text-primary)' }}>4.8</span>
              <span className="text-sm ml-2" style={{ color: 'var(--text-tertiary)' }}>(128)</span>
            </div>
          </div>
          
          <div className="flex items-center mb-6" style={{ color: 'var(--text-secondary)' }}>
            <MapPin size={18} className="mr-2" />
            <span className="text-base">{hotel.location || '123 Main St, City Center'}</span>
          </div>
          
          <p className="text-base leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            Experience unparalleled luxury at {hotel.name}, nestled in the heart
            of the city. Our hotel offers exquisite accommodations, world-class
            dining, and a serene spa, all designed to provide an unforgettable
            stay with stunning views and exceptional service.
          </p>
        </div>

        {/* Amenities */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-6" style={{ color: 'var(--text-primary)' }}>
            Amenities
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {hotelAmenities.map((amenity, index) => (
              <div
                key={index}
                className="flex items-center p-4 rounded-lg transition-all hover:scale-105"
                style={{ backgroundColor: 'var(--surface-secondary)' }}
              >
                <span className="mr-4">{amenity.icon}</span>
                <p className="text-base font-medium" style={{ color: 'var(--text-primary)' }}>
                  {amenity.name}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Reviews */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-6" style={{ color: 'var(--text-primary)' }}>
            On-Chain Reviews
          </h3>
          <div className="flex flex-col md:flex-row gap-8 mb-8">
            {/* Average Rating */}
            <div className="text-center md:text-left">
              <p className="text-5xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>4.5</p>
              <div className="flex justify-center md:justify-start mb-2">
                {[1, 2, 3, 4, 5].map((star, index) => (
                  <Star
                    key={index}
                    size={20}
                    style={{ color: index < 4 ? 'var(--warning)' : 'var(--text-tertiary)' }}
                    fill={index < 4 ? 'currentColor' : 'none'}
                    className="mr-1"
                  />
                ))}
              </div>
              <p className="text-base" style={{ color: 'var(--text-secondary)' }}>2 reviews</p>
            </div>

            {/* Rating Distribution */}
            <div className="flex-1 space-y-3">
              {ratingDistribution.map((item, index) => (
                <div key={index} className="flex items-center gap-4">
                  <p className="text-sm font-medium w-4" style={{ color: 'var(--text-secondary)' }}>
                    {item.stars}
                  </p>
                  <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--surface-secondary)' }}>
                    <div
                      className="h-full rounded-full transition-all"
                      style={{ 
                        width: `${item.percentage}%`,
                        backgroundColor: 'var(--primary)'
                      }}
                    />
                  </div>
                  <p className="text-sm w-12 text-right" style={{ color: 'var(--text-tertiary)' }}>
                    {item.percentage}%
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Individual Reviews */}
          <div className="space-y-8">
            {[
              {
                id: "1",
                user: "0xabc123...xyz",
                date: "2 months ago",
                rating: 5,
                text: "The Grand Sui exceeded all expectations. The service was impeccable, the rooms were luxurious, and the location couldn't be better. Will definitely stay here again!",
                likes: 12,
                dislikes: 2,
              },
              {
                id: "2",
                user: "0xdef456...uvw",
                date: "3 months ago",
                rating: 4,
                text: "A wonderful stay overall. The amenities were great and the staff was very helpful. Only minor issue was the Wi-Fi speed in my room.",
                likes: 8,
                dislikes: 1,
              },
            ].map((review) => (
              <div
                key={review.id}
                className="border-b pb-6"
                style={{ borderColor: 'var(--border-primary)' }}
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center">
                    <div className="w-12 h-12 rounded-full mr-4" style={{ backgroundColor: 'var(--surface-secondary)' }}></div>
                    <div>
                      <p className="text-base font-medium" style={{ color: 'var(--text-primary)' }}>
                        {review.user}
                      </p>
                      <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>{review.date}</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <button className="flex items-center gap-2 transition-all hover:scale-105">
                      <ThumbsUp size={16} style={{ color: 'var(--text-tertiary)' }} />
                      <span className="text-sm" style={{ color: 'var(--text-tertiary)' }}>
                        {review.likes}
                      </span>
                    </button>
                    <button className="flex items-center gap-2 transition-all hover:scale-105">
                      <ThumbsDown size={16} style={{ color: 'var(--text-tertiary)' }} />
                      <span className="text-sm" style={{ color: 'var(--text-tertiary)' }}>
                        {review.dislikes}
                      </span>
                    </button>
                  </div>
                </div>
                <div className="flex items-center gap-2 mb-3">
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((starIndex) => (
                      <Star
                        key={starIndex}
                        size={16}
                        fill={starIndex <= review.rating ? "currentColor" : "none"}
                        style={{ color: starIndex <= review.rating ? 'var(--warning)' : 'var(--text-tertiary)' }}
                        className="mr-1"
                      />
                    ))}
                  </div>
                </div>
                <p className="text-base leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                  {review.text}
                </p>
              </div>
            ))}
          </div>

          <button
            onClick={() => console.log("View on Blockchain")}
            className="w-full py-4 px-6 rounded-lg text-base font-medium mt-6 transition-all hover:scale-105"
            style={{ 
              backgroundColor: 'var(--surface-secondary)',
              color: 'var(--text-primary)'
            }}
          >
            View on Blockchain
          </button>
        </div>

        {/* Badges */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-6" style={{ color: 'var(--text-primary)' }}>
            Transparency Badges
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center p-4 rounded-lg transition-all hover:scale-105" 
                 style={{ backgroundColor: 'var(--surface-secondary)' }}>
              <ShieldCheck size={24} style={{ color: 'var(--success)' }} />
              <p className="text-base font-medium ml-4" style={{ color: 'var(--text-primary)' }}>
                Verified on Sui
              </p>
            </div>
            <div className="flex items-center p-4 rounded-lg transition-all hover:scale-105" 
                 style={{ backgroundColor: 'var(--surface-secondary)' }}>
              <Award size={24} style={{ color: 'var(--success)' }} />
              <p className="text-base font-medium ml-4" style={{ color: 'var(--text-primary)' }}>
                Certified Excellence
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Booking Card - Sticky Footer */}
      <div className="sticky bottom-0 left-0 right-0 border-t p-6 shadow-lg backdrop-blur-sm" style={{ 
        backgroundColor: 'var(--background-primary)', 
        borderColor: 'var(--border-primary)' 
      }}>
        <div className="container flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-left">
            <p className="text-sm mb-1" style={{ color: 'var(--text-secondary)' }}>Starting from</p>
            <div className="flex items-baseline justify-center md:justify-start">
              <span className="text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>120</span>
              <span className="text-base ml-2" style={{ color: 'var(--text-tertiary)' }}>$SUI</span>
              <span className="text-base ml-1" style={{ color: 'var(--text-tertiary)' }}>/ night</span>
            </div>
          </div>
          
          <div className="w-full md:w-auto md:min-w-48">
            <Button 
              onClick={handleBookNow}
              variant="primary"
              size="large"
              className="btn-primary w-full py-4 text-base font-semibold"
              disabled={!user}
            >
              {user ? 'Book Now' : 'Sign In to Book'}
            </Button>
          </div>
        </div>
      </div>

      {/* Reviews Modal */}
      <Modal
        isOpen={showReviewsModal}
        onClose={() => setShowReviewsModal(false)}
        title={`All Reviews (${hotel.reviews?.length || 0})`}
      >
        <div className="space-y-6">
          {(!hotel.reviews || hotel.reviews.length === 0) ? (
            <p className="text-center py-8" style={{ color: 'var(--text-secondary)' }}>
              No reviews yet.
            </p>
          ) : (
            hotel.reviews.map((review: Review) => (
              <ReviewCard key={review.id} review={review} />
            ))
          )}
          
          <div className="border-t pt-6" style={{ borderColor: 'var(--border-primary)' }}>
            <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
              Rate this hotel
            </h3>
            <div className="flex items-center mb-4">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setReviewRating(star)}
                  className="mr-2 transition-all hover:scale-110"
                >
                  <Star
                    size={32}
                    style={{ color: reviewRating >= star ? 'var(--warning)' : 'var(--text-tertiary)' }}
                    fill={reviewRating >= star ? 'currentColor' : 'none'}
                  />
                </button>
              ))}
            </div>
            <Input
              value={reviewText}
              onChange={(text) => setReviewText(text)}
              placeholder="Write your review..."
              className="mb-4"
            />
            <Button
              onClick={handleSubmitReview}
              disabled={submitting || reviewRating === 0 || !reviewText.trim()}
              className="btn-primary w-full py-3"
            >
              {submitting ? "Submitting..." : "Submit Review"}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default HotelDetails;