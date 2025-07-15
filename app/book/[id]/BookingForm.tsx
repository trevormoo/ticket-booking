'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Input } from '@/app/components/ui/input'
import { Button } from '@/app/components/ui/button'
import { toast } from 'sonner'

export default function BookingForm({ eventId }: { eventId: number }) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault()
  setLoading(true)

  const res = await fetch('/api/bookings', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, eventId })
  })

  const result = await res.json()
  setLoading(false)

  if (res.status === 409) {
    toast.error('❌ You already booked this event.')
    return
  }

  if (res.ok) {
    toast.success('🎉 Booking successful! Confirmation sent to your email.')
    router.push(`/tickets/${result.id}`)
  } else {
    toast.error(result.error || 'Something went wrong.')
  }
}

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        placeholder="Your name"
        value={name}
        onChange={e => setName(e.target.value)}
        required
      />
      <Input
        type="email"
        placeholder="you@example.com"
        value={email}
        onChange={e => setEmail(e.target.value)}
        required
      />
      <Button type="submit" disabled={loading}>
        {loading ? 'Booking...' : 'Confirm Booking'}
      </Button>
    </form>
  )
}