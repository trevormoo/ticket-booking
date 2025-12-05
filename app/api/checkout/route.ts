import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { prisma } from '@/lib/prisma'
import { checkoutSchema, validateRequestBody } from '@/lib/validations'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-06-30.basil',
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    // Validate input
    const validation = validateRequestBody(checkoutSchema, body)
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

      // Create the booking (unpaid)
      return await tx.ticket.create({
        data: { name, email, eventId, paid: false },
      })
    })

    // 2. Create Stripe Checkout Session with bookingId in metadata
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: { name: 'Event Ticket' },
            unit_amount: 1000, // in cents, e.g. $10.00
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/tickets/${booking.id}?success=1`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/book/${eventId}?canceled=1`,
      metadata: {
        bookingId: booking.id.toString(),
        eventId: eventId.toString(),
        email,
      },
    })

    return NextResponse.json({ url: session.url })
  } catch (error) {
    console.error('Checkout failed:', error)

    const message = error instanceof Error ? error.message : 'Checkout failed'
    const status = message.includes('already booked') ? 409
      : message.includes('not found') ? 404
      : message.includes('fully booked') ? 400
      : 500

    return NextResponse.json({ error: message }, { status })
  }
}