import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Loader2,
  CheckCircle,
  Calendar,
  Clock,
  Users,
  Bed,
  ExternalLink,
  Download,
  Share2,
  MapPin,
  Star,
  Wallet,
  Shield,
  Award,
} from "lucide-react";
import { useBookingStore } from "../store/bookingStore";
import { Button } from "../components/ui/Button";
import { Modal } from "../components/ui/Modal";

const BookingDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { bookings, fetchBookings, loading, setCurrentBooking } = useBookingStore();
  const booking = bookings.find((b) => b.id === id);
  
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showNFTModal, setShowNFTModal] = useState(false);

  useEffect(() => {
    if (!bookings.length) {
      fetchBookings();
    }
  }, []);

  useEffect(() => {
    if (booking) {
      setCurrentBooking(booking);
    }
  }, [booking]);

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleViewNFT = () => {
    setShowNFTModal(true);
  };

  const handleCancelBooking = () => {
    setShowCancelModal(true);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Booking Confirmation - ${booking?.hotelName}`,
          text: `My booking at ${booking?.hotelName} is confirmed!`,
          url: window.location.href,
        });
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  const handleDownloadReceipt = () => {
    console.log("Download receipt");
  };

  if (loading || !booking) {
    return (
      <div 
        className="min-h-screen flex items-center justify-center" 
        style={{ backgroundColor: 'var(--background-primary)' }}
      >
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-12 w-12 animate-spin" style={{ color: 'var(--primary)' }} />
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Loading booking details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--background-primary)' }}>
      {/* Header */}
      <div 
        className="sticky top-0 z-40 border-b" 
        style={{ 
          backgroundColor: 'var(--surface-primary)', 
          borderColor: 'var(--border-primary)' 
        }}
      >
        <div className="p-3">
          <div className="flex items-center justify-between h-16 px-2">
            <div className="flex items-center gap-4">
              <button
                onClick={handleGoBack}
                className="p-2 rounded-full transition-colors"
                style={{ backgroundColor: 'var(--surface-secondary)' }}
                aria-label="Go back"
              >
                <ArrowLeft size={20} style={{ color: 'var(--text-primary)' }} />
              </button>
              <h1 
                className="text-lg lg:text-2xl font-semibold"
                style={{ color: 'var(--text-primary)' }}
              >
                Booking Confirmed
              </h1>
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={handleShare}
                className="p-2 rounded-full transition-colors"
                style={{ backgroundColor: 'var(--surface-secondary)' }}
                aria-label="Share booking"
              >
                <Share2 size={18} style={{ color: 'var(--text-secondary)' }} />
              </button>
              <button
                onClick={handleDownloadReceipt}
                className="p-2 rounded-full transition-colors"
                style={{ backgroundColor: 'var(--surface-secondary)' }}
                aria-label="Download receipt"
              >
                <Download size={18} style={{ color: 'var(--text-secondary)' }} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* <div className="pb-24 md:pb-8"> */}
      <div className="">

        {/* Success Banner */}
        {/* <div 
          className="mx-4 mt-6 p-6 rounded-xl border text-center"
          style={{ 
            backgroundColor: 'var(--success-light)',
            borderColor: 'var(--success)',
          }}
        >
          <div className="flex justify-center mb-4">
            <div 
              className="p-3 rounded-full"
              style={{ backgroundColor: 'var(--success)' }}
            >
              <CheckCircle size={32} color="white" />
            </div>
          </div>
          <h2 
            className="text-2xl font-bold mb-2"
            style={{ color: 'var(--success)' }}
          >
            Booking Confirmed!
          </h2>
          <p 
            className="text-sm max-w-md mx-auto"
            style={{ color: 'var(--text-secondary)' }}
          >
            Your reservation at {booking.hotelName} has been successfully confirmed and secured on the blockchain.
          </p>
        </div> */}

        <div className="mt-2 lg:grid lg:grid-cols-3 lg:gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            
        {/* Success Banner */}
          <div 
          className="p-6 rounded-xl border text-center"
          style={{ 
            backgroundColor: 'var(--success-light)',
            borderColor: 'var(--success)',
          }}
        >
          <div className="flex justify-center mb-4">
            <div 
              className="p-3 rounded-full"
              style={{ backgroundColor: 'var(--success)' }}
            >
              <CheckCircle size={32} color="white" />
            </div>
          </div>
          <h2 
            className="text-2xl font-bold mb-2"
            style={{ color: 'var(--success)' }}
          >
            Booking Confirmed!
          </h2>
          <p 
            className="text-sm max-w-md mx-auto"
            style={{ color: 'var(--text-secondary)' }}
          >
            Your reservation at {booking.hotelName} has been successfully confirmed and secured on the blockchain.
          </p>
        </div>
            {/* Hotel Information */}
            <div 
              className="mx-4 lg:mx-0 rounded-xl p-6 shadow-sm border"
              style={{ 
                backgroundColor: 'var(--surface-primary)', 
                borderColor: 'var(--border-primary)' 
              }}
            >
              <div className="flex items-start gap-4 mb-4">
                <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                  <img
                    src={booking.hotelImage}
                    alt={booking.hotelName}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <h3 
                    className="text-xl font-bold mb-1"
                    style={{ color: 'var(--text-primary)' }}
                  >
                    {booking.hotelName}
                  </h3>
                  <div className="flex items-center mb-2" style={{ color: 'var(--text-secondary)' }}>
                    <MapPin size={14} className="mr-1" />
                    <span className="text-sm">Downtown, City Center</span>
                  </div>
                  <div className="flex items-center">
                    <Star size={14} style={{ color: 'var(--warning)' }} fill="currentColor" className="mr-1" />
                    <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>4.8</span>
                    <span className="text-sm ml-1" style={{ color: 'var(--text-tertiary)' }}>(128 reviews)</span>
                  </div>
                </div>
                <div 
                  className="px-3 py-1 rounded-full text-xs font-medium"
                  style={{ 
                    backgroundColor: 'var(--success-light)',
                    color: 'var(--success)'
                  }}
                >
                  {booking.status}
                </div>
              </div>
            </div>

            {/* Booking Details */}
            <div 
              className="mx-4 lg:mx-0 rounded-xl p-6 shadow-sm border"
              style={{ 
                backgroundColor: 'var(--surface-primary)', 
                borderColor: 'var(--border-primary)' 
              }}
            >
              <h3 
                className="text-lg font-bold mb-6"
                style={{ color: 'var(--text-primary)' }}
              >
                Reservation Details
              </h3>
              
              <div className="grid grid-cols-2 gap-6 mb-6">
                <DetailCard
                  icon={<Calendar size={20} />}
                  label="Check-in"
                  value={booking.checkIn}
                  subtitle="After 3:00 PM"
                />
                <DetailCard
                  icon={<Clock size={20} />}
                  label="Check-out"
                  value={booking.checkOut}
                  subtitle="Before 11:00 AM"
                />
                <DetailCard
                  icon={<Users size={20} />}
                  label="Guests"
                  value={`${booking.guests} Guest${booking.guests > 1 ? 's' : ''}`}
                  subtitle={`${booking.nights} Night${booking.nights > 1 ? 's' : ''}`}
                />
                <DetailCard
                  icon={<Bed size={20} />}
                  label="Room Type"
                  value={booking.roomType}
                  subtitle="Premium Suite"
                />
              </div>

              {/* Booking ID */}
              <div 
                className="p-4 rounded-lg border"
                style={{ 
                  backgroundColor: 'var(--surface-secondary)',
                  borderColor: 'var(--border-primary)'
                }}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p 
                      className="text-sm font-medium mb-1"
                      style={{ color: 'var(--text-primary)' }}
                    >
                      Booking Reference
                    </p>
                    <p 
                      className="text-xs font-mono"
                      style={{ color: 'var(--text-secondary)' }}
                    >
                      {booking.id}
                    </p>
                  </div>
                  <button className="p-2 rounded transition-colors hover:bg-gray-100">
                    <ExternalLink size={16} style={{ color: 'var(--text-tertiary)' }} />
                  </button>
                </div>
              </div>
            </div>

            {/* Mobile Payment Summary - Only show on mobile */}
            <div 
              className="mx-4 lg:hidden rounded-xl p-6 shadow-sm border"
              style={{ 
                backgroundColor: 'var(--surface-primary)', 
                borderColor: 'var(--border-primary)' 
              }}
            >
              <h3 
                className="text-lg font-bold mb-6"
                style={{ color: 'var(--text-primary)' }}
              >
                Payment Summary
              </h3>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span style={{ color: 'var(--text-secondary)' }}>Room Rate ({booking.nights} nights)</span>
                  <span style={{ color: 'var(--text-primary)' }}>{(booking.totalPrice * 0.9).toFixed(1)} SUI</span>
                </div>
                <div className="flex justify-between items-center">
                  <span style={{ color: 'var(--text-secondary)' }}>Taxes & Fees</span>
                  <span style={{ color: 'var(--text-primary)' }}>{(booking.totalPrice * 0.1).toFixed(1)} SUI</span>
                </div>
                <div 
                  className="flex justify-between items-center pt-4 border-t"
                  style={{ borderColor: 'var(--border-primary)' }}
                >
                  <span 
                    className="text-lg font-bold"
                    style={{ color: 'var(--text-primary)' }}
                  >
                    Total Paid
                  </span>
                  <span 
                    className="text-xl font-bold"
                    style={{ color: 'var(--primary)' }}
                  >
                    {booking.totalPrice} SUI
                  </span>
                </div>
                <p 
                  className="text-xs text-center pt-2"
                  style={{ color: 'var(--text-tertiary)' }}
                >
                  Payment processed via Sui blockchain
                </p>
              </div>
            </div>

            {/* Mobile NFT & Blockchain Info - Only show on mobile */}
            <div 
              className="mx-4 lg:hidden rounded-xl p-6 shadow-sm border"
              style={{ 
                backgroundColor: 'var(--surface-primary)', 
                borderColor: 'var(--border-primary)' 
              }}
            >
              <h3 
                className="text-lg font-bold mb-6"
                style={{ color: 'var(--text-primary)' }}
              >
                Blockchain Verification
              </h3>
              
              <div className="space-y-4">
                <div className="flex items-center p-4 rounded-lg border" style={{ 
                  backgroundColor: 'var(--surface-secondary)', 
                  borderColor: 'var(--border-primary)' 
                }}>
                  <Wallet className="w-6 h-6 mr-3" style={{ color: 'var(--primary)' }} />
                  <div className="flex-1">
                    <p className="font-medium" style={{ color: 'var(--text-primary)' }}>Booking NFT</p>
                    <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Stored securely in your wallet</p>
                  </div>
                  <Button
                    onClick={handleViewNFT}
                    className="px-4 py-2 text-sm"
                  >
                    View NFT
                  </Button>
                </div>
                
                <div className="flex items-center p-4 rounded-lg border" style={{ 
                  backgroundColor: 'var(--surface-secondary)', 
                  borderColor: 'var(--border-primary)' 
                }}>
                  <Shield className="w-6 h-6 mr-3" style={{ color: 'var(--success)' }} />
                  <div>
                    <p className="font-medium" style={{ color: 'var(--text-primary)' }}>Verified on Sui</p>
                    <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Immutable booking record</p>
                  </div>
                </div>
                
                <div className="flex items-center p-4 rounded-lg border" style={{ 
                  backgroundColor: 'var(--surface-secondary)', 
                  borderColor: 'var(--border-primary)' 
                }}>
                  <Award className="w-6 h-6 mr-3" style={{ color: 'var(--warning)' }} />
                  <div>
                    <p className="font-medium" style={{ color: 'var(--text-primary)' }}>Fraud Protected</p>
                    <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Blockchain-secured transaction</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sticky Sidebar - Desktop Only */}
          <div className="lg:col-span-1 mt-8 lg:mt-0">
            <div className="sticky top-24 space-y-6 hidden lg:block">
              {/* Payment Summary */}
              <div 
                className="rounded-xl p-6 shadow-lg border"
                style={{ 
                  backgroundColor: 'var(--surface-primary)', 
                  borderColor: 'var(--border-primary)' 
                }}
              >
                <h3 
                  className="text-lg font-bold mb-6"
                  style={{ color: 'var(--text-primary)' }}
                >
                  Payment Summary
                </h3>
                
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span style={{ color: 'var(--text-secondary)' }}>Room Rate ({booking.nights} nights)</span>
                    <span style={{ color: 'var(--text-primary)' }}>{(booking.totalPrice * 0.8).toFixed(1)} SUI</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span style={{ color: 'var(--text-secondary)' }}>Service Fee</span>
                    <span style={{ color: 'var(--text-primary)' }}>{(booking.totalPrice * 0.1).toFixed(1)} SUI</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span style={{ color: 'var(--text-secondary)' }}>Taxes & Fees</span>
                    <span style={{ color: 'var(--text-primary)' }}>{(booking.totalPrice * 0.1).toFixed(1)} SUI</span>
                  </div>
                  <div 
                    className="flex justify-between items-center pt-4 border-t"
                    style={{ borderColor: 'var(--border-primary)' }}
                  >
                    <span 
                      className="text-lg font-bold"
                      style={{ color: 'var(--text-primary)' }}
                    >
                      Total Paid
                    </span>
                    <span 
                      className="text-xl font-bold"
                      style={{ color: 'var(--primary)' }}
                    >
                      {booking.totalPrice} SUI
                    </span>
                  </div>
                  <p 
                    className="text-xs text-center pt-2"
                    style={{ color: 'var(--text-tertiary)' }}
                  >
                    Payment processed via Sui blockchain
                  </p>
                </div>
              </div>

              {/* Blockchain Verification */}
              <div 
                className="rounded-xl p-6 shadow-lg border"
                style={{ 
                  backgroundColor: 'var(--surface-primary)', 
                  borderColor: 'var(--border-primary)' 
                }}
              >
                <h3 
                  className="text-lg font-bold mb-6"
                  style={{ color: 'var(--text-primary)' }}
                >
                  Blockchain Verification
                </h3>
                
                <div className="space-y-4">
                  <div className="flex items-center p-4 rounded-lg border" style={{ 
                    backgroundColor: 'var(--surface-secondary)', 
                    borderColor: 'var(--border-primary)' 
                  }}>
                    <Wallet className="w-6 h-6 mr-3" style={{ color: 'var(--primary)' }} />
                    <div className="flex-1">
                      <p className="font-medium" style={{ color: 'var(--text-primary)' }}>Booking NFT</p>
                      <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Stored in your wallet</p>
                    </div>
                  </div>
                  
                  <Button
                    onClick={handleViewNFT}
                    className="w-full py-3 font-medium"
                  >
                    <Wallet size={18} className="mr-2" />
                    View NFT
                  </Button>
                  
                  <div className="space-y-3 pt-4">
                    <div className="flex items-center p-3 rounded-lg border" style={{ 
                      backgroundColor: 'var(--surface-secondary)', 
                      borderColor: 'var(--border-primary)' 
                    }}>
                      <Shield className="w-5 h-5 mr-3" style={{ color: 'var(--success)' }} />
                      <div>
                        <p className="font-medium text-sm" style={{ color: 'var(--text-primary)' }}>Verified on Sui</p>
                        <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>Immutable record</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center p-3 rounded-lg border" style={{ 
                      backgroundColor: 'var(--surface-secondary)', 
                      borderColor: 'var(--border-primary)' 
                    }}>
                      <Award className="w-5 h-5 mr-3" style={{ color: 'var(--warning)' }} />
                      <div>
                        <p className="font-medium text-sm" style={{ color: 'var(--text-primary)' }}>Fraud Protected</p>
                        <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>Blockchain secured</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-3 max-w-screen-xl mx-auto">
          {/* <Button
            onClick={handleViewNFT}
            className="flex-1 py-3 font-medium"
         
          >
            <Wallet size={18} className="mr-2" />
            View NFT
          </Button> */}
          <Button
          variant="danger"
            onClick={handleCancelBooking}
            className="flex-1 py-3 font-medium"
         
          >
            Cancel Booking
          </Button>
        </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

 

      {/* Cancel Booking Modal */}
      <Modal
        isOpen={showCancelModal}
        onClose={() => setShowCancelModal(false)}
        title="Cancel Booking"
      >
        <div className="space-y-4">
          <p style={{ color: 'var(--text-secondary)' }}>
            Are you sure you want to cancel this booking? This action cannot be undone and may incur cancellation fees.
          </p>
          <div className="flex gap-3 pt-4">
            <Button
              onClick={() => setShowCancelModal(false)}
              className="flex-1"
           
            >
              Keep Booking
            </Button>
            <Button
              onClick={() => {
                console.log("Booking cancelled");
                setShowCancelModal(false);
              }}
              className="flex-1"
           
            >
              Cancel Booking
            </Button>
          </div>
        </div>
      </Modal>

      {/* NFT Modal */}
      <Modal
        isOpen={showNFTModal}
        onClose={() => setShowNFTModal(false)}
        title="Booking NFT"
      >
        <div className="space-y-4 text-center">
          <div 
            className="w-32 h-32 mx-auto rounded-lg border-2 flex items-center justify-center"
            style={{ borderColor: 'var(--primary)' }}
          >
            <Wallet size={48} style={{ color: 'var(--primary)' }} />
          </div>
          <h3 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>
            Your Booking NFT
          </h3>
          <p style={{ color: 'var(--text-secondary)' }}>
            This NFT represents your verified booking and is stored securely in your Sui wallet.
          </p>
          <div className="pt-4">
            <Button
              onClick={() => setShowNFTModal(false)}
              className="w-full py-3"
            >
              <ExternalLink size={18} className="mr-2" />
              View in Wallet
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

// Helper component for detail cards
const DetailCard: React.FC<{
  icon: React.ReactNode;
  label: string;
  value: string;
  subtitle?: string;
}> = ({ icon, label, value, subtitle }) => (
  <div 
    className="p-4 rounded-lg border"
    style={{ 
      backgroundColor: 'var(--surface-secondary)',
      borderColor: 'var(--border-primary)'
    }}
  >
    <div className="flex items-center mb-2">
      <div style={{ color: 'var(--primary)' }} className="mr-2">
        {icon}
      </div>
      <span 
        className="text-sm font-medium"
        style={{ color: 'var(--text-secondary)' }}
      >
        {label}
      </span>
    </div>
    <p 
      className="font-bold mb-1"
      style={{ color: 'var(--text-primary)' }}
    >
      {value}
    </p>
    {subtitle && (
      <p 
        className="text-xs"
        style={{ color: 'var(--text-tertiary)' }}
      >
        {subtitle}
      </p>
    )}
  </div>
);

export default BookingDetails;