import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { TicketPDF } from '@/app/components/pdf/TicketPDF'
import { renderToBuffer } from '@react-pdf/renderer'

export async function GET(req: NextRequest, context: { params: { id: string } }) {
  const id = Number(context.params.id)
  if (!id) {
    return new Response('Invalid ticket ID', { status: 400 })
  }

  const ticket = await prisma.ticket.findUnique({
    where: { id },
    include: { event: true }
  })

  if (!ticket) {
    return new Response('Ticket not found', { status: 404 })
  }

  // Transform ticket data to match TicketPDF props
  const ticketData = {
    ...ticket,
    event: {
      ...ticket.event,
      date: ticket.event.date.toISOString(),
    },
    createdAt: ticket.createdAt.toISOString(),
  }

  // Use buffer for widest compatibility
  const pdfBuffer = await renderToBuffer(
    <TicketPDF ticket={ticketData} />
  )

  return new Response(pdfBuffer, {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `inline; filename="ticket-${id}.pdf"`,
    }
  })
}
