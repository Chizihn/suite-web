import type React from "react"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Calendar,  } from "lucide-react"
import { useBookingStore } from "../store/bookingStore"
import { Button } from "../components/ui/Button"
import type { Booking } from "../types"
import BookingCard from "../components/ui/BookingCard"
import Loading from "../components/Loading"

type TabType = "upcoming" | "past" | "saved"

const Bookings: React.FC = () => {
  const { bookings, savedBookings, fetchBookings, loading } = useBookingStore()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<TabType>("upcoming")

  useEffect(() => {
    fetchBookings()
  }, [fetchBookings])

  const handleClickBooking = (id: string) => {
    navigate(`/bookings/${id}`)
  }

  const getFilteredBookings = (): Booking[] => {
    switch (activeTab) {
      case "upcoming":
      case "past":
        return bookings
      case "saved":
        return savedBookings || []
      default:
        return bookings
    }
  }

  const filteredBookings = getFilteredBookings()

  const EmptyState = ({ tab }: { tab: TabType }) => {
    const configs = {
      upcoming: {
        title: "No upcoming bookings",
        description: "You don't have any upcoming bookings. Start exploring hotels and make your first booking!",
      },
      past: {
        title: "No past bookings",
        description: "Your booking history will appear here once you complete your first stay.",
      },
      saved: {
        title: "No saved bookings",
        description: "Save your favorite bookings to view them here later.",
      },
    }

    const config = configs[tab]

    return (
      <div className="flex flex-col items-center justify-center py-16 px-4 text-center space-y-2 min-h-[200px]">
        <div className="w-20 h-20 md:w-24 md:h-24 bg-surface-secondary rounded-full flex items-center justify-center">
          <Calendar size={28} className="text-text-tertiary md:w-8 md:h-8" />
        </div>
        <div className="space-y-3 max-w-md">
          <h3 className="text-lg md:text-xl font-semibold text-text-primary">{config.title}</h3>
          <p className="text-sm md:text-base text-text-secondary leading-relaxed">{config.description}</p>
        </div>
        <Button onClick={() => navigate("/hotels")} className="mt-4">
          Explore Hotels
        </Button>
      </div>
    )
  }



  if (loading && bookings.length === 0) {
    return (
      <main className="animate-fade-in">
         <div className=" py-6 space-y-6">
      <h1 className="text-2xl md:text-3xl font-bold">My Bookings</h1>
<Loading message="Getting your bookings " />


     </div>
      </main>
     
    )
  }

  return (
    <main className="animate-fade-in">
     <div className=" py-6 space-y-6">
      <h1 className="text-2xl md:text-3xl font-bold">My Bookings</h1>

      {/* Header with Tabs and View Toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        {/* Tabs */}
        <div className="flex items-center gap-2 p-1 rounded-lg bg-surface-secondary w-fit">
          {(["upcoming", "past", "saved"] as TabType[]).map((tab) => (
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

        {/* Results count and view toggle */}
        <div className="flex items-center  sm:justify-end gap-4">
          <p className="text-sm text-text-secondary">
            {filteredBookings.length} {filteredBookings.length === 1 ? 'booking' : 'bookings'}
          </p>
          
          {/* {filteredBookings.length > 0 && (
            <div className="flex items-center gap-1 p-1 rounded-lg bg-surface-secondary">
              <Button
                variant={viewMode === 'grid' ? 'primary' : 'ghost'}
                size="icon"
                onClick={() => setViewMode('grid')}
                className="w-8 h-8"
              >
                <LayoutGrid size={16} />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'primary' : 'ghost'}
                size="icon"
                onClick={() => setViewMode('list')}
                className="w-8 h-8"
              >
                <List size={16} />
              </Button>
            </div>
          )} */}
        </div>
      </div>

      {/* Content */}
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
  )
}

export default Bookings