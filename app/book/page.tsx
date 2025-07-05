'use client'

import { useState, useEffect } from 'react'

export default function Book() {
  const [form, setForm] = useState({ name: '', email: '', eventId: '' })
  const [events, setEvents] = useState<any[]>([])
  const [message, setMessage] = useState('')

  // Fetch all events for the dropdown
  useEffect(() => {
    fetch('/api/events') // We'll create this endpoint next
      .then(res => res.json())
      .then(data => setEvents(data))
  }, [])

  const handleSubmit = async (e: any) => {
    e.preventDefault()
    const res = await fetch('/api/bookings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })

    if (res.ok) {
      setMessage('🎉 Booking successful!')
      setForm({ name: '', email: '', eventId: '' })
    } else {
      const err = await res.json()
      setMessage(`❌ Error: ${err.error || 'Unknown'}`)
    }
  }

  return (
    <main className="p-6 max-w-md mx-auto space-y-4">
      <h1 className="text-2xl font-bold">Book an Event</h1>

      {message && <p className="text-sm">{message}</p>}

      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          placeholder="Your Name"
          className="w-full border p-2"
          value={form.name}
          onChange={e => setForm({ ...form, name: e.target.value })}
          required
        />
        <input
          placeholder="Your Email"
          className="w-full border p-2"
          value={form.email}
          onChange={e => setForm({ ...form, email: e.target.value })}
          required
        />
        <select
          className="w-full border p-2"
          value={form.eventId}
          onChange={e => setForm({ ...form, eventId: e.target.value })}
          required
        >
          <option value="">-- Select Event --</option>
          {events.map(event => (
            <option key={event.id} value={event.id}>
              {event.title} — {new Date(event.date).toDateString()}
            </option>
          ))}
        </select>
        <button className="bg-blue-600 text-white px-4 py-2 rounded">
          Book Ticket
        </button>
      </form>
    </main>
  )
}