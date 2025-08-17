import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Frown, Filter, LayoutGrid, List, Map } from 'lucide-react';
import { useWallet } from '../contexts/WalletContext';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { useHotels } from '../hooks/useQuery';
import SearchInput from '../components/ui/SearchInput';
import HotelCard from '../components/ui/HotelCard';
import ErrorState from '../components/ErrorState';
import Loading from '../components/Loading';
import type { Hotel } from '../types';

const Hotels: React.FC = () => {
  const { data: hotels, isLoading: hotelsLoading, error: hotelsError } = useHotels();
  const { isConnected } = useWallet();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState<'list' | 'map'>('list');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filterModal, setFilterModal] = useState<boolean>(false);
  const [search, setSearch] = useState<string>('');
  const [appliedSearch, setAppliedSearch] = useState<string>('');
  const [appliedPrice, setAppliedPrice] = useState<string>('Any');
  const [appliedSort, setAppliedSort] = useState<string>('recommended');
  const [modalPrice, setModalPrice] = useState<string>('Any');
  const [searchLoading, setSearchLoading] = useState<boolean>(false);

  // Sync search query from URL
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const searchQuery = searchParams.get('search') || '';
    if (searchQuery !== appliedSearch) {
      setSearch(searchQuery);
      setAppliedSearch(searchQuery);
    }
  }, [location.search, appliedSearch]);

  // Filter and sort hotels
  const getFilteredAndSortedHotels = (): Hotel[] => {
    if (!hotels) return [];

    const filtered = hotels.filter((hotel) => {
      const matchesSearch =
        !appliedSearch ||
        hotel.name.toLowerCase().includes(appliedSearch.toLowerCase()) ||
        hotel.physical_address.toLowerCase().includes(appliedSearch.toLowerCase());

      let matchesPrice = true;
      const minPrice = hotel.minPrice ?? Number.MAX_SAFE_INTEGER;
      if (appliedPrice !== 'Any') {
        if (appliedPrice === 'Low') matchesPrice = minPrice <= 150;
        if (appliedPrice === 'Medium') matchesPrice = minPrice > 150 && minPrice <= 350;
        if (appliedPrice === 'High') matchesPrice = minPrice > 350;
      }

      return matchesSearch && matchesPrice;
    });

    switch (appliedSort) {
      case 'price-low':
        filtered.sort((a, b) => (a.minPrice ?? Number.MAX_SAFE_INTEGER) - (b.minPrice ?? Number.MAX_SAFE_INTEGER));
        break;
      case 'price-high':
        filtered.sort((a, b) => (b.minPrice ?? Number.MAX_SAFE_INTEGER) - (a.minPrice ?? Number.MAX_SAFE_INTEGER));
        break;
      case 'rating':
        filtered.sort((a, b) => (b.averageRating ?? 0) - (a.averageRating ?? 0));
        break;
      default:
        break;
    }

    return filtered;
  };

  const filteredHotels = getFilteredAndSortedHotels();

  const handleSearch = () => {
    setSearchLoading(true);
    setAppliedSearch(search);
    setTimeout(() => setSearchLoading(false), 500);
  };

  const handleApplyFilters = () => {
    setSearchLoading(true);
    setAppliedPrice(modalPrice);
    setFilterModal(false);
    setTimeout(() => setSearchLoading(false), 500);
  };

  const openFilterModal = () => {
    if (!isConnected) {
      alert('Please connect your wallet to use filters.');
      return;
    }
    setModalPrice(appliedPrice);
    setFilterModal(true);
  };

  const clearAllFilters = () => {
    setSearch('');
    setAppliedSearch('');
    setAppliedPrice('Any');
    setAppliedSort('recommended');
  };

  const activeFiltersCount = () => (appliedPrice !== 'Any' ? 1 : 0);

  if (hotelsLoading) {
    return (
      <main className="animate-fade-in">
        <div className="py-8">
          <header className="mb-8">
            <h1 className="text-4xl font-bold tracking-tight text-text-primary">Explore Hotels</h1>
            <p className="mt-2 text-lg text-text-secondary">Find the perfect place to stay.</p>
          </header>
          <Loading message="Getting hotels..." />
        </div>
      </main>
    );
  }

  if (hotelsError) {
    return (
      <div className="min-h-screen flex items-center justify-center p-8" style={{ backgroundColor: 'var(--background-primary)' }}>
        <ErrorState
          message={`API Error: ${hotelsError.message}`}
          onRetry={() => window.location.reload()}
        />
      </div>
    );
  }

  if (hotels?.length === 0) {
    return (
      <main className="animate-fade-in">
        <div className="py-8">
          <header className="mb-8">
            <h1 className="text-4xl font-bold tracking-tight text-text-primary">Explore Hotels</h1>
            <p className="mt-2 text-lg text-text-secondary">Find the perfect place to stay.</p>
          </header>
          <div className="text-center py-20">
            <Frown size={48} className="mx-auto mb-4 text-text-tertiary" />
            <h3 className="text-xl font-medium text-text-primary">No hotels available</h3>
            <p className="mt-2 text-text-secondary">There are currently no hotels in our system. Please check back later.</p>
            <Button onClick={() => window.location.reload()} variant="secondary" className="mt-6">
              Refresh Page
            </Button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="animate-fade-in">
      <div className="min-h-screen" style={{ backgroundColor: 'var(--background-primary)' }}>
        <div className="py-8">
          <header className="mb-8">
            <h1 className="text-4xl font-bold tracking-tight text-text-primary">Explore Hotels</h1>
            <p className="mt-2 text-lg text-text-secondary">Find the perfect place to stay.</p>
          </header>

          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <SearchInput
              placeholder="Search by hotel name, address..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              className="w-full"
            />
            <div className="flex gap-2 flex-shrink-0">
              <Button
                onClick={openFilterModal}
                variant="secondary"
                className="w-full md:w-auto h-12 text-base px-5 relative"
              >
                <Filter size={18} className="mr-2" />
                Filter
                {activeFiltersCount() > 0 && (
                  <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs font-medium text-white">
                    {activeFiltersCount()}
                  </span>
                )}
              </Button>
            </div>
          </div>

          <p className="text-sm text-text-secondary">{filteredHotels.length} results</p>

          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2 p-1 rounded-lg bg-surface-secondary">
              <Button
                variant={activeTab === 'list' ? 'primary' : 'ghost'}
                onClick={() => setActiveTab('list')}
                className="px-4 py-2 text-sm"
              >
                List
              </Button>
              <Button
                variant={activeTab === 'map' ? 'primary' : 'ghost'}
                onClick={() => setActiveTab('map')}
                className="px-4 py-2 text-sm"
              >
                Map
              </Button>
            </div>
            <div className="flex items-center gap-2">
              {activeTab === 'list' && (
                <div className="flex items-center gap-1 p-1 rounded-lg bg-surface-secondary">
                  <Button
                    variant={viewMode === 'grid' ? 'primary' : 'ghost'}
                    size="icon"
                    onClick={() => setViewMode('grid')}
                  >
                    <LayoutGrid size={20} />
                  </Button>
                  <Button
                    variant={viewMode === 'list' ? 'primary' : 'ghost'}
                    size="icon"
                    onClick={() => setViewMode('list')}
                  >
                    <List size={18} />
                  </Button>
                </div>
              )}
            </div>
          </div>

          {activeTab === 'list' ? (
            filteredHotels.length > 0 ? (
              <div className={`grid gap-6 ${viewMode === 'grid' ? 'md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
                {filteredHotels.map((hotel) => (
                  <HotelCard key={hotel.id} hotel={hotel} viewMode={viewMode} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <Frown size={48} className="mx-auto mb-4 text-text-tertiary" />
                <h3 className="text-xl font-medium text-text-primary">No hotels found</h3>
                <p className="mt-2 text-text-secondary">Try adjusting your search or filters.</p>
                <Button onClick={clearAllFilters} variant="secondary" className="mt-6">
                  Clear All Filters
                </Button>
              </div>
            )
          ) : (
            <div className="flex flex-col align-items justify-center space-y-4">
              <Map size={48} className="text-text-tertiary mx-auto" />
              <div className="space-y-2 text-center">
                <h3 className="text-lg font-medium">Map View Coming Soon</h3>
                <p className="text-text-secondary text-center max-w-sm mx-auto">
                  We're working on bringing you an interactive map to help you find hotels near your destination.
                </p>
              </div>
            </div>
          )}
        </div>

        <Modal isOpen={filterModal} onClose={() => setFilterModal(false)} title="Filters">
          <div className="space-y-6">
            <div className="space-y-4">
              <h3 className="font-semibold text-text-primary">Price Range</h3>
              <select
                value={modalPrice}
                onChange={(e) => setModalPrice(e.target.value)}
                className="w-full p-2 border rounded-md"
                style={{ backgroundColor: 'var(--surface-primary)', color: 'var(--text-primary)', borderColor: 'var(--border-primary)' }}
              >
                <option value="Any">Any</option>
                <option value="Low">Low (≤ 150 SUI)</option>
                <option value="Medium">Medium (151-350 SUI)</option>
                <option value="High">High (350 SUI)</option>
              </select>
            </div>
            <div className="flex gap-3 pt-6 border-t border-border-primary sticky bottom-0 bg-background-primary py-4">
              <Button variant="secondary" onClick={() => setModalPrice('Any')} className="flex-1">
                Reset
              </Button>
              <Button onClick={handleApplyFilters} className="flex-1" disabled={searchLoading}>
                {searchLoading ? 'Applying...' : `Show ${filteredHotels.length} Results`}
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    </main>
  );
};

export default Hotels;