import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useHotelStore } from "../store/hotelStore";
import { useBookingStore } from "../store/bookingStore";
import { ArrowLeft } from "lucide-react";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import {
  calculateNights,
  calculateSubtotal,
  calculateFees,
  calculateDiscount,
  calculateTotal,
} from "../utils/booking";
import Loading from "../components/Loading";
import Input from "../components/ui/Input";
import type { Hotel } from "../types/hotel";

const BookSuite: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { getHotelById } = useHotelStore();
  const { createBooking } = useBookingStore();
  const [hotel, setHotel] = useState<Hotel | null>(null);
  const [roomType, setRoomType] = useState("");
  const [guests, setGuests] = useState("");
  const [rooms, setRooms] = useState("1");
  const [checkInDate, setCheckInDate] = useState("");
  const [checkOutDate, setCheckOutDate] = useState("");
  const [isReviewMode, setIsReviewMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchHotel = async () => {
      if (!id) {
        navigate("/hotels");
        return;
      }
      
      try {
        const hotelData = await getHotelById(id);
        if (!hotelData) {
          throw new Error('Hotel not found');
        }
        setHotel(hotelData);
      } catch (err) {
        setError('Failed to load hotel details');
        console.error('Error fetching hotel:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchHotel();
  }, [id, navigate, getHotelById]);

  if (loading) {
    return <Loading message="Loading details..." />;
  }

  if (error || !hotel) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center p-6 max-w-md">
          <h2 className="text-2xl font-bold mb-4">Hotel Not Found</h2>
          <p className="mb-6">The hotel you're looking for doesn't exist or may have been removed.</p>
          <button
            onClick={() => navigate('/hotels')}
            className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
          >
            Browse Hotels
          </button>
        </div>
      </div>
    );
  }

  const handleNext = () => {
    if (isFormValid()) {
      setIsReviewMode(true);
    }
  };

  const handleBack = () => {
    setIsReviewMode(false);
  };

  const handleConfirmBooking = async () => {
    if (!hotel) return;
    
    setLoading(true);
    try {
      const bookingData = {
        id: Date.now().toString(),
        hotelId: hotel.id,
        hotelName: hotel.name,
        hotelImage: hotel.images[0] || "https://via.placeholder.com/100",
        roomType: roomType || "Standard Room",
        checkIn: checkInDate || "Jul 15, 2024",
        checkOut: checkOutDate || "Jul 17, 2024",
        guests: parseInt(guests) || 2,
        nights: getNights(),
        totalPrice: calculateTotalPrice(),
        status: "Confirmed",
        transactionId: `0x${Math.random().toString(16).substr(2, 10)}...`,
        nftToken: `NFT${Math.floor(Math.random() * 10000)}`,
      };
      await createBooking(bookingData);
      navigate(`/booking/${bookingData.id}`);
    } catch (error) {
      console.error("Booking failed:", error);
    } finally {
      setLoading(false);
    }
  };

  const isFormValid = () => {
    return roomType && guests && checkInDate && checkOutDate;
  };

  const getNights = () => {
    return calculateNights(checkInDate, checkOutDate);
  };

  const getSubtotal = () => {
    if (!hotel) return 0;
    const basePrice = hotel.price;
    const nights = getNights();
    return calculateSubtotal(basePrice, nights);
  };

  const getFees = () => {
    return calculateFees(getSubtotal());
  };

  const getDiscount = () => {
    return calculateDiscount(getSubtotal());
  };

  const calculateTotalPrice = () => {
    const subtotal = getSubtotal();
    const fees = getFees();
    const discount = getDiscount();
    return calculateTotal(subtotal, fees, discount);
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="flex items-center mb-6">
        <button
          onClick={isReviewMode ? handleBack : () => navigate(-1)}
          className="p-2 rounded-full hover:bg-surface-hover"
        >
          <ArrowLeft size={20} className="text-primary" />
        </button>
        <h1 className="text-xl font-semibold text-primary ml-2">
          {isReviewMode ? "Review Booking" : "Book Your Stay"}
        </h1>
      </div>

      <div className="lg:max-w-2xl lg:mx-auto">
        <div className="mb-6">
          <h3 className="text-h4 text-text-primary mb-3">Your Booking</h3>
          <Card variant="default" className="flex flex-row">
            <img
              src={hotel.images[0]}
              alt={hotel.name}
              className="w-24 h-24 rounded-md object-cover"
            />
            <div className="p-2">
              <p className="text-h5 text-text-primary mb-1">
                {hotel.name}
              </p>
              <p className="text-body2 text-text-secondary">
                {hotel.location}
              </p>
            </div>
          </Card>
        </div>

        {!isReviewMode ? (
          <div className="mb-6">
            <h3 className="text-h4 text-text-primary mb-3">Booking Details</h3>
            <div className="space-y-4">
              <div>
                <p className="text-label text-text-primary mb-1">Room Type</p>
                <Input
                  placeholder="Select room type"
                  value={roomType}
                  onChange={(text) => setRoomType(text)}
                  className="w-full"
                />
              </div>
              <div>
                <p className="text-label text-text-primary mb-1">Guests</p>
                <Input
                  placeholder="Number of guests"
                  value={guests}
                  onChange={setGuests}
                  type="number"
                  className="w-full"
                />
              </div>
              <div>
                <p className="text-label text-text-primary mb-1">Rooms</p>
                <Input
                  placeholder="Number of rooms"
                  value={rooms}
                  onChange={setRooms}
                  type="number"
                  className="w-full"
                />
              </div>
              <div>
                <p className="text-label text-text-primary mb-1">Dates</p>
                <div className="flex gap-2">
                  <div className="flex-1">
                    <h3 className="text-sm font-medium text-primary mb-3">
                      Your Stay
                    </h3>
                    <Input
                      placeholder="Select date"
                      value={checkInDate}
                      onChange={setCheckInDate}
                      className="w-full"
                    />
                  </div>
                  <div className="flex-1">
                    <p className="text-caption1 text-text-secondary mb-1">
                      Check-out
                    </p>
                    <Input
                      placeholder="Select date"
                      value={checkOutDate}
                      onChange={setCheckOutDate}
                      className="w-full"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="mb-6">
            <h3 className="text-h4 text-text-primary mb-3">Booking Summary</h3>
            <Card className="mb-4">
              <p className="text-body2 text-text-primary">
                Dates: {checkInDate} - {checkOutDate} | Guests: {guests} |
                Rooms: {rooms}
              </p>
            </Card>
            <h3 className="text-h4 text-text-primary mb-3">Payment</h3>
            <Card>
              <div className="bg-surface rounded-lg p-3 mb-4">
                <p className="text-xs text-secondary">Guests</p>
                <p className="text-sm text-primary">
                  {guests} {parseInt(guests) > 1 ? "Guests" : "Guest"}
                </p>
              </div>
              <div className="bg-surface rounded-xl p-4 mb-6">
                <h3 className="text-sm font-medium text-primary mb-3">
                  Room Type
                </h3>
                <p className="text-body2 text-text-primary font-semibold">
                  {getFees()} SUI
                </p>
              </div>
              <div className="bg-surface rounded-lg p-3 mb-4">
                <p className="text-xs text-secondary">Check-in</p>
                <p className="text-sm text-primary">
                  {checkInDate}
                </p>
              </div>
              <div className="flex justify-between mt-3 pt-3 border-t border-border-secondary">
                <p className="text-h5 text-text-primary">Total</p>
                <p className="text-h5 text-text-primary font-semibold">
                  {calculateTotalPrice()} SUI
                </p>
              </div>
            </Card>
          </div>
        )}

        <div className="p-4 border-t border-border-primary">
          {!isReviewMode ? (
            <Button
              onClick={handleNext}
              disabled={!isFormValid()}
              className="w-full bg-primary text-text-inverse rounded-md py-3"
            >
              Next
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button
                onClick={handleBack}
                className="flex-1 bg-surface-secondary text-text-primary rounded-md py-3 border border-border-primary"
              >
                Back
              </Button>
              <Button
                onClick={handleConfirmBooking}
                disabled={loading}
                className="flex-1 bg-primary text-text-inverse rounded-md py-3"
              >
                {loading ? "Confirming..." : "Confirm and Pay"}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookSuite;
