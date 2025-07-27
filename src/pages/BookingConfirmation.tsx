import React from "react";
import { useNavigate } from "react-router-dom";
import { useBookingStore } from "../store/bookingStore";
import { ArrowLeft, CheckCircle } from "lucide-react";
import { Button } from "../components/ui/Button";

const BookingConfirmation: React.FC = () => {
  const navigate = useNavigate();
  const { currentBooking } = useBookingStore();

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleViewBooking = () => {
    if (currentBooking) {
      navigate(`/booking/${currentBooking.id}`);
    }
  };

  const handleGoToBookings = () => {
    navigate("/bookings");
  };

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
          Booking Confirmation
        </h1>
      </div>

      <div className="lg:max-w-2xl lg:mx-auto">
        <div className="text-center px-4 pt-6">
          <div className="mb-4">
            <CheckCircle size={64} className="text-success" />
          </div>
          <h2 className="text-2xl font-bold text-primary mb-3">Booking Confirmed!</h2>
          <p className="text-sm text-secondary max-w-md mx-auto leading-6">
            Your booking has been successfully confirmed and your unique booking
            NFT has been minted to your wallet.
          </p>
        </div>

        <div className="h-48 w-full mt-6 rounded-xl overflow-hidden">
          <img
            src={currentBooking?.hotelImage}
            alt={currentBooking?.hotelName}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="mt-6 bg-surface rounded-xl p-4">
          <h3 className="text-lg text-primary font-medium mb-3">
            {currentBooking?.hotelName}
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-secondary">Check-in</span>
              <span className="text-sm text-primary font-medium">
                {currentBooking?.checkIn}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-secondary">Check-out</span>
              <span className="text-sm text-primary font-medium">
                {currentBooking?.checkOut}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-secondary">Guests</span>
              <span className="text-sm text-primary font-medium">
                {currentBooking?.guests} {currentBooking?.guests === 1 ? 'Guest' : 'Guests'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-secondary">Room Type</span>
              <span className="text-sm text-primary font-medium">
                {currentBooking?.roomType}
              </span>
            </div>
            <div className="pt-3 border-t border-border-primary">
              <div className="flex justify-between items-center">
                <span className="text-lg text-primary font-medium">Total</span>
                <span className="text-xl text-primary font-bold">
                  ${currentBooking?.totalPrice}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 bg-surface rounded-xl p-4">
          <h3 className="text-lg text-primary font-medium mb-3">
            Your Booking NFT
          </h3>
          <p className="text-sm text-secondary mb-4">
            Your unique booking NFT has been minted to your wallet. This NFT
            serves as your booking confirmation and room key.
          </p>
          <div className="flex items-center justify-between p-3 bg-surface-secondary rounded-lg">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mr-3">
                <CheckCircle size={20} className="text-primary" />
              </div>
              <div>
                <p className="text-sm text-primary font-medium">
                  Booking #{currentBooking?.id?.substring(0, 8)}
                </p>
                <p className="text-xs text-secondary">
                  Transaction: {currentBooking?.transactionId?.substring(0, 12)}...
                </p>
              </div>
            </div>
            <button
              onClick={handleViewBooking}
              className="text-sm font-medium text-primary hover:underline"
            >
              View
            </button>
          </div>
        </div>

        <div className="fixed bottom-0 left-0 right-0 p-4 bg-background border-t border-border-primary">
          <Button
            onClick={handleGoToBookings}
            className="w-full bg-primary text-text-inverse rounded-lg py-3"
          >
            View All Bookings
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BookingConfirmation;
