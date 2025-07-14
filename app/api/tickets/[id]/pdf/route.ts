// app/api/tickets/[id]/pdf/route.ts
import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { TicketPDF } from '@/app/components/pdf/TicketPDF'
import { renderToStream } from '@react-pdf/renderer'

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const id = Number(params.id)
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

  const pdfStream = await renderToStream(<TicketPDF ticket={ticket} />)

  return new Response(pdfStream as any, {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `inline; filename="ticket-${id}.pdf"`
    }
  })
}