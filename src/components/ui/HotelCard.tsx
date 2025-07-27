import React from "react";
import { useNavigate } from "react-router-dom";
import type { Hotel } from "../../types";

interface HotelCardProps {
  hotel: Hotel;
  onClick?: () => void;
  className?: string;
}

const HotelCard: React.FC<HotelCardProps> = ({ hotel, onClick, className }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      navigate(`/hotels/${hotel.id}`);
    }
  };

  return (
    <div
      onClick={handleClick}
      className={`cursor-pointer bg-surface-secondary rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 overflow-hidden ${className}`}
    >
      <img
        src={hotel.images?.[0]}
        alt={hotel.name}
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <h3 className="text-h5 text-text-primary font-semibold mb-1">
          {hotel.name}
        </h3>
        <p className="text-body2 text-text-secondary mb-2">{hotel.location}</p>
        <p className="text-body3 text-text-tertiary line-clamp-3">
          {hotel.description}
        </p>
      </div>
    </div>
  );
};

export default HotelCard;
