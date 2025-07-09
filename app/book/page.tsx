'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { useRouter } from 'next/navigation'

export default function BookingForm() {
  const router = useRouter()
  const [form, setForm] = useState({ name: '', email: '', eventId: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess(false)

    const res = await fetch('/api/bookings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    })

    setLoading(false)

    if (!res.ok) {
      const err = await res.json()
      setError(err?.error || 'Something went wrong')
      return
    }

    setSuccess(true)
    setForm({ name: '', email: '', eventId: '' })

    // optional: redirect to success page
    // router.push('/success')
  }

  return (
    <Card className="max-w-md mx-auto mt-10">
      <CardHeader className="text-xl font-bold">Book Your Ticket</CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Name</Label>
            <Input name="name" value={form.name} onChange={handleChange} required />
          </div>

          <div>
            <Label htmlFor="email">Email</Label>
            <Input name="email" type="email" value={form.email} onChange={handleChange} required />
          </div>

          <div>
            <Label htmlFor="eventId">Event ID</Label>
            <Input name="eventId" value={form.eventId} onChange={handleChange} required />
          </div>

          <Button type="submit" disabled={loading}>
            {loading ? 'Booking...' : 'Book Ticket'}
          </Button>

          {error && <p className="text-red-600 text-sm">{error}</p>}
          {success && <p className="text-green-600 text-sm">✅ Booking successful!</p>}
        </form>
      </CardContent>
    </Card>
  )
}