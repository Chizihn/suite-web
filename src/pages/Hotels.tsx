import type React from "react"
import { useState, useEffect } from "react"
import { useLocation } from "react-router-dom"
import { 
  Frown, 
  Filter,
  LayoutGrid,
  List,
  ChevronDown,
  Map
} from "lucide-react"
import { useWallet } from "../contexts/WalletContext";
import { Button } from "../components/ui/Button"
import { Modal } from "../components/ui/Modal"
import { useHotelStore } from "../store/hotelStore"
import { useHotels } from "../hooks/useHotels"
import SearchInput from "../components/ui/SearchInput"
import HotelCard from "../components/ui/HotelCard"
import ErrorState from "../components/ErrorState"
import Loading from "../components/Loading"

// const PRICE_OPTIONS = [
//   { value: "Any", label: "Any Price", range: "" },
//   { value: "Low", label: "Budget", range: "Under 150 $SUI" },
//   { value: "Medium", label: "Mid-range", range: "150-350 $SUI" },
//   { value: "High", label: "Luxury", range: "350+ $SUI" }
// ]

// const AMENITIES = [
//   "Pool", "Free WiFi", "Parking", "Pet-Friendly", 
//   "Spa", "Restaurant", "Beach Access", "Gym", 
//   "Room Service", "Airport Shuttle", "Business Center", "Laundry"
// ]

const SORT_OPTIONS = [
  { value: "recommended", label: "Recommended" },
  { value: "price-low", label: "Price: Low to High" },
  { value: "price-high", label: "Price: High to Low" },
  { value: "rating", label: "Highest Rated" },
  { value: "newest", label: "Newest" }
]

