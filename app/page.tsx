import Link from 'next/link'
import { Card, CardContent } from '@/app/components/ui/card'
import { Button } from '@/app/components/ui/button'
import { Badge } from '@/app/components/ui/badge'
import { prisma } from '@/lib/prisma'
import {
  Calendar,
  MapPin,
  Users,
  ArrowRight,
  Sparkles,
  Ticket,
  Clock,
  TrendingUp
} from 'lucide-react'

export const dynamic = 'force-dynamic'

function formatDate(date: Date) {
  return new Intl.DateTimeFormat('en-US', {
    weekday: 'short',
    month: 'short',
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

function getEventStatus(date: Date, capacity: number | null, ticketCount: number) {
  const now = new Date()
  const eventDate = new Date(date)

  if (eventDate < now) return { label: 'Past', variant: 'secondary' as const }
  if (capacity !== null && ticketCount >= capacity) return { label: 'Sold Out', variant: 'destructive' as const }

  const daysUntil = Math.ceil((eventDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
  if (daysUntil <= 3) return { label: 'Almost Here', variant: 'default' as const }
  if (daysUntil <= 7) return { label: 'This Week', variant: 'secondary' as const }

  return null
}

export default async function Home() {
  const events = await prisma.event.findMany({
    orderBy: { date: 'asc' },
    include: {
      _count: {
        select: { tickets: true }
      }
    }
  })

  const upcomingEvents = events.filter(e => new Date(e.date) >= new Date())
  const featuredEvent = upcomingEvents[0]

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden hero-gradient">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-primary/10 blur-3xl" />
          <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-accent/10 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8 lg:py-32">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-8 items-center">
            {/* Hero Content */}
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary mb-6">
                <Sparkles className="h-4 w-4" />
                <span>Discover Amazing Events</span>
              </div>

              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
                Experience Events
                <span className="block gradient-text">Like Never Before</span>
              </h1>

              <p className="mt-6 text-lg text-muted-foreground max-w-xl mx-auto lg:mx-0">
                Book tickets to the hottest events in town. From concerts to conferences,
                we make ticketing seamless and secure.
              </p>

              <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link href="#events">
                  <Button size="lg" className="w-full sm:w-auto gap-2 bg-gradient-to-r from-primary to-primary/80 shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all">
                    Explore Events
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/admin">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto gap-2">
                    Host an Event
                    <Ticket className="h-4 w-4" />
                  </Button>
                </Link>
              </div>

              {/* Stats */}
              <div className="mt-12 grid grid-cols-3 gap-8 max-w-md mx-auto lg:mx-0">
                <div>
                  <div className="text-2xl font-bold text-foreground">{events.length}+</div>
                  <div className="text-sm text-muted-foreground">Events</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-foreground">
                    {events.reduce((acc, e) => acc + e._count.tickets, 0)}+
                  </div>
                  <div className="text-sm text-muted-foreground">Tickets Sold</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-foreground">100%</div>
                  <div className="text-sm text-muted-foreground">Secure</div>
                </div>
              </div>
            </div>

            {/* Featured Event Card */}
            {featuredEvent && (
              <div className="relative">
                <div className="absolute -inset-4 rounded-3xl bg-gradient-to-r from-primary/20 to-accent/20 blur-2xl opacity-60" />
                <Card className="relative overflow-hidden border-0 shadow-2xl card-hover">
                  <div className="absolute top-4 right-4 z-10">
                    <Badge className="bg-primary/90 text-primary-foreground border-0">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      Featured
                    </Badge>
                  </div>

                  {/* Event Image Placeholder */}
                  <div className="h-48 bg-gradient-to-br from-primary/20 via-primary/10 to-accent/20 flex items-center justify-center">
                    <Ticket className="h-16 w-16 text-primary/40" />
                  </div>

                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold text-foreground mb-2">
                      {featuredEvent.title}
                    </h3>

                    <div className="space-y-2 text-sm text-muted-foreground mb-4">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-primary" />
                        <span>{formatDate(featuredEvent.date)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-primary" />
                        <span>{formatTime(featuredEvent.date)}</span>
                      </div>
                      {featuredEvent.capacity && (
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-primary" />
                          <span>
                            {featuredEvent.capacity - featuredEvent._count.tickets} spots left
                          </span>
                        </div>
                      )}
                    </div>

                    <Link href={`/book/${featuredEvent.id}`}>
                      <Button className="w-full gap-2">
                        Get Tickets
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Events Section */}
      <section id="events" className="py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Upcoming Events
            </h2>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
              Don&apos;t miss out on these incredible experiences. Book your spot today.
            </p>
          </div>

          {/* Events Grid */}
          {upcomingEvents.length === 0 ? (
            <div className="text-center py-16">
              <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-muted mb-6">
                <Calendar className="h-10 w-10 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">No events yet</h3>
              <p className="text-muted-foreground mb-6">
                Be the first to create an amazing event.
              </p>
              <Link href="/admin">
                <Button>Create Event</Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 stagger-children">
              {upcomingEvents.map((event) => {
                const status = getEventStatus(event.date, event.capacity, event._count.tickets)
                const spotsLeft = event.capacity ? event.capacity - event._count.tickets : null
                const isSoldOut = spotsLeft !== null && spotsLeft <= 0

                return (
                  <Card
                    key={event.id}
                    className="group overflow-hidden border-0 shadow-lg card-hover bg-card"
                  >
                    {/* Event Image/Cover */}
                    <div className="relative h-40 bg-gradient-to-br from-primary/10 via-secondary/20 to-accent/10 flex items-center justify-center overflow-hidden">
                      <Ticket className="h-12 w-12 text-primary/30 group-hover:scale-110 transition-transform duration-300" />

                      {/* Status Badge */}
                      {status && (
                        <div className="absolute top-3 right-3">
                          <Badge variant={status.variant} className="text-xs">
                            {status.label}
                          </Badge>
                        </div>
                      )}

                      {/* Capacity indicator */}
                      {spotsLeft !== null && !isSoldOut && (
                        <div className="absolute bottom-0 left-0 right-0 h-1 bg-muted">
                          <div
                            className="h-full bg-primary transition-all duration-500"
                            style={{
                              width: `${Math.min(100, ((event.capacity! - spotsLeft) / event.capacity!) * 100)}%`
                            }}
                          />
                        </div>
                      )}
                    </div>

                    <CardContent className="p-5">
                      <h3 className="font-semibold text-lg text-foreground group-hover:text-primary transition-colors line-clamp-1 mb-3">
                        {event.title}
                      </h3>

                      <div className="space-y-2 text-sm text-muted-foreground mb-4">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 flex-shrink-0 text-primary/70" />
                          <span>{formatDate(event.date)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 flex-shrink-0 text-primary/70" />
                          <span>{formatTime(event.date)}</span>
                        </div>
                        {spotsLeft !== null && (
                          <div className="flex items-center gap-2">
                            <Users className="h-4 w-4 flex-shrink-0 text-primary/70" />
                            <span className={isSoldOut ? 'text-destructive font-medium' : ''}>
                              {isSoldOut ? 'Sold out' : `${spotsLeft} spots left`}
                            </span>
                          </div>
                        )}
                      </div>

                      <Link href={`/book/${event.id}`}>
                        <Button
                          className="w-full gap-2 group/btn"
                          disabled={isSoldOut}
                          variant={isSoldOut ? 'secondary' : 'default'}
                        >
                          {isSoldOut ? 'Sold Out' : 'Book Now'}
                          {!isSoldOut && (
                            <ArrowRight className="h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                          )}
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 sm:py-24 bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Why Choose TickFlow?
            </h2>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
              We make event ticketing simple, secure, and seamless.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Ticket,
                title: 'Easy Booking',
                description: 'Book tickets in seconds with our streamlined checkout process.'
              },
              {
                icon: Sparkles,
                title: 'Instant Confirmation',
                description: 'Get your tickets delivered to your email immediately after booking.'
              },
              {
                icon: Users,
                title: 'QR Check-in',
                description: 'Skip the lines with instant QR code scanning at venue entry.'
              }
            ].map((feature, index) => (
              <Card key={index} className="text-center p-8 border-0 shadow-lg card-hover bg-card">
                <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 mb-6">
                  <feature.icon className="h-7 w-7 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-primary to-primary/80 px-8 py-16 sm:px-16 shadow-2xl">
            <div className="absolute inset-0 bg-grid-white/10" />
            <div className="relative text-center">
              <h2 className="text-3xl font-bold tracking-tight text-primary-foreground sm:text-4xl">
                Ready to host your event?
              </h2>
              <p className="mt-4 text-lg text-primary-foreground/80 max-w-2xl mx-auto">
                Create and manage events with our powerful dashboard.
                Track sales, manage check-ins, and more.
              </p>
              <div className="mt-8">
                <Link href="/admin">
                  <Button
                    size="lg"
                    variant="secondary"
                    className="gap-2 shadow-lg"
                  >
                    Get Started
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
