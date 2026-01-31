import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/app/components/ui/button'
import { Card, CardContent } from '@/app/components/ui/card'
import { Badge } from '@/app/components/ui/badge'
import {
  Ticket,
  Calendar,
  Clock,
  User,
  Mail,
  CheckCircle2,
  ArrowLeft,
  QrCode
} from 'lucide-react'

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

export default async function CheckInPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const ticket = await prisma.ticket.findUnique({
    where: { id: Number(id) },
    include: { event: true }
  })

  if (!ticket) return notFound()

  const isCheckedIn = ticket.checkedIn

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30 flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md">
        {/* Back Link */}
        <Link href="/admin" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 group">
          <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
          Back to Dashboard
        </Link>

        <Card className="overflow-hidden border-0 shadow-2xl">
          {/* Header */}
          <div className={`p-6 ${isCheckedIn ? 'bg-gradient-to-r from-green-500 to-emerald-600' : 'bg-gradient-to-r from-primary to-primary/80'} text-white`}>
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/20">
                {isCheckedIn ? (
                  <CheckCircle2 className="h-6 w-6" />
                ) : (
                  <QrCode className="h-6 w-6" />
                )}
              </div>
              <div>
                <h1 className="text-lg font-bold">Check-In Station</h1>
                <p className="text-white/80 text-sm">
                  {isCheckedIn ? 'Already checked in' : 'Ready for check-in'}
                </p>
              </div>
            </div>

            <Badge
              className={`${
                isCheckedIn
                  ? 'bg-white/20 text-white border-white/30'
                  : 'bg-yellow-400/20 text-yellow-100 border-yellow-400/30'
              }`}
            >
              {isCheckedIn ? 'Checked In' : 'Pending Check-in'}
            </Badge>
          </div>

          <CardContent className="p-6">
            {/* Ticket Details */}
            <div className="space-y-4 mb-6">
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

              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                  <Ticket className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Event</div>
                  <div className="font-medium">{ticket.event.title}</div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                  <Calendar className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Date & Time</div>
                  <div className="font-medium">{formatDate(ticket.event.date)}</div>
                  <div className="text-sm text-muted-foreground">{formatTime(ticket.event.date)}</div>
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className="border-t my-6" />

            {/* Ticket ID */}
            <div className="flex items-center justify-between text-sm mb-6">
              <span className="text-muted-foreground">Ticket ID</span>
              <span className="font-mono font-medium">#{ticket.id.toString().padStart(6, '0')}</span>
            </div>

            {/* Action */}
            {isCheckedIn ? (
              <div className="text-center py-4 px-6 rounded-lg bg-green-50 dark:bg-green-950/30">
                <CheckCircle2 className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <p className="font-medium text-green-700 dark:text-green-400">
                  Successfully Checked In
                </p>
                <p className="text-sm text-green-600 dark:text-green-500">
                  This attendee has been admitted
                </p>
              </div>
            ) : (
              <form action="/api/check-in" method="POST">
                <input type="hidden" name="ticketId" value={ticket.id} />
                <Button
                  type="submit"
                  size="lg"
                  className="w-full h-12 gap-2 bg-gradient-to-r from-primary to-primary/80 shadow-lg shadow-primary/25"
                >
                  <CheckCircle2 className="h-5 w-5" />
                  Confirm Check-In
                </Button>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
