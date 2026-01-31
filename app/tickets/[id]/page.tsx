import { PrismaClient } from '@prisma/client'
import Link from 'next/link'
import { Card, CardContent } from '@/app/components/ui/card'
import { Badge } from '@/app/components/ui/badge'
import { Button } from '@/app/components/ui/button'
import {
  Ticket,
  Calendar,
  Clock,
  User,
  Mail,
  CheckCircle2,
  XCircle,
  Download,
  Share2,
  ArrowLeft,
  QrCode
} from 'lucide-react'

const prisma = new PrismaClient()

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

export default async function TicketPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const ticket = await prisma.ticket.findUnique({
    where: { id: Number(id) },
    include: { event: true }
  })

  if (!ticket) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <Card className="w-full max-w-md border-0 shadow-xl">
          <CardContent className="p-8 text-center">
            <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10 mb-4">
              <XCircle className="h-8 w-8 text-destructive" />
            </div>
            <h1 className="text-xl font-bold text-foreground mb-2">Ticket Not Found</h1>
            <p className="text-muted-foreground mb-6">
              This ticket doesn&apos;t exist or may have been removed.
            </p>
            <Link href="/">
              <Button>Browse Events</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  const isPast = new Date(ticket.event.date) < new Date()

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30 py-8 px-4">
      <div className="mx-auto max-w-2xl">
        {/* Back Button */}
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8 group">
          <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
          Back to events
        </Link>

        {/* Ticket Card */}
        <Card className="overflow-hidden border-0 shadow-2xl">
          {/* Ticket Header */}
          <div className="relative bg-gradient-to-r from-primary to-primary/80 p-6 sm:p-8 text-primary-foreground">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2" />

            <div className="relative flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2 text-primary-foreground/80 text-sm mb-2">
                  <Ticket className="h-4 w-4" />
                  <span>Event Ticket</span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-bold mb-2">
                  {ticket.event.title}
                </h1>
                <div className="flex flex-wrap gap-2">
                  {ticket.paid ? (
                    <Badge className="bg-green-500/20 text-green-100 border-green-400/30">
                      <CheckCircle2 className="h-3 w-3 mr-1" />
                      Paid
                    </Badge>
                  ) : (
                    <Badge className="bg-yellow-500/20 text-yellow-100 border-yellow-400/30">
                      Pending Payment
                    </Badge>
                  )}
                  {ticket.checkedIn && (
                    <Badge className="bg-blue-500/20 text-blue-100 border-blue-400/30">
                      <CheckCircle2 className="h-3 w-3 mr-1" />
                      Checked In
                    </Badge>
                  )}
                  {isPast && (
                    <Badge variant="secondary">Past Event</Badge>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Ticket Tear Line */}
          <div className="relative">
            <div className="absolute left-0 top-0 -translate-y-1/2 w-6 h-6 bg-background rounded-full -ml-3" />
            <div className="absolute right-0 top-0 -translate-y-1/2 w-6 h-6 bg-background rounded-full -mr-3" />
            <div className="border-t-2 border-dashed border-border" />
          </div>

          <CardContent className="p-6 sm:p-8">
            <div className="grid gap-8 sm:grid-cols-2">
              {/* Left Column - Details */}
              <div className="space-y-6">
                <h2 className="font-semibold text-foreground">Ticket Details</h2>

                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                      <Calendar className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Date</div>
                      <div className="font-medium">{formatDate(ticket.event.date)}</div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                      <Clock className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Time</div>
                      <div className="font-medium">{formatTime(ticket.event.date)}</div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                      <User className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Attendee</div>
                      <div className="font-medium">{ticket.name}</div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                      <Mail className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Email</div>
                      <div className="font-medium">{ticket.email}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column - QR Code */}
              <div className="flex flex-col items-center justify-center p-6 bg-muted/30 rounded-xl">
                <div className="w-full max-w-[180px] aspect-square bg-white rounded-xl shadow-inner flex items-center justify-center mb-4">
                  <QrCode className="h-24 w-24 text-muted-foreground/50" />
                </div>
                <p className="text-sm text-muted-foreground text-center">
                  Scan this QR code at the venue for instant check-in
                </p>
                <div className="mt-2 text-xs text-muted-foreground font-mono">
                  ID: #{ticket.id.toString().padStart(6, '0')}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mt-8 pt-6 border-t">
              <Link href={`/tickets/${ticket.id}/pdf`} className="flex-1">
                <Button variant="outline" className="w-full gap-2">
                  <Download className="h-4 w-4" />
                  Download PDF
                </Button>
              </Link>
              <Button variant="outline" className="flex-1 gap-2">
                <Share2 className="h-4 w-4" />
                Share Ticket
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Additional Info */}
        <div className="mt-8 text-center text-sm text-muted-foreground">
          <p>
            Keep this ticket safe. You&apos;ll need it for entry to the event.
          </p>
          <p className="mt-2">
            Questions?{' '}
            <Link href="#" className="text-primary hover:underline">
              Contact Support
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
