import { NextResponse } from 'next/server'
import { prisma } from '../../../lib/prisma'
import { createBookingSchema, validateRequestBody } from '../../../lib/validations'

// GET: List all bookings with event info
export async function GET() {
  try {
    const bookings = await prisma.ticket.findMany({
      include: { event: true },
      orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json(bookings)
  } catch (error) {
    console.error('Failed to fetch bookings:', error)
    return NextResponse.json(
      { error: 'Failed to fetch bookings' },
      { status: 500 }
    )
  }
}

// POST: Create a new booking
export async function POST(req: Request) {
  try {
    const body = await req.json()

    // Validate input
    const validation = validateRequestBody(createBookingSchema, body)
    if (!validation.success) {
      return NextResponse.json({ error: validation.error }, { status: 400 })
    }

    const { name, email, eventId } = validation.data

    // Use a transaction to prevent race conditions
    const booking = await prisma.$transaction(async (tx) => {
      // Check for duplicate booking
      const existing = await tx.ticket.findFirst({
        where: { email, eventId },
      })

      if (existing) {
        throw new Error('You already booked this event.')
      }

      // Get event with current ticket count
      const event = await tx.event.findUnique({
        where: { id: eventId },
        include: {
          _count: {
            select: { tickets: true },
          },
        },
      })

      if (!event) {
        throw new Error('Event not found')
      }

      // Check capacity atomically
      if (event.capacity && event._count.tickets >= event.capacity) {
        throw new Error('Event is fully booked.')
      }

      // Create the booking
      return await tx.ticket.create({
        data: {
          name,
          email,
          eventId,
          paid: false,
        },
        include: { event: true },
      })
    })

    return NextResponse.json({ id: booking.id }, { status: 201 })
  } catch (error) {
    console.error('Failed to create booking:', error)

    const message = error instanceof Error ? error.message : 'Failed to create booking'
    const status = message.includes('already booked') ? 409
      : message.includes('not found') ? 404
      : message.includes('fully booked') ? 400
      : 500

    return NextResponse.json({ error: message }, { status })
  }
}
