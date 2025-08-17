import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar } from 'lucide-react';
import { useBookingStore } from '../store/bookingStore';
import { Button } from '../components/ui/Button';
import BookingCard from '../components/ui/BookingCard';
import Loading from '../components/Loading';
import { useReservations } from '../hooks/useQuery';
import { useWallet } from '../contexts/WalletContext';
import ConnectWallet from '../components/ConnectWallet';
import type { Reservation } from '../types';

type TabType = 'upcoming' | 'past';

const Bookings: React.FC = () => {
  const { address } = useWallet();
  const { bookings, loading: storeLoading, error: storeError } = useBookingStore();
  const { data: reservations = [], isLoading: reservationsLoading } = useReservations(address || '' );
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = React.useState<TabType>('upcoming');

  useEffect(() => {
    if (reservations && !reservationsLoading) {
      // Store is updated via useReservations hook
    }
  }, [reservations, reservationsLoading]);

  const handleClickBooking = (id: string) => {
    navigate(`/bookings/${id}`);
  };

  const getFilteredBookings = (): Reservation[] => {
    const now = Date.now() / 1000; // Convert to timestamp
    switch (activeTab) {
      case 'upcoming':
        return bookings.filter((b) => b.startDate >= now && b.isActive);
      case 'past':
        return bookings.filter((b) => b.startDate < now || !b.isActive);
      default:
        return bookings;
    }
  };

  const filteredBookings = getFilteredBookings();

  const EmptyState = ({ tab }: { tab: TabType }) => {
    const configs = {
      upcoming: {
        title: 'No upcoming bookings',
        description: 'You don’t have any upcoming bookings. Start exploring hotels and make your first booking!',
      },
      past: {
        title: 'No past bookings',
        description: 'Your booking history will appear here once you complete your first stay.',
      },
    };

    const config = configs[tab];

    return (
      <div className="flex flex-col items-center justify-center py-16 px-4 text-center space-y-2 min-h-[200px]">
        <div className="w-20 h-20 md:w-24 md:h-24 bg-surface-secondary rounded-full flex items-center justify-center">
          <Calendar size={28} className="text-text-tertiary md:w-8 md:h-8" />
        </div>
        <div className="space-y-3 max-w-md">
          <h3 className="text-lg md:text-xl font-semibold text-text-primary">{config.title}</h3>
          <p className="text-sm md:text-base text-text-secondary leading-relaxed">{config.description}</p>
        </div>
        <Button onClick={() => navigate('/hotels')} className="mt-4">
          Explore Hotels
        </Button>
      </div>
    );
  };

  if (!address) {
    return (
      <main className="animate-fade-in">
        <div className="py-6 space-y-6">
          <div className="text-center p-6 max-w-md mx-auto">
            <h3 className="text-lg font-semibold text-text-primary mb-4">Wallet Not Connected</h3>
            <p className="text-sm text-text-secondary mb-6">Please connect your wallet to view your bookings.</p>
            <ConnectWallet />
          </div>
        </div>
      </main>
    );
  }

  if (storeLoading || reservationsLoading) {
    return (
      <main className="animate-fade-in">
        <div className="py-6 space-y-6">
          <h1 className="text-2xl md:text-3xl font-bold text-text-primary">My Bookings</h1>
          <Loading message="Getting your bookings" />
        </div>
      </main>
    );
  }

  if (storeError) {
    return (
      <main className="animate-fade-in">
        <div className="py-6 space-y-6">
          <h1 className="text-2xl md:text-3xl font-bold text-text-primary">My Bookings</h1>
          <div className="text-center p-6 max-w-md mx-auto">
            <h3 className="text-lg font-semibold text-text-primary mb-4">Error Loading Bookings</h3>
            <p className="text-sm text-text-secondary mb-6">
              {storeError || 'Failed to load your bookings. Please try again later.'}
            </p>
            <Button onClick={() => navigate('/hotels')}>Browse Hotels</Button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="animate-fade-in">
      <div className="py-6 space-y-6">
        <h1 className="text-2xl md:text-3xl font-bold text-text-primary">My Bookings</h1>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div className="flex items-center gap-2 p-1 rounded-lg bg-surface-secondary w-fit">
            {(['upcoming', 'past'] as TabType[]).map((tab) => (
              <Button
                key={tab}
                variant={activeTab === tab ? 'primary' : 'ghost'}
                onClick={() => setActiveTab(tab)}
                className="px-4 py-2 text-sm capitalize"
              >
                {tab}
              </Button>
            ))}
          </div>

          <div className="flex items-center sm:justify-end gap-4">
            <p className="text-sm text-text-secondary">
              {filteredBookings.length} {filteredBookings.length === 1 ? 'booking' : 'bookings'}
            </p>
          </div>
        </div>

        {filteredBookings.length === 0 ? (
          <EmptyState tab={activeTab} />
        ) : (
          <div className="grid gap-4 sm:gap-6 grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
            {filteredBookings.map((booking) => (
              <BookingCard
                key={booking.id}
                booking={booking}
                onClick={() => handleClickBooking(booking.id)}
              />
            ))}
          </div>
        )}
      </div>
    </main>
  );
};

export default Bookings;