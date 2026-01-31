import { Button } from "@/app/components/ui/button"
import { Badge } from "@/app/components/ui/badge"
import { Event } from "../hooks/useEvents"
import { toast } from "sonner"
import { useState } from "react"
import {
  Calendar,
  Users,
  Edit2,
  Trash2,
  Clock
} from "lucide-react"

type EventsListProps = {
  events: Event[]
  onEdit: (event: Event) => void
  onDelete: (id: number) => Promise<boolean>
  loading?: boolean
}

function formatDate(date: Date | string) {
  return new Intl.DateTimeFormat('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  }).format(new Date(date))
}

function formatTime(date: Date | string) {
  return new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  }).format(new Date(date))
}

export function EventsList({ events, onEdit, onDelete, loading }: EventsListProps) {
  const [deletingId, setDeletingId] = useState<number | null>(null)

  const handleDelete = async (id: number) => {
    const confirmed = confirm('Are you sure you want to delete this event? This will also delete all associated bookings.')
    if (!confirmed) return

    setDeletingId(id)
    const success = await onDelete(id)
    setDeletingId(null)

    if (success) {
      toast.success('Event deleted successfully')
    } else {
      toast.error('Failed to delete event')
    }
  }

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map(i => (
          <div key={i} className="p-4 rounded-xl border bg-card animate-pulse">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-lg bg-muted" />
              <div className="flex-1 space-y-2">
                <div className="h-5 bg-muted rounded w-48" />
                <div className="h-4 bg-muted rounded w-32" />
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (events.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-muted mb-4">
          <Calendar className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold text-foreground mb-1">No events yet</h3>
        <p className="text-muted-foreground">Create your first event to start selling tickets.</p>
      </div>
    )
  }

  const now = new Date()

  return (
    <div className="space-y-4">
      {events.map(event => {
        const eventDate = new Date(event.date)
        const isPast = eventDate < now
        const isToday = eventDate.toDateString() === now.toDateString()
        const daysUntil = Math.ceil((eventDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))

        return (
          <div
            key={event.id}
            className={`
              p-4 rounded-xl border bg-card transition-all hover:shadow-md
              ${isPast ? 'opacity-60' : ''}
            `}
          >
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              {/* Event Icon */}
              <div className={`
                flex h-12 w-12 items-center justify-center rounded-lg flex-shrink-0
                ${isPast ? 'bg-muted' : 'bg-primary/10'}
              `}>
                <Calendar className={`h-6 w-6 ${isPast ? 'text-muted-foreground' : 'text-primary'}`} />
              </div>

              {/* Event Details */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-semibold text-foreground">
                      {event.title}
                    </h3>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5" />
                        {formatDate(event.date)}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5" />
                        {formatTime(event.date)}
                      </span>
                      {typeof event.capacity === 'number' && (
                        <span className="flex items-center gap-1">
                          <Users className="h-3.5 w-3.5" />
                          {event.capacity} capacity
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Status Badge */}
                  <div className="flex items-center gap-2">
                    {isPast ? (
                      <Badge variant="secondary">Past</Badge>
                    ) : isToday ? (
                      <Badge className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                        Today
                      </Badge>
                    ) : daysUntil <= 7 ? (
                      <Badge className="bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
                        In {daysUntil} days
                      </Badge>
                    ) : null}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 sm:ml-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onEdit(event)}
                  className="gap-1.5"
                >
                  <Edit2 className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">Edit</span>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDelete(event.id)}
                  disabled={deletingId === event.id}
                  className="gap-1.5 text-destructive hover:text-destructive hover:bg-destructive/10 hover:border-destructive/30"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">Delete</span>
                </Button>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
