import type { Booking } from "../../types";

interface BookingCardProps {
  booking: Booking;
  onClick: () => void;
}
const BookingCard: React.FC<BookingCardProps> = ({ booking, onClick }) => {
  return (
    <div
      onClick={onClick}
      className="cursor-pointer card overflow-hidden hover:shadow-md transition"
    >
      <img
        src={booking.hotelImage || "https://via.placeholder.com/400x200"}
        alt={booking.hotelName}
        className="w-full h-40 object-cover"
      />
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-1">{booking.hotelName}</h3>
        <p className="text-sm text-gray-600">
          {booking.nights} nights • {booking.checkIn} - {booking.checkOut}
        </p>
      </div>
    </div>
  );
};

export default BookingCard;
