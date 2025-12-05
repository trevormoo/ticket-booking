"use client"

import { useState } from "react"
import { signOut } from "next-auth/react"
import { Button } from "@/app/components/ui/button"
import { useBookings } from "./hooks/useBookings"
import { useEvents, Event } from "./hooks/useEvents"
import { useStats } from "./hooks/useStats"
import { StatsCards } from "./components/StatsCards"
import { BookingsTable } from "./components/BookingsTable"
import { EventForm } from "./components/EventForm"
import { EventsList } from "./components/EventsList"

export default function AdminClient() {
  const { bookings, loading: bookingsLoading, deleteBooking } = useBookings()
  const { events, loading: eventsLoading, createEvent, updateEvent, deleteEvent } = useEvents()
  const { stats, loading: statsLoading } = useStats()

  const [editing, setEditing] = useState(false)
  const [editData, setEditData] = useState<Event | null>(null)

  const handleEdit = (event: Event) => {
    setEditData({
      ...event,
      date: new Date(event.date).toISOString().split('T')[0],
    })
    setEditing(true)
  }

  const handleUpdateEvent = async (title: string, date: string, capacity?: number) => {
    if (!editData) return false
    const success = await updateEvent(editData.id, title, date, capacity)
    if (success) {
      setEditing(false)
      setEditData(null)
    }
    return success
  }

  return (
    <main className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <Button variant="outline" onClick={() => signOut()}>
          Logout
        </Button>
      </div>

      <StatsCards stats={stats} loading={statsLoading} />

      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-4">All Bookings</h2>
        <BookingsTable
          bookings={bookings}
          onDelete={deleteBooking}
          loading={bookingsLoading}
        />
      </section>

      <section className="mb-12">
        <EventForm
          mode="create"
          onSubmit={createEvent}
        />
      </section>

      {editing && editData && (
        <section className="mb-12">
          <EventForm
            mode="edit"
            initialData={editData}
            onSubmit={handleUpdateEvent}
            onCancel={() => {
              setEditing(false)
              setEditData(null)
            }}
          />
        </section>
      )}

      <section>
        <EventsList
          events={events}
          onEdit={handleEdit}
          onDelete={deleteEvent}
          loading={eventsLoading}
        />
      </section>
    </main>
  )
}
