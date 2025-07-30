import type React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Sun, Building, Mountain, Gem, Users, PawPrint, ArrowRight } from "lucide-react";
import SearchInput from "../components/ui/SearchInput";
import { Button } from "../components/ui/Button";

interface Category {
  label: string;
  icon: React.ElementType;
  image: string;
}

interface Amenity {
  name: string;
}

interface Deal {
  title: string;
  subtitle: string;
  image: string;
}

const categories: Category[] = [
  { label: "Beach Resort", icon: Sun, image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?fit=crop" },
  { label: "City Hotels", icon: Building, image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?fit=crop" },
  { label: "Mountain Lodge", icon: Mountain, image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?fit=crop" },
  { label: "Luxury Suite", icon: Gem, image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?fit=crop" },
  { label: "Family Resort", icon: Users, image: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?fit=crop" },
  { label: "Pet Friendly", icon: PawPrint, image: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?fit=crop" },
];

const popularAmenities: Amenity[] = [
  { name: "Free WiFi" }, { name: "Pool" }, { name: "Spa & Wellness" },
  { name: "Beach Access" }, { name: "Pet Friendly" }, { name: "Restaurant" },
  { name: "Fitness Center" }, { name: "Room Service" },
];

const featuredDeals: Deal[] = [
  { title: "Weekend Getaway", subtitle: "Up to 30% off", image: "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?fit=crop" },
  { title: "Business Travel", subtitle: "Free upgrades", image: "https://images.unsplash.com/photo-1564501049412-61c2a3083791?fit=crop" },
  { title: "Family Vacation", subtitle: "Kids stay free", image: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?fit=crop" },
];

const Explore: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const navigate = useNavigate();

  const filteredCategories = categories.filter((cat) =>
    cat.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCategoryPress = (category: Category) => {
    const encodedLabel = encodeURIComponent(category.label.replace(/\s+/g, '-').toLowerCase());
    navigate(`/hotels?category=${encodedLabel}`);
  };

  const handleDealPress = (deal: Deal) => {
    const encodedTitle = encodeURIComponent(deal.title.replace(/\s+/g, '-').toLowerCase());
    navigate(`/hotels?deal=${encodedTitle}`);
  };

  const handleAmenityPress = (amenity: Amenity) => {
    const encodedName = encodeURIComponent(amenity.name.replace(/\s+/g, '-').toLowerCase());
    navigate(`/hotels?amenity=${encodedName}`);
  };

  return (
    <main className="min-h-screen animate-fade-in" style={{ backgroundColor: 'var(--background-primary)' }}>
      <div className="py-6">
        <header className="mb-6">
          <h1 className="text-3xl sm:text-4xl font-bold" style={{ color: 'var(--text-primary)' }}>
            Explore
          </h1>
          <p className="text-sm sm:text-base mt-2" style={{ color: 'var(--text-secondary)' }}>
            Discover your next perfect getaway.
          </p>
        
        </header>

        <div className="mb-6">
        <SearchInput
            placeholder="Search destinations, hotels, or locations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className=" w-full max-w-2xl"
            inputSize="md"
          />
        </div>

        <section className="mb-10">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl sm:text-2xl font-semibold" style={{ color: 'var(--text-primary)' }}>
              Categories
            </h2>
            <Button
              variant="outline"
              size="small"
              onClick={() => navigate('/hotels')}
              className="text-text-secondary"
            >
              See all
            </Button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
            {filteredCategories.map((category) => {
              const Icon = category.icon;
              return (
                <button
                  key={category.label}
                  onClick={() => handleCategoryPress(category)}
                  className="group text-center focus:outline-none"
                  aria-label={`Explore ${category.label}`}
                >
                  <div className="relative w-full aspect-square rounded-xl overflow-hidden shadow-sm transition-transform duration-200 group-hover:scale-105" style={{ backgroundColor: 'var(--surface-secondary)' }}>
                    <img
                      src={category.image}
                      alt={category.label}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                    <div className="absolute bottom-2 right-2 p-1.5 rounded-full" style={{ backgroundColor: 'var(--surface-primary)', opacity: 0.8 }}>
                      <Icon size={18} style={{ color: 'var(--text-primary)' }} />
                    </div>
                  </div>
                  <p className="text-sm font-medium mt-2" style={{ color: 'var(--text-primary)' }}>
                    {category.label}
                  </p>
                </button>
              );
            })}
          </div>
        </section>

        <section className="mb-10">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl sm:text-2xl font-semibold" style={{ color: 'var(--text-primary)' }}>
              Popular Amenities
            </h2>
            <Button
              variant="outline"
              size="small"
              onClick={() => navigate('/hotels')}
              className="text-text-secondary"
            >
              View all
            </Button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 sm:gap-3">
            {popularAmenities.map((amenity) => (
              <Button
                key={amenity.name}
                variant="outline"
                size="small"
                onClick={() => handleAmenityPress(amenity)}
                className="justify-center  "
              >
                {amenity.name}
              </Button>
            ))}
          </div>
        </section>

        <section>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl sm:text-2xl font-semibold" style={{ color: 'var(--text-primary)' }}>
              Featured Deals
            </h2>
            <Button
              variant="outline"
              size="small"
              onClick={() => navigate('/hotels')}
              className="text-text-secondary"
            >
              See all
            </Button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {featuredDeals.map((deal) => (
              <button
                key={deal.title}
                onClick={() => handleDealPress(deal)}
                className="relative rounded-xl overflow-hidden h-48 shadow-sm group focus:outline-none"
                style={{ backgroundColor: 'var(--surface-secondary)' }}
                aria-label={`View ${deal.title} deal`}
              >
                <img
                  src={deal.image}
                  alt={deal.title}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute inset-0 p-4 flex flex-col justify-end">
                  <h3 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>
                    {deal.title}
                  </h3>
                  <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                    {deal.subtitle}
                  </p>
                  <div className="absolute top-4 right-4 p-2 rounded-full transition-colors group-hover:bg-primary" style={{ backgroundColor: 'var(--surface-primary)', opacity: 0.8 }}>
                    <ArrowRight size={18} style={{ color: 'var(--text-primary)' }} />
                  </div>
                </div>
              </button>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
};

export default Explore;