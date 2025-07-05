'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { signOut } from 'next-auth/react'

export default function AdminClient() {
  const [bookings, setBookings] = useState<any[]>([])
  const [events, setEvents] = useState<any[]>([])
  const [editing, setEditing] = useState(false)
  const [editData, setEditData] = useState({ id: 0, title: '', date: '' })
  const [newTitle, setNewTitle] = useState('')
  const [newDate, setNewDate] = useState('')
  const router = useRouter()

  // Fetch bookings
  useEffect(() => {
    fetch('/api/bookings')
      .then(res => res.json())
      .then(data => setBookings(data))
  }, [])

  // Fetch events
  useEffect(() => {
    fetch('/api/events')
      .then(res => res.json())
      .then(data => setEvents(data))
  }, [])

  // Delete booking
  const handleDelete = async (id: number) => {
    const confirmed = confirm('Are you sure you want to delete this booking?')
    if (!confirmed) return

    const res = await fetch(`/api/bookings/${id}`, { method: 'DELETE' })

    if (res.ok) {
      setBookings(prev => prev.filter(b => b.id !== id))
    } else {
      alert('Failed to delete booking.')
    }
  }

  // Delete event
  const handleDeleteEvent = async (id: number) => {
    const confirmed = confirm('Are you sure you want to delete this event?')
    if (!confirmed) return

    const res = await fetch(`/api/events/${id}`, { method: 'DELETE' })

    if (res.ok) {
      setEvents(prev => prev.filter(e => e.id !== id))
    } else {
      alert('Failed to delete event.')
    }
  }

  // Edit event
  const handleEdit = (event: any) => {
    setEditData({
      id: event.id,
      title: event.title,
      date: new Date(event.date).toISOString().split('T')[0],
    })
    setEditing(true)
  }

  // Submit new event
  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault()
    const res = await fetch('/api/events', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: newTitle, date: newDate }),
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

  // Submit edited event
  const handleUpdateEvent = async (e: React.FormEvent) => {
    e.preventDefault()
    const res = await fetch(`/api/events/${editData.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: editData.title, date: editData.date }),
    })

    if (res.ok) {
      const updated = await res.json()
      setEvents(prev =>
        prev.map(ev => (ev.id === updated.id ? updated : ev))
      )
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
        <button
          onClick={() => signOut()}
          className="text-sm text-blue-600 underline"
        >
          Logout
        </button>
      </div>

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
              <button
                onClick={() => handleDelete(b.id)}
                className="text-red-600 border border-red-600 px-2 py-1 rounded text-sm hover:bg-red-600 hover:text-white"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}

      {/* CREATE EVENT FORM */}
      <h2 className="text-xl font-bold mt-8 mb-2">Create New Event</h2>
      <form onSubmit={handleCreateEvent} className="space-y-2 mb-6">
        <input
          name="title"
          placeholder="Event title"
          value={newTitle}
          onChange={e => setNewTitle(e.target.value)}
          required
          className="w-full border p-2 rounded"
        />
        <input
          name="date"
          type="date"
          value={newDate}
          onChange={e => setNewDate(e.target.value)}
          required
          className="w-full border p-2 rounded"
        />
        <button
          type="submit"
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Create Event
        </button>
      </form>

      {/* EDIT EVENT FORM */}
      {editing && (
        <form onSubmit={handleUpdateEvent} className="space-y-2 mb-6 mt-6">
          <h2 className="text-xl font-bold">Edit Event</h2>
          <input
            name="title"
            value={editData.title}
            onChange={e => setEditData({ ...editData, title: e.target.value })}
            required
            className="w-full border p-2 rounded"
          />
          <input
            name="date"
            type="date"
            value={editData.date}
            onChange={e => setEditData({ ...editData, date: e.target.value })}
            required
            className="w-full border p-2 rounded"
          />
          <button
            type="submit"
            className="bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700"
          >
            Save Changes
          </button>
        </form>
      )}

      {/* EVENTS LIST */}
      <h2 className="text-xl font-bold mt-8 mb-4">All Events</h2>
      <ul className="space-y-2">
        {events.map(e => (
          <li key={e.id} className="border p-2 rounded flex justify-between items-center">
            <span>{e.title} – {new Date(e.date).toLocaleDateString()}</span>
            <div className="space-x-2">
              <button
                onClick={() => handleEdit(e)}
                className="text-blue-600 border border-blue-600 px-2 py-1 rounded text-sm hover:bg-blue-600 hover:text-white"
              >
                Edit
              </button>
              <button
                onClick={() => handleDeleteEvent(e.id)}
                className="text-red-600 border border-red-600 px-2 py-1 rounded text-sm hover:bg-red-600 hover:text-white"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </main>
  )
}