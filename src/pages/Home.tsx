// Home.tsx
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SearchInput from '../components/ui/SearchInput';
import { useHotelStore } from '../store/hotelStore';
import HotelCard from '../components/ui/HotelCard';

const Home: React.FC = () => {
  const { hotels, fetchHotels } = useHotelStore();
  const navigate = useNavigate();
  const featuredHotels = hotels.slice(0, 3);

  useEffect(() => {
    fetchHotels();
  }, [fetchHotels]);

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="relative rounded-2xl overflow-hidden">
        <img
          src="/images/hero.png"
          alt="Hero"
          className="w-full h-[300px] lg:h-[450px] object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background-primary/80 to-transparent"></div>
        <div className="absolute bottom-6 left-6 right-6">
          <h2 className="text-2xl lg:text-4xl font-bold text-white mb-2">Discover Your Next Stay</h2>
          <p className="text-secondary text-sm lg:text-base">Book hotels with crypto, seamlessly.</p>
        </div>
      </div>

      {/* Search Section */}
      <div className="px-4">
        <div className="relative">
          <SearchInput
            variant="filled"
            inputSize="lg"
            placeholder="Search destinations, hotels, or locations..."
            className="w-full"
            // inputClassName="pl-12 pr-6 py-4 text-base"
            onFocus={() => navigate('/explore')}
          />
        </div>
      </div>

      {/* Featured Stays Section */}
      {featuredHotels.length > 0 && (
        <div className="px-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-white">Featured Stays</h2>
            <button
              onClick={() => navigate('/hotels')}
              className="text-primary text-sm font-medium hover:underline"
            >
              See All
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredHotels.map((hotel) => (
              <HotelCard key={hotel.id} hotel={hotel} className="hover:scale-105 transition-transform duration-300" />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;