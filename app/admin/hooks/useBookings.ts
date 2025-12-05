import { useState, useEffect } from 'react'

export type Booking = {
  id: number
  name: string
  email: string
  eventId: number
  createdAt: string
  checkedIn: boolean
  paid: boolean
  event: {
    id: number
    title: string
    date: string
  }
}

export function useBookings() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchBookings = async () => {
    try {
      setLoading(true)
      const res = await fetch('/api/bookings')
      if (!res.ok) throw new Error('Failed to fetch bookings')
      const data = await res.json()
      setBookings(data)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchBookings()
  }, [])

  const deleteBooking = async (id: number) => {
    try {
      const res = await fetch(`/api/bookings/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Failed to delete booking')
      await fetchBookings()
      return true
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete')
      return false
    }
  }

  return {
    bookings,
    loading,
    error,
    refetch: fetchBookings,
    deleteBooking,
  }
}
