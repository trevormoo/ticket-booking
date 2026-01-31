import { notFound } from 'next/navigation'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { Card, CardContent } from '@/app/components/ui/card'
import { Badge } from '@/app/components/ui/badge'
import { Button } from '@/app/components/ui/button'
import {
  Calendar,
  Users,
  ArrowLeft,
  Ticket,
  Shield,
  Zap,
  CheckCircle2
} from 'lucide-react'
import BookingForm from './BookingForm'

function formatDate(date: Date) {
  return new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  }).format(new Date(date))
}

function formatTime(date: Date) {
  return new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  }).format(new Date(date))
}

export default async function BookPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const event = await prisma.event.findUnique({
    where: { id: Number(id) },
    include: { tickets: true },
  })

  if (!event) return notFound()

  const spotsLeft = event.capacity !== null ? event.capacity - event.tickets.length : null
  const isFull = spotsLeft !== null && spotsLeft <= 0
  const spotsPercentage = event.capacity
    ? Math.round((event.tickets.length / event.capacity) * 100)
    : 0

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Back Button */}
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8 group">
          <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
          Back to events
        </Link>

        {/* Progress Steps */}
        <div className="flex items-center justify-center gap-4 mb-12">
          {[
            { step: 1, label: 'Select Event', active: true, completed: true },
            { step: 2, label: 'Your Details', active: true, completed: false },
            { step: 3, label: 'Payment', active: false, completed: false },
            { step: 4, label: 'Confirmation', active: false, completed: false },
          ].map((item, index) => (
            <div key={item.step} className="flex items-center">
              <div className="flex flex-col items-center">
                <div
                  className={`
                    flex h-10 w-10 items-center justify-center rounded-full text-sm font-medium
                    transition-all duration-300
                    ${item.completed
                      ? 'bg-primary text-primary-foreground'
                      : item.active
                        ? 'bg-primary/20 text-primary border-2 border-primary'
                        : 'bg-muted text-muted-foreground'
                    }
                  `}
                >
                  {item.completed ? (
                    <CheckCircle2 className="h-5 w-5" />
                  ) : (
                    item.step
                  )}
                </div>
                <span className={`mt-2 text-xs font-medium hidden sm:block ${item.active ? 'text-foreground' : 'text-muted-foreground'}`}>
                  {item.label}
                </span>
              </div>
              {index < 3 && (
                <div className={`h-0.5 w-8 sm:w-16 mx-2 ${item.completed ? 'bg-primary' : 'bg-muted'}`} />
              )}
            </div>
          ))}
        </div>

        <div className="grid gap-8 lg:grid-cols-5">
          {/* Event Details */}
          <div className="lg:col-span-2">
            <Card className="overflow-hidden border-0 shadow-xl sticky top-24">
              {/* Event Header Image */}
              <div className="relative h-48 bg-gradient-to-br from-primary/20 via-primary/10 to-accent/20 flex items-center justify-center">
                <Ticket className="h-20 w-20 text-primary/30" />
                {spotsLeft !== null && spotsLeft <= 10 && spotsLeft > 0 && (
                  <Badge className="absolute top-4 right-4 bg-destructive/90 text-white border-0">
                    Only {spotsLeft} left!
                  </Badge>
                )}
              </div>

              <CardContent className="p-6">
                <h1 className="text-2xl font-bold text-foreground mb-4">
                  {event.title}
                </h1>

                <div className="space-y-4 mb-6">
                  <div className="flex items-start gap-3 text-foreground">
                    <Calendar className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <div className="font-medium">{formatDate(event.date)}</div>
                      <div className="text-sm text-muted-foreground">
                        {formatTime(event.date)}
                      </div>
                    </div>
                  </div>

                  {spotsLeft !== null && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                          <Users className="h-5 w-5 text-primary" />
                          <span className={isFull ? 'text-destructive font-medium' : 'text-foreground'}>
                            {isFull ? 'Event is sold out' : `${spotsLeft} spots remaining`}
                          </span>
                        </div>
                        <span className="text-muted-foreground">{spotsPercentage}% filled</span>
                      </div>
                      <div className="h-2 rounded-full bg-muted overflow-hidden">
                        <div
                          className={`h-full transition-all duration-500 ${
                            spotsPercentage >= 90 ? 'bg-destructive' :
                            spotsPercentage >= 70 ? 'bg-yellow-500' : 'bg-primary'
                          }`}
                          style={{ width: `${spotsPercentage}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Trust Badges */}
                <div className="border-t pt-6 space-y-3">
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <Shield className="h-4 w-4 text-primary" />
                    <span>Secure payment with Stripe</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <Zap className="h-4 w-4 text-primary" />
                    <span>Instant email confirmation</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <Ticket className="h-4 w-4 text-primary" />
                    <span>QR code for easy check-in</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Booking Form */}
          <div className="lg:col-span-3">
            <Card className="border-0 shadow-xl">
              <CardContent className="p-6 sm:p-8">
                <h2 className="text-xl font-bold text-foreground mb-2">
                  Complete Your Booking
                </h2>
                <p className="text-muted-foreground mb-8">
                  Enter your details below to reserve your spot.
                </p>

                {isFull ? (
                  <div className="text-center py-12">
                    <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10 mb-4">
                      <Users className="h-8 w-8 text-destructive" />
                    </div>
                    <h3 className="text-xl font-semibold text-foreground mb-2">
                      This event is sold out
                    </h3>
                    <p className="text-muted-foreground mb-6">
                      Check back later or browse other upcoming events.
                    </p>
                    <Link href="/">
                      <Button variant="outline">Browse Events</Button>
                    </Link>
                  </div>
                ) : (
                  <BookingForm eventId={event.id} eventTitle={event.title} />
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
