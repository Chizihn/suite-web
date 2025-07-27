import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useBookingStore } from "../store/bookingStore";
import { Button } from "../components/ui/Button";

const BookingDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { bookings, fetchBookings, loading, setCurrentBooking } =
    useBookingStore();
  const booking = bookings.find((b) => b.id === id);

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
    console.log("View NFT:", booking?.nftToken);
  };

  const handleCancelBooking = () => {
    console.log("Cancel booking pressed");
  };

  if (loading || !booking) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <p className="text-sm text-secondary">Loading booking...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="flex items-center mb-6">
        <button
          onClick={handleGoBack}
          className="p-2 rounded-full hover:bg-surface-hover"
        >
          <ArrowLeft size={20} className="text-primary" />
        </button>
        <h1 className="text-xl font-semibold text-primary ml-2">
          Booking Details
        </h1>
      </div>

      <div className="space-y-6">
        {/* Success Message */}
        <div className="text-center">
          <h2 className="text-h2 text-text-primary mb-2">Booking Confirmed!</h2>
          <p className="text-body2 text-text-secondary max-w-md mx-auto">
            Your booking at {booking.hotelName} is confirmed. Your booking NFT
            is stored in your wallet.
          </p>
        </div>

        {/* Hotel Room Image */}
        <div className="h-48 mx-4 rounded-md overflow-hidden">
          <img
            src={booking.hotelImage}
            alt={booking.hotelName}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Booking Details */}
        <div className="mx-4">
          <h3 className="text-h4 text-text-primary mb-4">Booking Details</h3>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <Detail label="Check-in" value={booking.checkIn} />
            <Detail label="Check-out" value={booking.checkOut} />
            <Detail label="Guests" value={booking.guests.toString()} />
            <Detail label="Nights" value={booking.nights.toString()} />
          </div>
          <Detail label="Room Type" value={booking.roomType} />
          <Detail label="Total Price" value={`$${booking.totalPrice}`} />
        </div>

        {/* Transaction Status */}
        <div className="mx-4">
          <h3 className="text-h4 text-text-primary mb-4">Transaction Status</h3>
          <div className="border-t border-border-primary pt-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-secondary">Total</span>
              <span className="text-lg font-semibold text-primary">
                {booking.totalPrice} SUI
              </span>
            </div>
            <p className="text-xs text-tertiary">
              Includes all taxes and fees
            </p>
          </div>
          <div className="flex justify-between items-start mb-4">
            <div>
              <h2 className="text-lg text-primary font-medium">
                {booking.hotelName}
              </h2>
              <p className="text-sm text-secondary mt-1">
                {booking.roomType}
              </p>
            </div>
            <span className="px-3 py-1 bg-primary/10 rounded-full text-xs font-medium text-primary">
              {booking.status}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-body2 text-text-secondary">
              Booking NFT
            </span>
            <button
              onClick={handleViewNFT}
              className="flex items-center gap-2 px-2 py-1 bg-surface-secondary rounded-sm border border-border-primary"
            >
              View NFT
            </button>
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-background border-t border-border-primary">
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={handleViewNFT}
            className="flex-1 bg-surface text-primary border-border-primary hover:bg-surface-hover"
          >
            View NFT
          </Button>
          <Button
            variant="danger"
            onClick={handleCancelBooking}
            className="flex-1"
          >
            Cancel Booking
          </Button>
        </div>
      </div>
    </div>
  );
};

const Detail: React.FC<{ label: string; value: string }> = ({
  label,
  value,
}) => (
  <div className="flex justify-between items-center py-2 border-b border-border-primary">
    <span className="text-body2 text-text-secondary">{label}</span>
    <span className="text-body2 text-text-primary font-medium">{value}</span>
  </div>
);

export default BookingDetails;
