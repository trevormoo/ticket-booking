import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import BookingForm from './BookingForm'

export default async function BookPage({ params }: { params: { id: string } }) {
  const event = await prisma.event.findUnique({
    where: { id: Number(params.id) },
    include: { tickets: true }, // ✅ Get ticket count
  })

  if (!event) return notFound()

  const spotsLeft =
    event.capacity !== null ? event.capacity - event.tickets.length : null

  const isFull = spotsLeft !== null && spotsLeft <= 0

  return (
    <main className="p-6 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-2">🎟 Book for {event.title}</h1>
      <p className="text-sm text-gray-600 mb-2">
        Event Date: {new Date(event.date).toLocaleDateString()}
      </p>

      {spotsLeft !== null && (
        <p className="text-sm text-gray-600 mb-6">
          🪑 {spotsLeft} seats remaining
        </p>
      )}

      {isFull ? (
        <p className="text-red-600 font-semibold">Sorry, this event is fully booked.</p>
      ) : (
        <BookingForm eventId={event.id} />
      )}
    </main>
  )
}