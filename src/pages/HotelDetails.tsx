import React, { useState, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, MapPin, Star, ThumbsUp, ThumbsDown, Share2, Heart, CheckCircle } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import Loading from '../components/Loading';
import ErrorState from '../components/ErrorState';
import { useReviews, useHotel } from '../hooks/useQuery';



const HotelDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  // const { setError, error: storeError } = useBookingStore();
  const { data: hotel, isLoading: hotelLoading, error: hotelError } = useHotel(id as string);
  const { data: reviews, isLoading: reviewsLoading, error: reviewsError } = useReviews(id);
  // const { data: reservations, isLoading: reservationsLoading, error: reservationsError } = useReservations(address ?? undefined);
  // const { mutate: submitReview, isPending: submitting } = useSubmitReview(id || '');
  const [showReviewsModal, setShowReviewsModal] = useState(false);
  // const [reviewText, setReviewText] = useState('');
  // const [reviewRating, setReviewRating] = useState(0);
  // const [reservationId, setReservationId] = useState('');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFavorited, setIsFavorited] = useState(false);

  // Calculate average rating from reviews if hotel.averageRating is unavailable
  const averageRating = useMemo(() => {
    if (hotel?.averageRating) {
      return hotel.averageRating.toFixed(1);
    }
    if (reviews && reviews.length > 0) {
      const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
      return (totalRating / reviews.length).toFixed(1);
    }
    return 'N/A';
  }, [hotel, reviews]);

  const reviewCount = hotel?.reviewCount || reviews?.length || 0;

  const handleViewRooms = () => {
    navigate(`/hotels/${id}/book`);
  };

  // const handleSubmitReview = async () => {
  //   if (!isConnected || !address || !reservationId || !id) {
  //     setError('Please connect your wallet and select a reservation.');
  //     return;
  //   }

  //   submitReview(
  //     {
  //       reservationId,
  //       guest: address,
  //       rating: reviewRating,
  //       comment: reviewText,
  //     },
  //     {
  //       onSuccess: async (data) => {
  //         try {
  //           const tx = Transaction.from(data.transactionBlock);
  //           const signedTx = await signTransaction({ transaction: tx });
  //           const txResult = await executeTransaction({
  //             transaction: signedTx.transactionBlockBytes,
  //           });
  //           const event = await client.waitForTransaction({
  //             digest: txResult.digest,
  //             options: { showEvents: true },
  //           });
  //           const reviewPostedEvent = event.events?.find((e: any) => e.type.endsWith('::ReviewPosted'));
  //           if (!reviewPostedEvent) throw new Error('Review event not found');

  //           setShowReviewsModal(false);
  //           setReviewText('');
  //           setReviewRating(0);
  //           setReservationId('');
  //           setError(null);
  //         } catch (error) {
  //           console.error('Review transaction failed:', error);
  //           setError('Failed to process review transaction.');
  //         }
  //       },
  //       onError: (error) => {
  //         console.error('Review submission failed:', error);
  //         setError('Failed to submit review. Please try again.');
  //       },
  //     }
  //   );
  // };

  const toggleFavorite = () => setIsFavorited(!isFavorited);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: hotel?.name,
          text: `Check out ${hotel?.name}`,
          url: window.location.href,
        });
      } catch (err) {
        console.error('Error sharing:', err);
        // setError('Failed to share. Link copied to clipboard.');
        navigator.clipboard.writeText(window.location.href);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      // setError('Link copied to clipboard!');
    }
  };

  if (!id) {
    return (
      <div className="min-h-screen flex items-center justify-center p-8" style={{ backgroundColor: 'var(--background-primary)' }}>
        <ErrorState
          message="Invalid hotel ID"
          onRetry={() => navigate('/hotels')}
        />
      </div>
    );
  }

  if (hotelError || reviewsError) {
    const error = hotelError || reviewsError ;
    return (
      <div className="min-h-screen flex items-center justify-center p-8" style={{ backgroundColor: 'var(--background-primary)' }}>
        <ErrorState
          message={`Error: ${error?.message}`}
          onRetry={() => window.location.reload()}
        />
      </div>
    );
  }

  if (hotelLoading || reviewsLoading ) {
    return <Loading message="Loading hotel details..." />;
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--background-primary)' }}>
      <div style={{ backgroundColor: 'var(--surface-primary)', borderColor: 'var(--border-primary)' }}>
        <div className="p-3">
          <div className="flex items-center justify-between h-16 px-2">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate(-1)}
                className="p-2 rounded-full transition-colors"
                style={{ backgroundColor: 'var(--surface-secondary)' }}
                aria-label="Go back"
              >
                <ArrowLeft size={20} style={{ color: 'var(--text-primary)' }} />
              </button>
              <h1 className="text-lg lg:text-3xl font-semibold truncate max-w-xs sm:max-w-none" style={{ color: 'var(--text-primary)' }}>
                {hotel?.name}
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

      <div className="relative w-full">
        <div className="w-full lg:h-[500px] overflow-hidden">
          <div
            className="flex h-full transition-transform duration-500 ease-out"
            style={{ transform: `translateX(-${currentImageIndex * 100}%)` }}
          >
            {[hotel?.imageUrl].map((image, index) => (
              <div key={index} className="w-full h-full flex-shrink-0 relative">
                <img
                  src={image}
                  alt={`${hotel?.name} - View ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            <button
              onClick={() => setCurrentImageIndex(0)}
              className="h-2 w-2 rounded-full bg-white"
              aria-label="Go to image 1"
            />
          </div>
        </div>
      </div>

      <div className="py-8">
        <div className="lg:grid lg:grid-cols-3 lg:gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="rounded-xl p-6 shadow-sm border" style={{ backgroundColor: 'var(--surface-primary)', borderColor: 'var(--border-primary)' }}>
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
                <div className="flex-1">
                  <h1 className="text-2xl sm:text-3xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
                    {hotel?.name}
                  </h1>
                  <div className="flex items-center mb-3" style={{ color: 'var(--text-secondary)' }}>
                    <MapPin size={16} className="mr-2 flex-shrink-0" />
                    <span className="text-sm sm:text-base">{hotel?.physical_address}</span>
                  </div>
                </div>
                <div className="flex items-center px-4 py-2 rounded-lg border" style={{ backgroundColor: 'var(--surface-secondary)', borderColor: 'var(--border-primary)' }}>
                  <Star size={18} style={{ color: 'var(--warning)' }} fill="currentColor" className="mr-2" />
                  <span className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>
                    {averageRating}
                  </span>
                  <span className="text-sm ml-2" style={{ color: 'var(--text-tertiary)' }}>({reviewCount} reviews)</span>
                </div>
              </div>
              <p className="leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                Discover {hotel?.name}, located at {hotel?.physical_address}. Enjoy a seamless booking experience with blockchain-verified transactions.
              </p>
            </div>

            <div className="rounded-xl p-6 shadow-sm border" style={{ backgroundColor: 'var(--surface-primary)', borderColor: 'var(--border-primary)' }}>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>Guest Reviews</h2>
                <div className="flex items-center" style={{ color: 'var(--primary)' }}>
                  <CheckCircle size={16} className="mr-1" />
                  <span className="text-sm font-medium">Blockchain Verified</span>
                </div>
              </div>
              <div className="space-y-6">
                {reviews?.length === 0 ? (
                  <p className="text-center py-4" style={{ color: 'var(--text-tertiary)' }}>
                    No reviews yet. Be the first to review!
                  </p>
                ) : (
                  reviews?.slice(0, 3).map((review) => (
                    <div key={review._id} className="border-b pb-6 last:border-b-0" style={{ borderColor: 'var(--border-primary)' }}>
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center">
                          <div>
                            <div className="flex items-center">
                              <span className="font-medium mr-2" style={{ color: 'var(--text-primary)' }}>
                                {review.guest.slice(0, 6)}...{review.guest.slice(-4)}
                              </span>
                              <CheckCircle size={14} style={{ color: 'var(--primary)' }} />
                            </div>
                            <span className="text-sm" style={{ color: 'var(--text-tertiary)' }}>
                              {new Date(review.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <button className="flex items-center gap-1 transition-colors" style={{ color: 'var(--text-tertiary)' }}>
                            <ThumbsUp size={14} />
                            <span className="text-sm">0</span>
                          </button>
                          <button className="flex items-center gap-1 transition-colors" style={{ color: 'var(--text-tertiary)' }}>
                            <ThumbsDown size={14} />
                            <span className="text-sm">0</span>
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
                      <p className="leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{review.comment}</p>
                    </div>
                  ))
                )}
              </div>
              <button
                onClick={() => setShowReviewsModal(true)}
                className="w-full mt-6 py-3 px-4 font-medium rounded-lg transition-colors"
                style={{ backgroundColor: 'var(--surface-secondary)', color: 'var(--text-primary)' }}
              >
                View All Reviews
              </button>
            </div>
          </div>

          <div className="lg:col-span-1 mt-8 lg:mt-0">
            <div className="sticky top-24 space-y-8">
              <div className="hidden md:flex flex-col rounded-xl p-6 shadow-lg border" style={{ backgroundColor: 'var(--surface-primary)', borderColor: 'var(--border-primary)' }}>
                <Button
                  onClick={handleViewRooms}
                  className="w-full font-semibold py-4 px-6 rounded-lg transition-colors mb-4"
                >
                 View Available Rooms
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Modal isOpen={showReviewsModal} onClose={() => setShowReviewsModal(false)} title="All Reviews">
        <div className="space-y-6">
          {reviews?.length === 0 ? (
            <p className="text-center py-8" style={{ color: 'var(--text-tertiary)' }}>
              No reviews yet. Be the first to review!
            </p>
          ) : (
            reviews?.map((review) => (
              <div key={review._id} className="border-b pb-4 last:border-b-0" style={{ borderColor: 'var(--border-primary)' }}>
                <div className="flex items-start mb-3">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium" style={{ color: 'var(--text-primary)' }}>
                        {review.guest.slice(0, 6)}...{review.guest.slice(-4)}
                      </span>
                      <span className="text-sm" style={{ color: 'var(--text-tertiary)' }}>
                        {new Date(review.createdAt).toLocaleDateString()}
                      </span>
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
                    <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{review.comment}</p>
                  </div>
                </div>
              </div>
            ))
          )}
          {/* <div className="border-t pt-6" style={{ borderColor: 'var(--border-primary)' }}>
            <h3 className="font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>Write a Review</h3>
            <div className="mb-4">
              <p className="text-label text-text-primary mb-1">Select Reservation</p>
              <Select
                value={reservationId}
                onChange={(e) => setReservationId(e.target.value)}
                options={
                  reservations?.filter((r) => r.hotelId === id && r.isActive).map((res) => ({
                    value: res.id,
                    label: `Reservation ${res.id.slice(0, 6)}... (${new Date(res.startDate * 1000).toLocaleDateString()} - ${new Date(res.endDate * 1000).toLocaleDateString()})`,
                  })) || []
                }
                placeholder="Select a reservation"
                className="w-full"
              />
            </div>
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
              onChange={(e) => setReviewText(e.target.value)}
              placeholder="Share your experience..."
              className="mb-4"
            />
            {storeError && <p className="text-red-500 text-sm mb-4">{storeError}</p>}
            <Button
              onClick={handleSubmitReview}
              disabled={submitting || reviewRating === 0 || !reviewText.trim() || !reservationId}
              className="w-full py-3 rounded-lg font-medium transition-colors"
            >
              {submitting ? 'Publishing...' : 'Publish Review'}
            </Button>
          </div> */}
        </div>
      </Modal>
      {/* <BookButton isConnected={isConnected} onBook={handleBookNow} />  */}

    </div>
  );
};

export default HotelDetails;