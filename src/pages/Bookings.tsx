"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Calendar, Users, Clock } from "lucide-react"
import { useBookingStore } from "../store/bookingStore"
import { Button } from "../components/ui/Button"
import { Card } from "../components/ui/Card"
import type { Booking } from "../types"

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
      <div className="text-center py-16 space-y-6">
        <div className="w-24 h-24 bg-surface-secondary rounded-full flex items-center justify-center mx-auto">
          <Calendar size={32} className="text-text-tertiary" />
        </div>
        <div className="space-y-2">
          <h3 className="text-xl font-semibold">{config.title}</h3>
          <p className="text-text-secondary max-w-md mx-auto">{config.description}</p>
        </div>
        <Button onClick={() => navigate("/hotels")}>Explore Hotels</Button>
      </div>
    )
  }

  const BookingCard = ({ booking }: { booking: Booking }) => (
    <Card className="p-0 overflow-hidden">
      <div
        onClick={() => handleClickBooking(booking.id)}
        className="flex cursor-pointer transition hover:shadow-md focus:outline-none focus:ring-2 focus:ring-primary rounded"
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") handleClickBooking(booking.id)
        }}
      >
        <div className="w-32 h-32 flex-shrink-0">
          <img
            src={booking.hotelImage || "/placeholder.svg?height=128&width=128&query=hotel room"}
            alt={booking.hotelName}
            className="w-full h-full object-cover"
          />
        </div>
  
        <div className="flex-1 p-4 space-y-3">
          <div className="flex justify-between items-start">
            <h3 className="font-semibold text-text-primary">{booking.hotelName}</h3>
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium ${
                booking.status === "confirmed"
                  ? "bg-success/10 text-success"
                  : "bg-warning/10 text-warning"
              }`}
            >
              {booking.status}
            </span>
          </div>
  
          <div className="space-y-2 text-sm text-text-secondary">
            <div className="flex items-center gap-2">
              <Calendar size={14} />
              <span>{booking.checkIn} - {booking.checkOut}</span>
            </div>
            <div className="flex items-center gap-2">
              <Users size={14} />
              <span>{booking.guests} guests • {booking.nights} nights</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock size={14} />
              <span>{booking.roomType}</span>
            </div>
          </div>
  
          <div className="flex justify-between items-center pt-2 border-t border-border-primary">
            <span className="text-sm text-text-tertiary">Total</span>
            <span className="font-semibold text-text-primary">{booking.totalPrice} SUI</span>
          </div>
        </div>
      </div>
    </Card>
  )


  if (loading && bookings.length === 0) {
    return (
      <div className="container py-6">
        <div className="space-y-6">
          <h1 className="text-3xl font-bold">My Bookings</h1>
          <div className="animate-pulse space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="card p-4">
                <div className="flex gap-4">
                  <div className="w-32 h-32 bg-surface-secondary rounded"></div>
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

  return (
    <div className="container py-6 space-y-6">
      <h1 className="text-3xl font-bold">My Bookings</h1>

      {/* Tabs */}
      <div className="flex gap-1 bg-surface-secondary rounded-lg p-1 w-fit">
        {(["upcoming", "past", "saved"] as TabType[]).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
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

      {/* Content */}
      {filteredBookings.length === 0 ? (
        <EmptyState tab={activeTab} />
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          {filteredBookings.map((booking) => (
            <BookingCard key={booking.id} booking={booking} />
          ))}
        </div>
      )}
    </div>
  )
}

export default Bookings
