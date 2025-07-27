"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { Map, AlertCircle, RefreshCcw, Frown, SlidersHorizontal } from "lucide-react"
import { useAuthStore } from "../store/authStore"
import { Button } from "../components/ui/Button"
import { Modal } from "../components/ui/Modal"
import { useHotelStore } from "../store/hotelStore"
import SearchInput from "../components/ui/SearchInput"
import HotelCard from "../components/ui/HotelCard"

const PRICE_OPTIONS = ["Any", "Low", "Medium", "High"]
const AMENITIES = ["Pool", "Free WiFi", "Parking", "Pet-Friendly", "Spa", "Restaurant", "Beach Access"]

const Hotels: React.FC = () => {
  const { hotels, loading: hotelsLoading, error: hotelsError, fetchHotels } = useHotelStore()
  const { user } = useAuthStore()
  const location = useLocation()
  const [activeTab, setActiveTab] = useState<"list" | "map">("list")
  const [filterModal, setFilterModal] = useState(false)
  const [search, setSearch] = useState("")
  const [appliedSearch, setAppliedSearch] = useState("")
  const [appliedPrice, setAppliedPrice] = useState<string>("Any")
  const [appliedAmenities, setAppliedAmenities] = useState<string[]>([])
  const [modalPrice, setModalPrice] = useState<string>("Any")
  const [modalAmenities, setModalAmenities] = useState<string[]>([])
  const [searchLoading, setSearchLoading] = useState(false)

  useEffect(() => {
    fetchHotels()
  }, [fetchHotels])

  // Extract query params for initial filter state
  useEffect(() => {
    const params = new URLSearchParams(location.search)
    const category = params.get("category")
    const deal = params.get("deal")
    const amenity = params.get("amenity")
    if (category) setAppliedSearch(category)
    if (deal) setAppliedSearch(deal)
    if (amenity) setAppliedAmenities([amenity])
  }, [location.search])

  // Filter hotels
  const filteredHotels = hotels.filter((hotel) => {
    const matchesSearch = !appliedSearch || hotel.name.toLowerCase().includes(appliedSearch.toLowerCase())
    let matchesPrice = true
    if (appliedPrice !== "Any") {
      if (appliedPrice === "Low") matchesPrice = hotel.price <= 150
      if (appliedPrice === "Medium") matchesPrice = hotel.price > 150 && hotel.price <= 350
      if (appliedPrice === "High") matchesPrice = hotel.price > 350
    }
    const matchesAmenities = appliedAmenities.length === 0 || appliedAmenities.every((a) => hotel.amenities.includes(a))
    return matchesSearch && matchesPrice && matchesAmenities
  })

  const handleSearch = () => {
    setSearchLoading(true)
    setTimeout(() => {
      setAppliedSearch(search)
      setSearchLoading(false)
    }, 800)
  }

  const handleApplyFilters = () => {
    setSearchLoading(true)
    setTimeout(() => {
      setAppliedPrice(modalPrice)
      setAppliedAmenities(modalAmenities)
      setFilterModal(false)
      setSearchLoading(false)
    }, 800)
  }

  const openFilterModal = () => {
    setModalPrice(appliedPrice)
    setModalAmenities(appliedAmenities)
    setFilterModal(true)
  }

  // Loading state
  if (hotelsLoading && hotels.length === 0) {
    return (
      <div className="container py-6">
        <div className="space-y-6">
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold">Hotels</h1>
            <p className="text-text-secondary">Find your perfect stay</p>
          </div>

          <div className="animate-pulse space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="card p-6">
                <div className="flex gap-4">
                  <div className="w-24 h-24 bg-surface-secondary rounded-lg"></div>
                  <div className="flex-1 space-y-3">
                    <div className="h-5 bg-surface-secondary rounded w-3/4"></div>
                    <div className="h-4 bg-surface-secondary rounded w-1/2"></div>
                    <div className="h-4 bg-surface-secondary rounded w-1/3"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  // Error state
  if (hotelsError) {
    return (
      <div className="container py-6">
        <div className="max-w-md mx-auto text-center space-y-6">
          <AlertCircle size={48} className="text-error mx-auto" />
          <div className="space-y-2">
            <h2 className="text-xl font-bold">Error Loading Hotels</h2>
            <p className="text-text-secondary">{hotelsError}</p>
          </div>
          <Button
            variant="primary"
            onClick={() => window.location.reload()}
            className="flex items-center gap-2 mx-auto"
          >
            <RefreshCcw size={16} />
            Try Again
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container py-6 space-y-6">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold">Hotels</h1>
            <p className="text-text-secondary">Find your perfect stay</p>
          </div>
          {user && (
            <div className="text-xs bg-surface-secondary px-3 py-1.5 rounded-full text-text-secondary font-mono">
              {user.address.slice(0, 6)}...{user.address.slice(-4)}
            </div>
          )}
        </div>

        {/* Search Bar */}
        <div className="flex gap-3">
          <div className="flex-1">
            <SearchInput
              placeholder="Search hotels, locations, or amenities..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            />
          </div>
          <Button onClick={openFilterModal} variant="secondary" className="flex items-center gap-2">
            <SlidersHorizontal size={16} />
            <span className="hidden sm:inline">Filters</span>
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-surface-secondary rounded-lg p-1 w-fit">
        {["list", "map"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab as "list" | "map")}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors capitalize ${
              activeTab === tab
                ? "bg-surface-primary text-text-primary shadow-sm"
                : "text-text-tertiary hover:text-text-secondary"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Loading Bar */}
      {(searchLoading || hotelsLoading) && (
        <div className="space-y-2">
          <div className="h-1 bg-surface-secondary rounded-full overflow-hidden">
            <div className="h-full bg-primary/80 animate-pulse w-1/3"></div>
          </div>
          <p className="text-sm text-text-tertiary text-center">
            {hotelsLoading ? "Loading hotels..." : "Finding your perfect stay..."}
          </p>
        </div>
      )}

      {/* Content */}
      {activeTab === "list" ? (
        <div className="space-y-6">
          {filteredHotels.length === 0 ? (
            <div className="text-center py-12 space-y-4">
              <Frown size={48} className="text-text-tertiary mx-auto" />
              <div className="space-y-2">
                <h3 className="text-lg font-medium">No hotels found</h3>
                <p className="text-text-secondary max-w-md mx-auto">
                  We couldn't find any hotels matching your search. Try adjusting your filters or search terms.
                </p>
              </div>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredHotels.map((hotel) => (
                <HotelCard key={hotel.id} hotel={hotel} />
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-16 space-y-4">
          <Map size={48} className="text-text-tertiary mx-auto" />
          <div className="space-y-2">
            <h3 className="text-lg font-medium">Map View Coming Soon</h3>
            <p className="text-text-secondary max-w-sm mx-auto">
              We're working on bringing you an interactive map to help you find hotels near your destination.
            </p>
          </div>
        </div>
      )}

      {/* Filter Modal */}
      <Modal isOpen={filterModal} title="Filter Hotels" onClose={() => setFilterModal(false)}>
        <div className="space-y-6">
          {/* Price Filter */}
          <div className="space-y-3">
            <h3 className="font-medium">Price Range</h3>
            <div className="grid grid-cols-4 gap-2">
              {PRICE_OPTIONS.map((price) => (
                <button
                  key={price}
                  onClick={() => setModalPrice(price)}
                  className={`py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    modalPrice === price
                      ? "bg-primary text-background-primary"
                      : "bg-surface-secondary text-text-primary hover:bg-surface-tertiary"
                  }`}
                >
                  {price}
                </button>
              ))}
            </div>
          </div>

          {/* Amenities Filter */}
          <div className="space-y-3">
            <h3 className="font-medium">Amenities</h3>
            <div className="grid grid-cols-2 gap-2">
              {AMENITIES.map((amenity) => (
                <button
                  key={amenity}
                  onClick={() =>
                    setModalAmenities(
                      modalAmenities.includes(amenity)
                        ? modalAmenities.filter((a) => a !== amenity)
                        : [...modalAmenities, amenity],
                    )
                  }
                  className={`flex items-center justify-between py-2 px-3 rounded-lg text-sm transition-colors ${
                    modalAmenities.includes(amenity)
                      ? "bg-primary/10 text-primary border border-primary/20"
                      : "bg-surface-secondary text-text-primary hover:bg-surface-tertiary border border-border-primary"
                  }`}
                >
                  <span>{amenity}</span>
                  <div
                    className={`w-4 h-4 rounded-sm border flex items-center justify-center ${
                      modalAmenities.includes(amenity) ? "bg-primary border-primary" : "border-border-primary"
                    }`}
                  >
                    {modalAmenities.includes(amenity) && (
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                        <path
                          d="M20 6L9 17L4 12"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              variant="secondary"
              onClick={() => {
                setModalPrice("Any")
                setModalAmenities([])
              }}
              className="flex-1"
            >
              Reset
            </Button>
            <Button onClick={handleApplyFilters} className="flex-1" disabled={searchLoading}>
              {searchLoading ? "Applying..." : "Show Results"}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default Hotels
