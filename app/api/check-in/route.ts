import { PrismaClient } from '@prisma/client'
import { NextResponse } from 'next/server'

const prisma = new PrismaClient()

export async function POST(req: Request) {
  const { bookingId } = await req.json()

  if (!bookingId) {
    return NextResponse.json({ error: 'Missing booking ID' }, { status: 400 })
  }

  const ticket = await prisma.ticket.findUnique({ where: { id: Number(bookingId) } })

  if (!ticket) {
    return NextResponse.json({ error: 'Ticket not found' }, { status: 404 })
  }

  if (ticket.checkedIn) {
    return NextResponse.json({ error: 'Ticket already checked in' }, { status: 409 })
  }

  await prisma.ticket.update({
    where: { id: ticket.id },
    data: { checkedIn: true },
  })

  return NextResponse.json({ success: true })
}