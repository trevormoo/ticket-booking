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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const res = await fetch('/api/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, eventId }),
    })

    setLoading(false)

    if (!res.ok) {
      const result = await res.json()
      toast.error(result.error || 'Failed to start payment')
      return
    }

    const result = await res.json()
    if (result.url) {
      window.location.href = result.url // redirect to Stripe Checkout
    } else {
      toast.error('Stripe session failed')
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
        {loading ? 'Redirecting to payment...' : 'Confirm & Pay'}
      </Button>
    </form>
  )
}