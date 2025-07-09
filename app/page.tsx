import Link from 'next/link'
import { Card, CardHeader, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { prisma } from '@/lib/prisma'

export default async function Home() {
  const events = await prisma.event.findMany({
    orderBy: { date: 'asc' },
  })

  return (
    <main className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-center">📅 Upcoming Events</h1>

      {events.length === 0 ? (
        <p className="text-center text-gray-500">No events available.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map(event => (
            <Card key={event.id}>
              <CardHeader>
                <h2 className="text-lg font-semibold">{event.title}</h2>
              </CardHeader>
              <CardContent className="space-y-2">
                <p><strong>Date:</strong> {new Date(event.date).toLocaleDateString()}</p>
                <Link href={`/book/${event.id}`}>
                  <Button className="w-full">Book Now</Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </main>
  )
}