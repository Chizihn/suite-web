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
  Calendar,
  Clock,
  Phone,
  Globe,
  CheckCircle,
} from "lucide-react";
import { useHotelStore } from "../store/hotelStore";

import Input from "../components/ui/Input";
import Loading from "../components/Loading";
import { Button } from "../components/ui/Button";
import { Modal } from "../components/ui/Modal";
import type { Hotel, } from "../types";
import { useWallet } from "../contexts/WalletContext";

const HotelDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getHotelById, setSelectedHotel } = useHotelStore();
  const { isConnected } = useWallet();

  const [hotel, setHotel] = useState<Hotel | null>(null);
  const [showReviewsModal, setShowReviewsModal] = useState(false);
  const [reviewText, setReviewText] = useState("");
  const [reviewRating, setReviewRating] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFavorited, setIsFavorited] = useState(false);
  
  // Hotel amenities data with better organization
  const hotelAmenities = [
    { 
      name: "Free WiFi", 
      icon: <Wifi size={20} />, 
    },
    { 
      name: "Restaurant", 
      icon: <Utensils size={20} />, 
    },
    { 
      name: "Fitness Center", 
      icon: <Dumbbell size={20} />, 
    },
    { 
      name: "Free Parking", 
      icon: <Car size={20} />, 
    },
    { 
      name: "Breakfast", 
      icon: <Coffee size={20} />, 
    },
    { 
      name: "24/7 Front Desk", 
      icon: <Users size={20} />, 
    },
  ];

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

  const toggleFavorite = () => {
    setIsFavorited(!isFavorited);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: hotel?.name,
          text: `Check out ${hotel?.name}`,
          url: window.location.href,
        });
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
    }
  };

  const ratingDistribution = [
    { stars: 5, count: 52, percentage: 65 },
    { stars: 4, count: 20, percentage: 25 },
    { stars: 3, count: 6, percentage: 7 },
    { stars: 2, count: 2, percentage: 2 },
    { stars: 1, count: 1, percentage: 1 },
  ];

  const sampleReviews = [
    {
      id: "1",
      user: "0xabc123...xyz",
      userAvatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face",
      date: "2 months ago",
      rating: 5,
      text: "The Grand Sui exceeded all expectations. The service was impeccable, the rooms were luxurious, and the location couldn't be better. The blockchain verification system gives me confidence in the authenticity of reviews.",
      likes: 12,
      dislikes: 2,
      isVerified: true,
    },
    {
      id: "2",
      user: "0xdef456...uvw",
      userAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face",
      date: "3 months ago",
      rating: 4,
      text: "A wonderful stay overall. The amenities were great and the staff was very helpful. Only minor issue was the Wi-Fi speed in some areas, but everything else was perfect.",
      likes: 8,
      dislikes: 1,
      isVerified: true,
    },
  ];

  if (!hotel) return <Loading message="Loading hotel details..." />;

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--background-primary)' }}>
      {/* Sticky Header */}
      <div className="" style={{ 
        backgroundColor: 'var(--surface-primary)', 
        borderColor: 'var(--border-primary)' 
      }}>
        <div className="p-3 ">
          <div className="flex items-center justify-between h-16 px-2">
            <div className="flex items-center gap-8">
              <button 
                onClick={() => navigate(-1)}
                className="p-2 rounded-full transition-colors "
                style={{ backgroundColor: 'var(--surface-secondary)' }}
                aria-label="Go back"
              >
                <ArrowLeft size={20} style={{ color: 'var(--text-primary)' }} />
              </button>
              <h1 className="text-lg lg:text-4xl font-semibold truncate max-w-xs sm:max-w-none" style={{ color: 'var(--text-primary)' }}>
                {hotel?.name || 'Hotel Details'}
              </h1>
            </div>
            
            <div className="flex items-center gap-4">
              <button 
                onClick={handleShare}
                className="p-2 rounded-full transition-colors" 
                style={{ backgroundColor: 'var(--surface-secondary)' }}
                aria-label="Share"
              >
                <Share2 size={18} style={{ color: 'var(--text-secondary)' }} />
              </button>
              <button 
                onClick={toggleFavorite}
                className="p-2 rounded-full transition-colors" 
                style={{ backgroundColor: 'var(--surface-secondary)' }}
                aria-label="Save to favorites"
              >
                <Heart 
                  size={18} 
                  style={{ color: isFavorited ? 'var(--error)' : 'var(--text-secondary)' }}
                  fill={isFavorited ? 'currentColor' : 'none'}
                />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Image Gallery */}
      <div className="relative w-full">
        <div className="w-full lg:h-[500px] overflow-hidden">
          <div 
            className="flex h-full transition-transform duration-500 ease-out" 
            style={{ transform: `translateX(-${currentImageIndex * 100}%)` }}
          >
            {hotel.images.map((image, index) => (
              <div key={index} className="w-full h-full flex-shrink-0 relative">
                <img
                  src={image}
                  alt={`${hotel.name} - View ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
          
          {/* Navigation */}
          {hotel.images.length > 1 && (
            <>
              <button 
                onClick={() => setCurrentImageIndex(prev => (prev === 0 ? hotel.images.length - 1 : prev - 1))}
                className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full transition-colors"
                style={{ backgroundColor: 'rgba(0, 0, 0, 0.6)', color: 'white' }}
                aria-label="Previous image"
              >
                <ChevronLeft size={20} />
              </button>
              <button 
                onClick={() => setCurrentImageIndex(prev => (prev === hotel.images.length - 1 ? 0 : prev + 1))}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full transition-colors"
                style={{ backgroundColor: 'rgba(0, 0, 0, 0.6)', color: 'white' }}
                aria-label="Next image"
              >
                <ChevronRight size={20} />
              </button>
            </>
          )}
          

          {/* Image Dots */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            {hotel.images.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentImageIndex(index)}
                className={`h-2 rounded-full transition-all ${
                  currentImageIndex === index 
                    ? 'w-6' 
                    : 'w-2 hover:bg-white/70'
                }`}
                style={{ 
                  backgroundColor: currentImageIndex === index ? 'white' : 'rgba(255, 255, 255, 0.5)' 
                }}
                aria-label={`Go to image ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="py-8">
        <div className="lg:grid lg:grid-cols-3 lg:gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Hotel Header */}
            <div className="rounded-xl p-6 shadow-sm border" style={{ 
              backgroundColor: 'var(--surface-primary)', 
              borderColor: 'var(--border-primary)' 
            }}>
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
                <div className="flex-1">
                  <h1 className="text-2xl sm:text-3xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
                    {hotel.name}
                  </h1>
                  <div className="flex items-center mb-3" style={{ color: 'var(--text-secondary)' }}>
                    <MapPin size={16} className="mr-2 flex-shrink-0" />
                    <span className="text-sm sm:text-base">{hotel.location || '123 Main St, City Center'}</span>
                  </div>
                </div>
                
                <div className="flex items-center px-4 py-2 rounded-lg border" style={{ 
                  backgroundColor: 'var(--surface-secondary)', 
                  borderColor: 'var(--border-primary)' 
                }}>
                  <Star size={18} style={{ color: 'var(--warning)' }} fill="currentColor" className="mr-2" />
                  <span className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>4.8</span>
                  <span className="text-sm ml-2" style={{ color: 'var(--text-tertiary)' }}>(128 reviews)</span>
                </div>
              </div>
              
              <p className="leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                Experience unparalleled luxury at {hotel.name}, nestled in the heart
                of the city. Our hotel offers exquisite accommodations, world-class
                dining, and a serene spa, all designed to provide an unforgettable
                stay with stunning views and exceptional service.
              </p>
              
              {/* Quick Info */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t" style={{ borderColor: 'var(--border-primary)' }}>
                <div className="text-center">
                  <Calendar className="w-5 h-5 mx-auto mb-1" style={{ color: 'var(--primary)' }} />
                  <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>Check-in</p>
                  <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>3:00 PM</p>
                </div>
                <div className="text-center">
                  <Clock className="w-5 h-5 mx-auto mb-1" style={{ color: 'var(--primary)' }} />
                  <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>Check-out</p>
                  <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>11:00 AM</p>
                </div>
                <div className="text-center">
                  <Phone className="w-5 h-5 mx-auto mb-1" style={{ color: 'var(--primary)' }} />
                  <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>Phone</p>
                  <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>+1 234 567</p>
                </div>
                <div className="text-center">
                  <Globe className="w-5 h-5 mx-auto mb-1" style={{ color: 'var(--primary)' }} />
                  <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>Website</p>
                  <p className="text-sm font-medium" style={{ color: 'var(--primary)' }}>Visit</p>
                </div>
              </div>
            </div>

            {/* Amenities */}
            <div className="rounded-xl p-6 shadow-sm border" style={{ 
              backgroundColor: 'var(--surface-primary)', 
              borderColor: 'var(--border-primary)' 
            }}>
              <h2 className="text-xl font-bold mb-6" style={{ color: 'var(--text-primary)' }}>Amenities</h2>
              <div className="flex flex-wrap gap-4">
                {hotelAmenities.map((amenity, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 p-3 rounded-lg transition-colors "
                    style={{ backgroundColor: 'var(--surface-secondary)' }}
                  >
                                        <div style={{ color: 'var(--primary)' }}>{amenity.icon}</div>

                    <div className="">
                      <h3 className="font-medium mb-1" style={{ color: 'var(--text-primary)' }}>{amenity.name}</h3>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Reviews Section */}
            <div className="rounded-xl p-6 shadow-sm border" style={{ 
              backgroundColor: 'var(--surface-primary)', 
              borderColor: 'var(--border-primary)' 
            }}>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>Guest Reviews</h2>
                <div className="flex items-center" style={{ color: 'var(--primary)' }}>
                  <ShieldCheck size={16} className="mr-1" />
                  <span className="text-sm font-medium">Blockchain Verified</span>
                </div>
              </div>
              
              {/* Rating Overview */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                <div className="text-center md:text-left">
                  <div className="text-5xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>4.8</div>
                  <div className="flex justify-center md:justify-start mb-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        size={20}
                        style={{ color: star <= 4 ? 'var(--warning)' : 'var(--text-tertiary)' }}
                        fill={star <= 4 ? 'currentColor' : 'none'}
                        className="mr-1"
                      />
                    ))}
                  </div>
                  <p style={{ color: 'var(--text-secondary)' }}>Based on 81 reviews</p>
                </div>

                <div className="space-y-2">
                  {ratingDistribution.map((item) => (
                    <div key={item.stars} className="flex items-center gap-3">
                      <span className="text-sm font-medium w-6" style={{ color: 'var(--text-secondary)' }}>
                        {item.stars}★
                      </span>
                      <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--surface-secondary)' }}>
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{ 
                            width: `${item.percentage}%`,
                            backgroundColor: 'var(--warning)'
                          }}
                        />
                      </div>
                      <span className="text-sm w-8 text-right" style={{ color: 'var(--text-tertiary)' }}>
                        {item.count}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Individual Reviews */}
              <div className="space-y-6">
                {sampleReviews.map((review) => (
                  <div key={review.id} className="border-b pb-6 last:border-b-0" style={{ borderColor: 'var(--border-primary)' }}>
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center">
                        <img
                          src={review.userAvatar}
                          alt="User avatar"
                          className="w-10 h-10 rounded-full mr-3"
                        />
                        <div>
                          <div className="flex items-center">
                            <span className="font-medium mr-2" style={{ color: 'var(--text-primary)' }}>
                              {review.user}
                            </span>
                            {review.isVerified && (
                              <CheckCircle size={14} style={{ color: 'var(--primary)' }} />
                            )}
                          </div>
                          <span className="text-sm" style={{ color: 'var(--text-tertiary)' }}>{review.date}</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4">
                        <button className="flex items-center gap-1 transition-colors" style={{ color: 'var(--text-tertiary)' }}>
                          <ThumbsUp size={14} />
                          <span className="text-sm">{review.likes}</span>
                        </button>
                        <button className="flex items-center gap-1 transition-colors" style={{ color: 'var(--text-tertiary)' }}>
                          <ThumbsDown size={14} />
                          <span className="text-sm">{review.dislikes}</span>
                        </button>
                      </div>
                    </div>
                    
                    <div className="flex items-center mb-3">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          size={14}
                          style={{ color: star <= review.rating ? 'var(--warning)' : 'var(--text-tertiary)' }}
                          fill={star <= review.rating ? 'currentColor' : 'none'}
                          className="mr-1"
                        />
                      ))}
                    </div>
                    
                    <p className="leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{review.text}</p>
                  </div>
                ))}
              </div>

              <button
                onClick={() => setShowReviewsModal(true)}
                className="w-full mt-6 py-3 px-4 font-medium rounded-lg transition-colors"
                style={{ 
                  backgroundColor: 'var(--surface-secondary)',
                  color: 'var(--text-primary)'
                }}
              >
                View All Reviews on Blockchain
              </button>
            </div>

            {/* Transparency Badges */}
            <div className="rounded-xl p-6 shadow-sm border" style={{ 
              backgroundColor: 'var(--surface-primary)', 
              borderColor: 'var(--border-primary)' 
            }}>
              <h2 className="text-xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>Trust & Transparency</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-center p-4 rounded-lg border" style={{ 
                  backgroundColor: 'var(--surface-secondary)', 
                  borderColor: 'var(--border-primary)' 
                }}>
                  <ShieldCheck className="w-6 h-6 mr-3" style={{ color: 'var(--success)' }} />
                  <div>
                    <p className="font-medium" style={{ color: 'var(--text-primary)' }}>Verified on Sui</p>
                    <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Blockchain verified property</p>
                  </div>
                </div>
                <div className="flex items-center p-4 rounded-lg border" style={{ 
                  backgroundColor: 'var(--surface-secondary)', 
                  borderColor: 'var(--border-primary)' 
                }}>
                  <Award className="w-6 h-6 mr-3" style={{ color: 'var(--success)' }} />
                  <div>
                    <p className="font-medium" style={{ color: 'var(--text-primary)' }}>Certified Excellence</p>
                    <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Quality assurance certified</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Booking Sidebar */}
          <div className="lg:col-span-1 mt-8 lg:mt-0">
            <div className="sticky top-24">
              <div className="rounded-xl p-6 shadow-lg border" style={{ 
                backgroundColor: 'var(--surface-primary)', 
                borderColor: 'var(--border-primary)' 
              }}>
                <div className="text-center mb-6">
                  <p className="text-sm mb-1" style={{ color: 'var(--text-secondary)' }}>Starting from</p>
                  <div className="flex items-baseline justify-center">
                    <span className="text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>120</span>
                    <span className="text-lg ml-2" style={{ color: 'var(--text-secondary)' }}>$SUI</span>
                    <span className="text-sm ml-1" style={{ color: 'var(--text-tertiary)' }}>/ night</span>
                  </div>
                </div>
                
                <Button 
                  onClick={handleBookNow}
                  className="w-full font-semibold py-4 px-6 rounded-lg transition-colors mb-4"
                
                  disabled={!isConnected}
                >
                  {isConnected ? 'Reserve Now' : 'Sign In to Book'}
                </Button>
                
                <p className="text-xs text-center" style={{ color: 'var(--text-tertiary)' }}>
                  Free cancellation • No booking fees
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Reviews Modal */}
      <Modal
        isOpen={showReviewsModal}
        onClose={() => setShowReviewsModal(false)}
        title="All Reviews"
      >
        <div className="space-y-6">
          {sampleReviews.length === 0 ? (
            <p className="text-center py-8" style={{ color: 'var(--text-tertiary)' }}>
              No reviews yet. Be the first to review!
            </p>
          ) : (
            sampleReviews.map((review: any) => (
              <div key={review.id} className="border-b pb-4 last:border-b-0" style={{ borderColor: 'var(--border-primary)' }}>
                <div className="flex items-start mb-3">
                  <img
                    src={review.userAvatar}
                    alt="User avatar"
                    className="w-8 h-8 rounded-full mr-3"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium" style={{ color: 'var(--text-primary)' }}>{review.user}</span>
                      <span className="text-sm" style={{ color: 'var(--text-tertiary)' }}>{review.date}</span>
                    </div>
                    <div className="flex items-center mb-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          size={12}
                          style={{ color: star <= review.rating ? 'var(--warning)' : 'var(--text-tertiary)' }}
                          fill={star <= review.rating ? 'currentColor' : 'none'}
                          className="mr-1"
                        />
                      ))}
                    </div>
                    <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{review.text}</p>
                  </div>
                </div>
              </div>
            ))
          )}
          
          <div className="border-t pt-6" style={{ borderColor: 'var(--border-primary)' }}>
            <h3 className="font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>Write a Review</h3>
            <div className="flex items-center mb-4">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setReviewRating(star)}
                  className="mr-1 transition-transform hover:scale-110"
                >
                  <Star
                    size={24}
                    style={{ color: reviewRating >= star ? 'var(--warning)' : 'var(--text-tertiary)' }}
                    fill={reviewRating >= star ? 'currentColor' : 'none'}
                  />
                </button>
              ))}
            </div>
            <Input
              value={reviewText}
              onChange={(text) => setReviewText(text)}
              placeholder="Share your experience..."
              className="mb-4"
            />
            <Button
              onClick={handleSubmitReview}
              disabled={submitting || reviewRating === 0 || !reviewText.trim()}
              className="w-full py-3 rounded-lg font-medium transition-colors"
           
            >
              {submitting ? "Publishing..." : "Publish Review"}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default HotelDetails;