import Link from 'next/link'

type Event = {
  id: number
  title: string
  date: string
}

async function getEvents(): Promise<Event[]> {
  const res = await fetch(`${process.env.NEXTAUTH_URL}/api/events`, {
    cache: 'no-store',
  })
  return res.json()
}

export default async function EventsPage() {
  const events = await getEvents()

  return (
    <main className="max-w-2xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">Upcoming Events</h1>

      {events.length === 0 ? (
        <p>No events available.</p>
      ) : (
        events.map(event => (
          <div key={event.id} className="border p-4 rounded">
            <h2 className="text-lg font-semibold">{event.title}</h2>
            <p>{new Date(event.date).toLocaleDateString()}</p>
            <Link
              href={`/events/${event.id}/book`}
              className="inline-block mt-2 text-blue-600 underline"
            >
              Book Now
            </Link>
          </div>
        ))
      )}
    </main>
  )
}