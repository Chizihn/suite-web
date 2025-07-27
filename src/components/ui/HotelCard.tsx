import React from "react";
import { useNavigate } from "react-router-dom";
import type { Hotel } from "../../types";
import { Star, MapPin } from "lucide-react";

export interface HotelCardProps {
  hotel: Hotel;
  onClick?: () => void;
  className?: string;
  viewMode?: "grid" | "list";
}

const HotelCard: React.FC<HotelCardProps> = ({ hotel, onClick, className, viewMode = "grid" }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      navigate(`/hotels/${hotel.id}`);
    }
  };

  if (viewMode === "list") {
    return (
      <div
        onClick={handleClick}
        className={`cursor-pointer card transition-shadow duration-200 overflow-hidden flex items-center w-full ${className}`}
      >
        <img
          src={hotel.images?.[0]}
          alt={hotel.name}
          className="w-64 h-40 object-cover"
        />
        <div className="p-4 flex-grow">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-h5 text-text-primary font-semibold mb-1">
                {hotel.name}
              </h3>
              <div className="flex items-center text-body2 text-text-secondary mb-2">
                <MapPin size={16} className="mr-1" />
                <span>{hotel.location}</span>
              </div>
            </div>
            <div className="flex items-center text-body2 text-text-primary shrink-0 ml-4">
              <Star size={16} className="mr-1 text-yellow-500" />
              <span className="font-semibold">{hotel.rating?.toFixed(1) || "N/A"}</span>
            </div>
          </div>
          <p className="text-body3 text-text-tertiary line-clamp-2 mb-4">
            {hotel.description}
          </p>
          <div className="text-right">
            <p className="text-h6 font-bold text-text-primary">${hotel.price} <span className="text-body3 font-normal text-text-secondary">/ night</span></p>
          </div>
        </div>
      </div>
    );
  }

  // Grid view is the default
  return (
    <div
      onClick={handleClick}
      className={`cursor-pointer card rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 overflow-hidden ${className}`}
    >
      <div className="relative">
        <img
          src={hotel.images?.[0]}
          alt={hotel.name}
          className="w-full h-48 object-cover"
        />
        <div className="absolute top-2 right-2 bg-background/80 backdrop-blur-sm rounded-full px-2 py-1 text-sm flex items-center font-semibold">
            <Star size={14} className="mr-1 text-yellow-500" />
            <span>{hotel.rating?.toFixed(1) || "N/A"}</span>
        </div>
      </div>
      <div className="p-4">
        <h3 className="text-h5 text-text-primary font-semibold mb-1 truncate">
          {hotel.name}
        </h3>
        <div className="flex items-center text-body2 text-text-secondary mb-2">
            <MapPin size={16} className="mr-1" />
            <span className="truncate">{hotel.location}</span>
        </div>
        {/* <div className="text-right">
            <p className="text-h6 font-bold text-text-primary">${hotel.price} <span className="text-body3 font-normal text-text-secondary">/ night</span></p>
        </div> */}
      </div>
    </div>
  );
};

export default HotelCard;
