import { sendConfirmationEmail } from '@/lib/email'
import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-06-30.basil',
})

export async function POST(req: NextRequest) {
  const sig = req.headers.get('stripe-signature') as string
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

  if (!webhookSecret) {
    return new NextResponse('Webhook secret not set', { status: 500 })
  }

  // Read the raw body for Stripe verification
  const body = await req.arrayBuffer()
  const buf = Buffer.from(body)

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(buf, sig, webhookSecret)
  } catch (err: any) {
    console.error('❌ Stripe webhook signature verification failed.', err.message)
    return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 })
  }

  // Handle events you care about
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session
    const bookingId = session.metadata?.bookingId

    if (bookingId) {
      try {
        // 1. Mark ticket as paid and fetch booking details with event
        const booking = await prisma.ticket.update({
          where: { id: Number(bookingId) },
          data: { paid: true },
          include: { event: true }
        })

        // 2. Send email here (now that payment is confirmed)
        try {
          await sendConfirmationEmail({
            name: booking.name,
            email: booking.email,
            eventTitle: booking.event.title,
            eventDate: new Date(booking.event.date).toLocaleDateString(),
            bookingId: booking.id.toString(),
          })
        } catch (emailError) {
          // Log email error but don't fail the webhook
          // The ticket is already marked as paid, so we don't want to lose that
          console.error('Failed to send confirmation email:', emailError)
          // TODO: Implement retry mechanism or queue for failed emails
        }
      } catch (dbError) {
        console.error('Failed to update booking in webhook:', dbError)
        // Return error for database failures so Stripe retries
        return new NextResponse('Database error', { status: 500 })
      }
    }
  }

  return new NextResponse('Received', { status: 200 })
}