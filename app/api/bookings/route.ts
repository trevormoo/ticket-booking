import { PrismaClient } from '@prisma/client'
import { NextResponse } from 'next/server'
import { sendConfirmationEmail } from '../../../lib/email'

const prisma = new PrismaClient()

// GET: List all bookings with event info
export async function GET() {
  const bookings = await prisma.ticket.findMany({
    include: { event: true },
    orderBy: { createdAt: 'desc' },
  })
  return NextResponse.json(bookings)
}

// POST: Create a new booking
export async function POST(req: Request) {
  const { name, email, eventId } = await req.json()

  if (!name || !email || !eventId) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
  }

  const existing = await prisma.ticket.findFirst({
    where: { email, eventId: Number(eventId) },
  })

  if (existing) {
    return NextResponse.json(
      { error: 'You already booked this event.' },
      { status: 409 }
    )
  }

  // 🧠 Check if event is at capacity
  const event = await prisma.event.findUnique({
    where: { id: Number(eventId) },
    include: { tickets: true }
  })

  if (!event) {
    return NextResponse.json({ error: 'Event not found' }, { status: 404 })
  }

  if (event.capacity && event.tickets.length >= event.capacity) {
    return NextResponse.json({ error: 'Event is fully booked.' }, { status: 400 })
  }

  const booking = await prisma.ticket.create({
    data: {
      name,
      email,
      eventId: Number(eventId),
    },
    include: { event: true },
  })

  await sendConfirmationEmail({
    name,
    email,
    eventTitle: booking.event.title,
    eventDate: new Date(booking.event.date).toLocaleDateString(),
    bookingId: booking.id.toString()
  })

  return NextResponse.json({ id: booking.id }, { status: 201 })
}
