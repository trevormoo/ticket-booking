import { useState } from "react"
import { Button } from "@/app/components/ui/button"
import { Input } from "@/app/components/ui/input"
import { toast } from "sonner"

type EventFormProps = {
  mode: 'create' | 'edit'
  initialData?: {
    id?: number
    title: string
    date: string
    capacity?: number
  }
  onSubmit: (title: string, date: string, capacity?: number) => Promise<boolean>
  onCancel?: () => void
}

export function EventForm({ mode, initialData, onSubmit, onCancel }: EventFormProps) {
  const [title, setTitle] = useState(initialData?.title || '')
  const [date, setDate] = useState(initialData?.date || '')
  const [capacity, setCapacity] = useState<number | ''>(initialData?.capacity || '')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const success = await onSubmit(
      title,
      date,
      capacity === '' ? undefined : capacity
    )

    if (success) {
      toast.success(mode === 'create' ? 'Event created!' : 'Event updated!')
      if (mode === 'create') {
        setTitle('')
        setDate('')
        setCapacity('')
      } else if (onCancel) {
        onCancel()
      }
    } else {
      toast.error(`Failed to ${mode} event`)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-2 mb-6">
      <h2 className="text-xl font-bold mb-2">
        {mode === 'create' ? 'Create New Event' : 'Edit Event'}
      </h2>
      <Input
        name="title"
        placeholder="Event title"
        value={title}
        onChange={e => setTitle(e.target.value)}
        required
      />
      <Input
        name="date"
        type="date"
        value={date}
        onChange={e => setDate(e.target.value)}
        required
      />
      <Input
        name="capacity"
        type="number"
        placeholder="Max attendees (optional)"
        value={capacity}
        onChange={e => setCapacity(e.target.value === '' ? '' : Number(e.target.value))}
      />
      <div className="flex gap-2">
        <Button type="submit" variant={mode === 'create' ? 'default' : 'secondary'}>
          {mode === 'create' ? 'Create Event' : 'Save Changes'}
        </Button>
        {mode === 'edit' && onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        )}
      </div>
    </form>
  )
}
