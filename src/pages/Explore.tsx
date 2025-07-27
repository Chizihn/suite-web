import { useState } from "react";
import { useNavigate } from "react-router-dom";
import SearchInput from "../components/ui/SearchInput";

interface Category {
  label: string;
  icon: string;
  image: string;
  color: string;
}

interface Amenity {
  name: string;
}

interface Deal {
  title: string;
  subtitle: string;
  image: string;
  gradient: string[];
}

const categories: Category[] = [
  {
    label: "Beach Resort",
    icon: "ios-sunny",
    image:
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop",
    color: "#FF6B6B",
  },
  {
    label: "City Hotels",
    icon: "business",
    image:
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=300&fit=crop",
    color: "#4ECDC4",
  },
  {
    label: "Mountain Lodge",
    icon: "leaf",
    image:
      "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=400&h=300&fit=crop",
    color: "#45B7D1",
  },
  {
    label: "Luxury Suite",
    icon: "diamond",
    image:
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=400&h=300&fit=crop",
    color: "#F7DC6F",
  },
  {
    label: "Family Resort",
    icon: "people",
    image:
      "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=400&h=300&fit=crop",
    color: "#BB8FCE",
  },
  {
    label: "Pet Friendly",
    icon: "paw",
    image:
      "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400&h=300&fit=crop",
    color: "#82E0AA",
  },
];

const popularAmenities: Amenity[] = [
  { name: "Free WiFi" },
  { name: "Pool" },
  { name: "Spa & Wellness" },
  { name: "Beach Access" },
  { name: "Pet Friendly" },
  { name: "Restaurant" },
  { name: "Fitness Center" },
  { name: "Room Service" },
];

const featuredDeals: Deal[] = [
  {
    title: "Weekend Getaway",
    subtitle: "Up to 30% off",
    image:
      "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=400&h=250&fit=crop",
    gradient: ["#FF6B6B", "#FF8E8E"],
  },
  {
    title: "Business Travel",
    subtitle: "Free upgrades",
    image:
      "https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=400&h=250&fit=crop",
    gradient: ["#4ECDC4", "#44A08D"],
  },
  {
    title: "Family Vacation",
    subtitle: "Kids stay free",
    image:
      "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=400&h=250&fit=crop",
    gradient: ["#45B7D1", "#96C93D"],
  },
];

const Explore: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const navigate = useNavigate();

  const filteredCategories = categories.filter((cat) =>
    cat.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCategoryPress = (category: Category) =>
    navigate(`/hotels?category=${encodeURIComponent(category.label)}`);

  const handleDealPress = (deal: Deal) =>
    navigate(`/hotels?deal=${encodeURIComponent(deal.title)}`);

  const handleAmenityPress = (amenity: Amenity) =>
    navigate(`/hotels?amenity=${encodeURIComponent(amenity.name)}`);

  return (
    <div className="p-4 bg-background-primary min-h-screen">
      {/* Search Section */}
      <div className="sticky top-0 z-10 bg-background-primary pt-2 pb-4 mb-6">
        <SearchInput
          variant="filled"
          inputSize="md"
          placeholder="Search destinations, hotels, or locations..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full"
          inputClassName="pl-12 pr-6"
        />
      </div>

      {/* Categories Section */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4 px-1">
          <h3 className="text-lg font-semibold text-text-primary">Categories</h3>
          <button className="text-xs font-medium text-primary">See all</button>
        </div>
        <div className="flex overflow-x-auto gap-3 pb-2 -mx-1 px-1">
          {filteredCategories.map((category) => (
            <button
              key={category.label}
              onClick={() => handleCategoryPress(category)}
              className="flex-shrink-0 w-28 flex flex-col items-center"
            >
              <div className="relative w-full aspect-square rounded-xl overflow-hidden mb-2">
                <img
                  src={category.image}
                  alt={category.label}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                  <div 
                    className="w-10 h-10 rounded-xl flex items-center justify-center backdrop-blur-sm"
                    style={{ backgroundColor: `${category.color}CC` }}
                  >
                    <span className="text-white">✨</span>
                  </div>
                </div>
              </div>
              <p className="text-xs font-medium text-text-primary text-center px-1">
                {category.label}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* Popular Amenities */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4 px-1">
          <h3 className="text-lg font-semibold text-text-primary">Popular Amenities</h3>
          <button className="text-xs font-medium text-primary">View all</button>
        </div>
        <div className="flex flex-wrap gap-2.5">
          {popularAmenities.map((amenity) => (
            <button
              key={amenity.name}
              onClick={() => handleAmenityPress(amenity)}
              className="px-4 py-2 text-sm rounded-lg transition-colors
                       bg-surface-primary hover:bg-surface-secondary text-text-primary
                       border border-border-primary/30"
            >
              {amenity.name}
            </button>
          ))}
        </div>
      </div>

      {/* Featured Deals */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4 px-1">
          <h3 className="text-lg font-semibold text-text-primary">Featured Deals</h3>
          <button className="text-xs font-medium text-primary">See all</button>
        </div>
        <div className="grid grid-cols-1 gap-3">
          {featuredDeals.map((deal) => (
            <div
              key={deal.title}
              onClick={() => handleDealPress(deal)}
              className="relative rounded-xl overflow-hidden h-32 cursor-pointer group"
            >
              <img
                src={deal.image}
                alt={deal.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div
                className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"
              />
              <div className="absolute inset-0 p-4 flex flex-col justify-end">
                <h4 className="text-white text-base font-semibold">
                  {deal.title}
                </h4>
                <p className="text-white/90 text-sm">{deal.subtitle}</p>
                <div className="absolute top-3 right-3 w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm 
                            flex items-center justify-center group-hover:bg-primary/80 transition-colors">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Explore;
