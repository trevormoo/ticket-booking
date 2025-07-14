"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { signOut } from "next-auth/react"
import { Button } from "@/app/components/ui/button"
import { Input } from "@/app/components/ui/input"

// Types

type Booking = {
  id: number
  name: string
  email: string
  eventId: number
  createdAt: string
  checkedIn: boolean
  event: {
    id: number
    title: string
    date: string
  }
}

type Event = {
  id: number
  title: string
  date: string
  capacity?: number

}

export default function AdminClient() {
  const [newCapacity, setNewCapacity] = useState<number>(0)
  
  const [bookings, setBookings] = useState<Booking[]>([])
  const [events, setEvents] = useState<Event[]>([])
  const [editing, setEditing] = useState(false)
  const [editData, setEditData] = useState<Event>({ id: 0, title: '', date: '', capacity: 0 })
  const [newTitle, setNewTitle] = useState('')
  const [newDate, setNewDate] = useState('')
  const router = useRouter()

  useEffect(() => {
    fetch('/api/bookings')
      .then(res => res.json())
      .then(data => setBookings(data))
  }, [])

  useEffect(() => {
    fetch('/api/events')
      .then(res => res.json())
      .then(data => setEvents(data))
  }, [])

  const [stats, setStats] = useState<{
  totalBookings: number
  checkedIn: number
  notCheckedIn: number
  totalEvents: number
  } | null>(null)

  useEffect(() => {
    fetch('/api/stats')
      .then(res => res.json())
      .then(data => setStats(data))
  }, [])

  const handleDelete = async (id: number) => {
    const confirmed = confirm('Are you sure you want to delete this booking?')
    if (!confirmed) return

    const res = await fetch(`/api/bookings/${id}`, { method: 'DELETE' })

    if (res.ok) {
      const updated = await fetch('/api/bookings').then(res => res.json())
      setBookings(updated)
    } else {
      alert('Failed to delete booking.')
    }
  }

  const handleDeleteEvent = async (id: number) => {
    const confirmed = confirm('Are you sure you want to delete this event?')
    if (!confirmed) return

    const res = await fetch(`/api/events/${id}`, { method: 'DELETE' })

    if (res.ok) {
      const updated = await fetch('/api/events').then(res => res.json())
      setEvents(updated)
    } else {
      alert('Failed to delete event.')
    }
  }

  const handleEdit = (event: Event) => {
    setEditData({
      id: event.id,
      title: event.title,
      date: new Date(event.date).toISOString().split('T')[0],
      capacity: event.capacity ?? 0
    })
    setEditing(true)
  }

  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault()
    const res = await fetch('/api/events', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: newTitle, date: newDate, capacity: newCapacity }) // ✅ include it
    })

    if (res.ok) {
      const newEvent = await res.json()
      setEvents(prev => [newEvent, ...prev])
      setNewTitle('')
      setNewDate('')
    } else {
      alert('Failed to create event')
    }
  }

  const handleUpdateEvent = async (e: React.FormEvent) => {
    e.preventDefault()
    const res = await fetch(`/api/events/${editData.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: editData.title, date: editData.date, capacity: editData.capacity})
    })

    if (res.ok) {
      const updated = await res.json()
      setEvents(prev => prev.map(ev => (ev.id === updated.id ? updated : ev)))
      setEditData({ id: 0, title: '', date: '' })
      setEditing(false)
    } else {
      alert('Failed to update event')
    }
  }

  return (
    <main className="p-6 max-w-3xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">All Bookings</h1>
        <Button variant="outline" onClick={() => signOut()}>
          Logout
        </Button>
      </div>


      {stats && (
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-white rounded-xl shadow p-4">
            <h3 className="text-sm font-semibold text-gray-500">📋 Total Bookings</h3>
            <p className="text-2xl font-bold">{stats.totalBookings}</p>
          </div>
          <div className="bg-white rounded-xl shadow p-4">
            <h3 className="text-sm font-semibold text-gray-500">✅ Checked In</h3>
            <p className="text-2xl font-bold">{stats.checkedIn}</p>
          </div>
          <div className="bg-white rounded-xl shadow p-4">
            <h3 className="text-sm font-semibold text-gray-500">❌ Not Checked In</h3>
            <p className="text-2xl font-bold">{stats.notCheckedIn}</p>
          </div>
          <div className="bg-white rounded-xl shadow p-4">
            <h3 className="text-sm font-semibold text-gray-500">📆 Total Events</h3>
            <p className="text-2xl font-bold">{stats.totalEvents}</p>
          </div>
        </div>
      )}

      {bookings.length === 0 ? (
        <p>No bookings found.</p>
      ) : (
        <ul className="space-y-3">
          {bookings.map(b => (
            <li key={b.id} className="border p-3 rounded space-y-1">
              <p><strong>{b.name}</strong> ({b.email})</p>
              <p>Event: <strong>{b.event.title}</strong></p>
              <p>Date: {new Date(b.event.date).toLocaleDateString()}</p>
              <p>Booked at: {new Date(b.createdAt).toLocaleString()}</p>
              <p><strong>Booking ID:</strong> {b.id}</p>
              <p><strong>Checked In:</strong> {b.checkedIn ? '✅ Yes' : '❌ No'}</p>
              <Button variant="destructive" onClick={() => handleDelete(b.id)}>
                Delete
              </Button>
            </li>
          ))}
        </ul>
      )}

      <h2 className="text-xl font-bold mt-8 mb-2">Create New Event</h2>
      <form onSubmit={handleCreateEvent} className="space-y-2 mb-6">
        <Input
          name="title"
          placeholder="Event title"
          value={newTitle}
          onChange={e => setNewTitle(e.target.value)}
          required
        />
        <Input
          name="date"
          type="date"
          value={newDate}
          onChange={e => setNewDate(e.target.value)}
          required
        />
          <Input
            name="capacity"
            type="number"
            placeholder="Max attendees"
            value={newCapacity}
            onChange={e => setNewCapacity(Number(e.target.value))}
            required
        />
        
        <Button type="submit">
          Create Event
        </Button>
      </form>

      {editing && (
        <form onSubmit={handleUpdateEvent} className="space-y-2 mb-6 mt-6">
          <h2 className="text-xl font-bold">Edit Event</h2>
          <Input
            name="title"
            value={editData.title}
            onChange={e => setEditData({ ...editData, title: e.target.value })}
            required
          />
          <Input
            name="date"
            type="date"
            value={editData.date}
            onChange={e => setEditData({ ...editData, date: e.target.value })}
            required
          />
          <Input
            name="capacity"
            type="number"
            value={editData.capacity}
            onChange={e => setEditData({ ...editData, capacity: Number(e.target.value) })}
            placeholder="Max attendees"
            required
          />
          <Button type="submit" variant="secondary">
            Save Changes
          </Button>
        </form>
      )}

      <h2 className="text-xl font-bold mt-8 mb-4">All Events</h2>
      <ul className="space-y-2">
        {events.map(e => (
          <li key={e.id} className="border p-2 rounded flex justify-between items-center">
            <span>
              {e.title} – {new Date(e.date).toLocaleDateString()} 
              {typeof e.capacity === 'number' && ` | Capacity: ${e.capacity}`}
            </span>
            <div className="space-x-2">
              <Button variant="outline" onClick={() => handleEdit(e)}>
                Edit
              </Button>
              <Button variant="destructive" onClick={() => handleDeleteEvent(e.id)}>
                Delete
              </Button>
            </div>
          </li>
        ))}
      </ul>
    </main>
  )
}