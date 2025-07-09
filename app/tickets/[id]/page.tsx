import { PrismaClient } from '@prisma/client'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { notFound } from 'next/navigation'

const prisma = new PrismaClient()

export default async function TicketPage({ params }: { params: { id: string } }) {
  const ticket = await prisma.ticket.findUnique({
    where: { id: Number(params.id) },
    include: { event: true }
  })

  if (!ticket) {
    return (
      <div className="p-8 text-center text-red-600 text-lg">
        ❌ Ticket not found
      </div>
    )
  }

  return (
    <main className="flex justify-center items-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-md p-4">
        <CardHeader>
          <h1 className="text-2xl font-bold">🎟 Ticket for {ticket.name}</h1>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <p><span className="font-semibold">Email:</span> {ticket.email}</p>
          <p><span className="font-semibold">Event:</span> {ticket.event.title}</p>
          <p><span className="font-semibold">Date:</span> {new Date(ticket.event.date).toLocaleDateString()}</p>
          <p><span className="font-semibold">Booking ID:</span> {ticket.id}</p>
        </CardContent>
      </Card>
    </main>
  )
}