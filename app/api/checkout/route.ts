import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { prisma } from '@/lib/prisma'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-06-30.basil',
})

export async function POST(req: NextRequest) {
  const { name, email, eventId } = await req.json()

  // 1. Create the booking (unpaid)
  const booking = await prisma.ticket.create({
    data: { name, email, eventId: Number(eventId), paid: false }
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
      bookingId: booking.id,
      eventId,
      email,
    },
  })

  return NextResponse.json({ url: session.url })
}