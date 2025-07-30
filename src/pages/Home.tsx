// Home.tsx
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useHotelStore } from '../store/hotelStore';
import HotelCard from '../components/ui/HotelCard';

const Home: React.FC = () => {

  // const { hotels, fetchHotels } = useHotelStore();
  const navigate = useNavigate();
  // const featuredHotels = hotels.slice(0, 4);

  // useEffect(() => {
  //   fetchHotels();
  // }, [fetchHotels]);


  return (
    <main className="animate-fade-in">
     <div className="space-y-16">
    {/* Hero Section */}
<div className="relative rounded-2xl overflow-hidden h-[400px] lg:h-[500px] flex items-center justify-center text-center">
  <img src="/images/hero.png" alt="Hero" className="absolute inset-0 w-full h-full object-cover" />
  <div className="absolute inset-0 bg-black/50"></div>

  {/* Text content */}
  <div className="relative z-10 w-full lg:max-w-3xl px-4">
    <h1 className="text-2xl lg:text-5xl font-bold text-white mb-4">
      Discover Your Perfect Stay on the Sui Blockchain
    </h1>
    <p className="text-lg text-white/90">
      Transparent, secure, and decentralized hospitality for the future of hotel bookings.
    </p>
  </div>
</div>

 

      {/* Featured Stays Section */}
      {/* {featuredHotels.length > 0 && (
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-3xl font-bold mb-2">Featured Stays</h2>
            <button
              onClick={() => navigate('/hotels')}
              className="text-primary font-medium hover:underline"
            >
              See All
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredHotels.map((hotel) => (
              <HotelCard key={hotel.id} hotel={hotel} />
            ))}
          </div>
        </div>
      )} */}
    </div>
 </main>
  );
};

export default Home;