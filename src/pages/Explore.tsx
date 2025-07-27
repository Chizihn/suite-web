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
  { label: "Beach Resort", icon: Sun, image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop" },
  { label: "City Hotels", icon: Building, image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=300&fit=crop" },
  { label: "Mountain Lodge", icon: Mountain, image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=400&h=300&fit=crop" },
  { label: "Luxury Suite", icon: Gem, image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=400&h=300&fit=crop" },
  { label: "Family Resort", icon: Users, image: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=400&h=300&fit=crop" },
  { label: "Pet Friendly", icon: PawPrint, image: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400&h=300&fit=crop" },
];

const popularAmenities: Amenity[] = [
  { name: "Free WiFi" }, { name: "Pool" }, { name: "Spa & Wellness" },
  { name: "Beach Access" }, { name: "Pet Friendly" }, { name: "Restaurant" },
  { name: "Fitness Center" }, { name: "Room Service" },
];

const featuredDeals: Deal[] = [
  { title: "Weekend Getaway", subtitle: "Up to 30% off", image: "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=400&h=250&fit=crop" },
  { title: "Business Travel", subtitle: "Free upgrades", image: "https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=400&h=250&fit=crop" },
  { title: "Family Vacation", subtitle: "Kids stay free", image: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=400&h=250&fit=crop" },
];

const Explore: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const navigate = useNavigate();

  const filteredCategories = categories.filter((cat) =>
    cat.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCategoryPress = (category: Category) => navigate(`/hotels?category=${encodeURIComponent(category.label)}`);
  const handleDealPress = (deal: Deal) => navigate(`/hotels?deal=${encodeURIComponent(deal.title)}`);
  const handleAmenityPress = (amenity: Amenity) => navigate(`/hotels?amenity=${encodeURIComponent(amenity.name)}`);

  return (
    <main className="animate-fade-in">
      <div className=" py-6">
        <header className="mb-8">
          <h1 className="text-4xl font-display text-text-primary mb-2">Explore</h1>
          <p className="text-text-secondary">Discover your next perfect getaway.</p>
          <SearchInput
            placeholder="Search destinations, hotels, or locations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="mt-6"
            variant="default"
            inputSize="lg"
          />
        </header>

        <section className="mb-10">
          <div className="flex justify-between items-center mb-4">
            <h2 className="section-title">Categories</h2>
            <Button variant="ghost" size="small" onClick={() => navigate('/hotels')}>See all</Button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {filteredCategories.map((category) => {
              const Icon = category.icon;
              return (
                <button key={category.label} onClick={() => handleCategoryPress(category)} className="group text-center">
                  <div className="relative w-full aspect-square rounded-2xl overflow-hidden mb-2 shadow-sm bg-surface-secondary group-hover:opacity-90 transition-opacity">
                    <img src={category.image} alt={category.label} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                    <div className="absolute bottom-2 right-2 p-1.5 bg-background-primary/50 backdrop-blur-sm rounded-full">
                      <Icon className="text-text-primary" size={18} />
                    </div>
                  </div>
                  <p className="text-sm font-medium text-text-primary">{category.label}</p>
                </button>
              );
            })}
          </div>
        </section>

        <section className="mb-10">
          <div className="flex justify-between items-center mb-4">
            <h2 className="section-title">Popular Amenities</h2>
            <Button variant="ghost" size="small" onClick={() => navigate('/hotels')}>View all</Button>
          </div>
          <div className="flex flex-wrap gap-2.5">
            {popularAmenities.map((amenity) => (
              <Button key={amenity.name} variant="outline" size="small" onClick={() => handleAmenityPress(amenity)}>
                {amenity.name}
              </Button>
            ))}
          </div>
        </section>

        <section>
          <div className="flex justify-between items-center mb-4">
            <h2 className="section-title">Featured Deals</h2>
            <Button variant="ghost" size="small" onClick={() => navigate('/hotels')}>See all</Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {featuredDeals.map((deal) => (
              <div key={deal.title} onClick={() => handleDealPress(deal)} className="relative rounded-2xl overflow-hidden h-48 cursor-pointer group shadow-lg">
                <img src={deal.image} alt={deal.title} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute inset-0 p-4 flex flex-col justify-end">
                  <h3 className="text-white font-bold text-lg">{deal.title}</h3>
                  <p className="text-white/90 text-sm">{deal.subtitle}</p>
                  <div className="absolute top-4 right-4 p-2 rounded-full bg-white/20 backdrop-blur-sm group-hover:bg-primary transition-colors">
                    <ArrowRight size={18} className="text-white" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
};

export default Explore;
