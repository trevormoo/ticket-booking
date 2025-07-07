import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default async function TicketPage({ params }: { params: { id: string } }) {
  const ticket = await prisma.ticket.findUnique({
    where: { id: Number(params.id) },
    include: { event: true }
  })

  if (!ticket) {
    return <div className="p-8 text-red-600">❌ Ticket not found</div>
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-2">🎟 Ticket for {ticket.name}</h1>
      <p><strong>Email:</strong> {ticket.email}</p>
      <p><strong>Event:</strong> {ticket.event.title}</p>
      <p><strong>Date:</strong> {new Date(ticket.event.date).toLocaleDateString()}</p>
      <p><strong>Booking ID:</strong> {ticket.id}</p>
    </div>
  )
}