const Hotels: React.FC = () => {
  // Use TanStack Query hook instead of store method
  const { 
    data: apiHotels, 
    isLoading: hotelsLoading, 
    error: hotelsError, 
    rawData 
  } = useHotels();
  
  // Still use store for UI state management
  const { 
    hotels: storeHotels, 
    setHotels, 
    setLoading, 
    setError 
  } = useHotelStore();
  
  const { isConnected } = useWallet();
  const location = useLocation();
  
  const [activeTab, setActiveTab] = useState<"list" | "map">("list")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [filterModal, setFilterModal] = useState<boolean>(false)
  const [search, setSearch] = useState("")
  const [appliedSearch, setAppliedSearch] = useState("")
  const [appliedPrice, setAppliedPrice] = useState<string>("Any")
  const [appliedAmenities, setAppliedAmenities] = useState<string[]>([])
  const [appliedSort, setAppliedSort] = useState<string>("recommended")
  const [modalPrice, setModalPrice] = useState<string>("Any")
  const [modalAmenities, setModalAmenities] = useState<string[]>([])
  const [searchLoading, setSearchLoading] = useState<boolean>(false)
  const [showSortDropdown, setShowSortDropdown] = useState<boolean>(false)
  const [hasInitiallyLoaded, setHasInitiallyLoaded] = useState<boolean>(false)

  // Sync API data with store
  useEffect(() => {
    console.log('🔄 [COMPONENT] useEffect: Syncing API data with store');
    console.log('📊 [COMPONENT] API data:', apiHotels?.length, 'hotels');
    console.log('📊 [COMPONENT] Raw API data:', rawData);
    console.log('📊 [COMPONENT] Loading state:', hotelsLoading);
    console.log('📊 [COMPONENT] Error state:', hotelsError?.message);
    
    if (apiHotels !== undefined) {
      console.log('✅ [COMPONENT] Setting hotels in store from API');
      setHotels(apiHotels);
      setHasInitiallyLoaded(true);
    }
    
    if (hotelsError) {
      console.error('❌ [COMPONENT] Setting error in store from API');
      setError(hotelsError.message);
      setHasInitiallyLoaded(true);
    }
    
    setLoading(hotelsLoading);
  }, [apiHotels, hotelsLoading, hotelsError, setHotels, setLoading, setError]);

  useEffect(() => {
    const params = new URLSearchParams(location.search)
    const category = params.get("category")
    const deal = params.get("deal")
    const amenity = params.get("amenity")
    if (category) setAppliedSearch(category)
    if (deal) setAppliedSearch(deal)
    if (amenity) setAppliedAmenities([amenity])
  }, [location.search])

  // Use the hotels from store (which are synced from API)
  const hotels = storeHotels;

  const getFilteredAndSortedHotels = () => {
    console.log('🔍 [COMPONENT] Filtering hotels:', hotels.length, 'total hotels');
    
    let filtered = hotels.filter((hotel) => {
      const matchesSearch = !appliedSearch || 
        hotel.name.toLowerCase().includes(appliedSearch.toLowerCase()) ||
        hotel.location?.toLowerCase().includes(appliedSearch.toLowerCase())
      
      let matchesPrice = true
      if (appliedPrice !== "Any") {
        if (appliedPrice === "Low") matchesPrice = hotel.price <= 150
        if (appliedPrice === "Medium") matchesPrice = hotel.price > 150 && hotel.price <= 350
        if (appliedPrice === "High") matchesPrice = hotel.price > 350
      }
      
      const matchesAmenities = appliedAmenities.length === 0 || 
        appliedAmenities.every((a) => hotel.amenities?.includes(a))
      
      return matchesSearch && matchesPrice && matchesAmenities
    })

    switch (appliedSort) {
      case "price-low":
        filtered.sort((a, b) => a.price - b.price)
        break
      case "price-high":
        filtered.sort((a, b) => b.price - a.price)
        break
      case "rating":
        filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0))
        break
      default:
        break
    }
    
    console.log('🔍 [COMPONENT] Filtered hotels:', filtered.length, 'hotels');
    return filtered
  }

  const filteredHotels = getFilteredAndSortedHotels()

  const handleSearch = () => {
    setSearchLoading(true)
    setAppliedSearch(search)
    setTimeout(() => setSearchLoading(false), 500)
  }

  const handleApplyFilters = () => {
    setSearchLoading(true)
    setAppliedPrice(modalPrice)
    setAppliedAmenities(modalAmenities)
    setFilterModal(false)
    setTimeout(() => setSearchLoading(false), 500)
  }

  const openFilterModal = () => {
    setModalPrice(appliedPrice)
    setModalAmenities(appliedAmenities)
    setFilterModal(true)
  }

  const clearAllFilters = () => {
    setSearch("")
    setAppliedSearch("")
    setAppliedPrice("Any")
    setAppliedAmenities([])
    setAppliedSort("recommended")
  }

  const activeFiltersCount = () => {
    let count = 0
    if (appliedPrice !== "Any") count++
    if (appliedAmenities.length > 0) count ++
    return count
  }

  // Show loading state only when initially loading and haven't loaded yet
  if (hotelsLoading && !hasInitiallyLoaded) {
    console.log('⏳ [COMPONENT] Showing initial loading state');
    return (
      <main className="animate-fade-in">
        <div className=" py-8">
          <header className="mb-8">
            <h1 className="text-4xl font-bold tracking-tight text-text-primary">Explore Hotels</h1>
            <p className="mt-2 text-lg text-text-secondary">Find the perfect place to stay.</p>
          </header>

          <Loading message="Getting hotels from API..." />
        </div>
      </main>
    )
  }

  // Show error state
  if (hotelsError) {
    return (
      <div className="min-h-screen flex items-center justify-center p-8" style={{ backgroundColor: 'var(--background-primary)' }}>
        <ErrorState 
          message={`API Error: ${hotelsError.message}`} 
          onRetry={() => window.location.reload()} 
        />
      </div>
    )
  }

  // Show "no hotels available" state when API has loaded but returned 0 hotels
  if (hasInitiallyLoaded && hotels.length === 0) {
    console.log('🏨 [COMPONENT] Showing no hotels available state');
    return (
      <main className="animate-fade-in">
        <div className=" py-8">
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
    )
  }

  return (
    <main className="animate-fade-in">
      <div className="min-h-screen" style={{ backgroundColor: 'var(--background-primary)' }}>
        <div className=" py-8">
          <header className="mb-8">
            <h1 className="text-4xl font-bold tracking-tight text-text-primary">Explore Hotels</h1>
            <p className="mt-2 text-lg text-text-secondary">Find the perfect place to stay.</p>
          </header>

          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <SearchInput
              placeholder="Search by hotel name, location..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              className="w-full"
            />
            <div className="flex gap-2 flex-shrink-0">
              <Button 
                onClick={() => isConnected ? openFilterModal() : alert("Please connect your wallet to use filters.")}
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
              <div className="relative">
                <Button 
                  onClick={() => setShowSortDropdown(!showSortDropdown)}
                  variant="secondary"
                  className="w-full md:w-auto h-12 text-base px-5"
                >
                  <span className="mr-2">Sort by: {SORT_OPTIONS.find(o => o.value === appliedSort)?.label}</span>
                  <ChevronDown size={18} />
                </Button>
                {showSortDropdown && (
                  <div className="absolute top-full right-0 mt-2 w-56 rounded-lg shadow-lg z-10 bg-surface-secondary p-1">
                    {SORT_OPTIONS.map(option => (
                      <a
                        key={option.value}
                        href="#"
                        onClick={(e) => {
                          e.preventDefault()
                          setAppliedSort(option.value)
                          setShowSortDropdown(false)
                        }}
                        className={`block px-3 py-2 text-sm rounded-md ${appliedSort === option.value ? 'font-medium bg-surface-primary text-primary' : 'text-text-primary hover:bg-surface-primary'}`}
                      >
                        {option.label}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          <p className="text-sm text-text-secondary">{filteredHotels.length} results</p>

          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2 p-1 rounded-lg bg-surface-secondary">
              <Button variant={activeTab === 'list' ? 'primary' : 'ghost'} onClick={() => setActiveTab('list')} className="px-4 py-2 text-sm">List</Button>
              <Button variant={activeTab === 'map' ? 'primary' : 'ghost'} onClick={() => setActiveTab('map')} className="px-4 py-2 text-sm">Map</Button>
            </div>
            <div className="flex items-center gap-2">
              {activeTab === 'list' && (
                <div className="flex items-center gap-1 p-1 rounded-lg bg-surface-secondary">
                  <Button variant={viewMode === 'grid' ? 'primary' : 'ghost'} size="icon" onClick={() => setViewMode('grid')}><LayoutGrid size={20} /></Button>
                  <Button variant={viewMode === 'list' ? 'primary' : 'ghost'} size="icon" onClick={() => setViewMode('list')}><List size={18}/></Button>
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
                <Button onClick={clearAllFilters} variant="secondary" className="mt-6">Clear All Filters</Button>
              </div>
            )
          ) : (
             <div className="flex flex-col align-itemx justify-center space-y-4">
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
        
            </div>

            <div className="flex gap-3 pt-6 border-t border-border-primary sticky bottom-0 bg-background-primary py-4">
              <Button variant="secondary" onClick={() => { setModalPrice("Any"); setModalAmenities([]) }} className="flex-1">Reset</Button>
              <Button onClick={handleApplyFilters} className="flex-1" disabled={searchLoading}>
                {searchLoading ? "Applying..." : `Show ${filteredHotels.length} Results`}
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    </main>
  )
}

export default Hotels