import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'

export default async function CheckInPage({ params }: { params: { id: string } }) {
  const ticket = await prisma.ticket.findUnique({
    where: { id: Number(params.id) },
    include: { event: true }
  })

  if (!ticket) return notFound()

  const isCheckedIn = ticket.checkedIn

  return (
    <main className="min-h-screen flex justify-center items-center p-6 bg-gray-50">
      <Card className="max-w-md w-full">
        <CardHeader>
          <h1 className="text-xl font-bold">
            🎟 Ticket for {ticket.name}
          </h1>
        </CardHeader>
        <CardContent className="space-y-4 text-sm">
          <p><strong>Email:</strong> {ticket.email}</p>
          <p><strong>Event:</strong> {ticket.event.title}</p>
          <p><strong>Date:</strong> {new Date(ticket.event.date).toLocaleDateString()}</p>
          <p><strong>Booking ID:</strong> {ticket.id}</p>
          <p>
            <strong>Status:</strong>{' '}
            {isCheckedIn ? (
              <span className="text-green-600">✅ Already Checked In</span>
            ) : (
              <form action={`/api/checkin`} method="POST" className="mt-2">
                <input type="hidden" name="ticketId" value={ticket.id} />
                <Button type="submit" variant="default">
                  Check In
                </Button>
              </form>
            )}
          </p>
        </CardContent>
      </Card>
    </main>
  )
}