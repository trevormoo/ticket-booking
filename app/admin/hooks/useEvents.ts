import { useState, useEffect } from 'react'

export type Event = {
  id: number
  title: string
  date: string
  capacity?: number
}

export function useEvents() {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchEvents = async () => {
    try {
      setLoading(true)
      const res = await fetch('/api/events')
      if (!res.ok) throw new Error('Failed to fetch events')
      const data = await res.json()
      setEvents(data)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchEvents()
  }, [])

  const createEvent = async (title: string, date: string, capacity?: number) => {
    try {
      const res = await fetch('/api/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, date, capacity }),
      })
      if (!res.ok) throw new Error('Failed to create event')
      const newEvent = await res.json()
      setEvents(prev => [newEvent, ...prev])
      return true
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create')
      return false
    }
  }

  const updateEvent = async (id: number, title: string, date: string, capacity?: number) => {
    try {
      const res = await fetch(`/api/events/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, date, capacity }),
      })
      if (!res.ok) throw new Error('Failed to update event')
      const updated = await res.json()
      setEvents(prev => prev.map(ev => (ev.id === updated.id ? updated : ev)))
      return true
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update')
      return false
    }
  }

  const deleteEvent = async (id: number) => {
    try {
      const res = await fetch(`/api/events/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Failed to delete event')
      await fetchEvents()
      return true
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete')
      return false
    }
  }

  return {
    events,
    loading,
    error,
    createEvent,
    updateEvent,
    deleteEvent,
    refetch: fetchEvents,
  }
}
