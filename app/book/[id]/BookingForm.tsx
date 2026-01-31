'use client'

import { useState } from 'react'
import { Input } from '@/app/components/ui/input'
import { Button } from '@/app/components/ui/button'
import { Label } from '@/app/components/ui/label'
import { toast } from 'sonner'
import { User, Mail, CreditCard, Loader2, ArrowRight, Lock } from 'lucide-react'

interface BookingFormProps {
  eventId: number
  eventTitle: string
}

export default function BookingForm({ eventId, eventTitle }: BookingFormProps) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<{ name?: string; email?: string }>({})

  const validateForm = () => {
    const newErrors: { name?: string; email?: string } = {}

    if (!name.trim()) {
      newErrors.name = 'Name is required'
    } else if (name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters'
    }

    if (!email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Please enter a valid email address'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setLoading(true)

    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim(), email: email.trim(), eventId }),
      })

      if (!res.ok) {
        const result = await res.json()
        toast.error(result.error || 'Failed to start payment')
        setLoading(false)
        return
      }

      const result = await res.json()
      if (result.url) {
        toast.success('Redirecting to payment...')
        window.location.href = result.url
      } else {
        toast.error('Stripe session failed')
        setLoading(false)
      }
    } catch {
      toast.error('Something went wrong. Please try again.')
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Name Field */}
      <div className="space-y-2">
        <Label htmlFor="name" className="text-sm font-medium">
          Full Name
        </Label>
        <div className="relative">
          <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            id="name"
            placeholder="John Doe"
            value={name}
            onChange={(e) => {
              setName(e.target.value)
              if (errors.name) setErrors({ ...errors, name: undefined })
            }}
            className={`pl-10 h-12 ${errors.name ? 'border-destructive focus-visible:ring-destructive' : ''}`}
            disabled={loading}
          />
        </div>
        {errors.name && (
          <p className="text-sm text-destructive">{errors.name}</p>
        )}
      </div>

      {/* Email Field */}
      <div className="space-y-2">
        <Label htmlFor="email" className="text-sm font-medium">
          Email Address
        </Label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            id="email"
            type="email"
            placeholder="john@example.com"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value)
              if (errors.email) setErrors({ ...errors, email: undefined })
            }}
            className={`pl-10 h-12 ${errors.email ? 'border-destructive focus-visible:ring-destructive' : ''}`}
            disabled={loading}
          />
        </div>
        {errors.email && (
          <p className="text-sm text-destructive">{errors.email}</p>
        )}
        <p className="text-xs text-muted-foreground">
          Your ticket will be sent to this email address.
        </p>
      </div>

      {/* Order Summary */}
      <div className="rounded-lg bg-muted/50 p-4 space-y-3">
        <h3 className="font-medium text-foreground">Order Summary</h3>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">{eventTitle}</span>
          <span className="font-medium">1 ticket</span>
        </div>
        <div className="border-t pt-3 flex justify-between">
          <span className="font-medium">Total</span>
          <span className="font-bold text-primary">Proceed to pay</span>
        </div>
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        size="lg"
        className="w-full h-12 gap-2 bg-gradient-to-r from-primary to-primary/80 shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all"
        disabled={loading}
      >
        {loading ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin" />
            Processing...
          </>
        ) : (
          <>
            <CreditCard className="h-5 w-5" />
            Continue to Payment
            <ArrowRight className="h-4 w-4" />
          </>
        )}
      </Button>

      {/* Security Note */}
      <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
        <Lock className="h-3 w-3" />
        <span>Secured by Stripe. Your payment info is never stored.</span>
      </div>
    </form>
  )
}
