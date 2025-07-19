import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { TicketPDF } from '@/app/components/pdf/TicketPDF'
import React from 'react'
import { renderToBuffer } from '@react-pdf/renderer'

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

  // Use buffer for widest compatibility
  const pdfBuffer = await renderToBuffer(
    React.createElement(TicketPDF, { ticket })
  )

  return new Response(pdfBuffer, {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `inline; filename="ticket-${id}.pdf"`,
    }
  })
}