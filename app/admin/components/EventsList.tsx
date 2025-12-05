import { Button } from "@/app/components/ui/button"
import { Event } from "../hooks/useEvents"

type EventsListProps = {
  events: Event[]
  onEdit: (event: Event) => void
  onDelete: (id: number) => Promise<boolean>
  loading?: boolean
}

export function EventsList({ events, onEdit, onDelete, loading }: EventsListProps) {
  const handleDelete = async (id: number) => {
    const confirmed = confirm('Are you sure you want to delete this event?')
    if (!confirmed) return

    const success = await onDelete(id)
    if (!success) {
      alert('Failed to delete event.')
    }
  }

  if (loading) {
    return <div className="text-center py-8">Loading events...</div>
  }

  if (events.length === 0) {
    return <p className="text-gray-500 py-8">No events found.</p>
  }

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">All Events</h2>
      <ul className="space-y-2">
        {events.map(e => (
          <li key={e.id} className="border p-3 rounded-lg flex justify-between items-center hover:bg-gray-50">
            <span>
              <strong>{e.title}</strong> – {new Date(e.date).toLocaleDateString()}
              {typeof e.capacity === 'number' && ` | Capacity: ${e.capacity}`}
            </span>
            <div className="space-x-2">
              <Button variant="outline" size="sm" onClick={() => onEdit(e)}>
                Edit
              </Button>
              <Button variant="destructive" size="sm" onClick={() => handleDelete(e.id)}>
                Delete
              </Button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
