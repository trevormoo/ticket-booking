import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import BookingForm from './BookingForm'

export default async function BookPage({ params }: { params: { id: string } }) {
  const event = await prisma.event.findUnique({
    where: { id: Number(params.id) },
  })

  if (!event) return notFound()

  return (
    <main className="p-6 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-2">🎟 Book for {event.title}</h1>
      <p className="text-sm text-gray-600 mb-6">
        Event Date: {new Date(event.date).toLocaleDateString()}
      </p>
      <BookingForm eventId={event.id} />
    </main>
  )
}