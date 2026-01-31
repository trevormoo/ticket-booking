import { useState } from "react"
import { Button } from "@/app/components/ui/button"
import { Input } from "@/app/components/ui/input"
import { Label } from "@/app/components/ui/label"
import { toast } from "sonner"
import { Calendar, Type, Users, Loader2, Save, Plus, X } from "lucide-react"

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
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const success = await onSubmit(
      title,
      date,
      capacity === '' ? undefined : capacity
    )

    setLoading(false)

    if (success) {
      toast.success(mode === 'create' ? 'Event created successfully!' : 'Event updated successfully!')
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
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Title Field */}
      <div className="space-y-2">
        <Label htmlFor="title" className="text-sm font-medium">
          Event Title
        </Label>
        <div className="relative">
          <Type className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            id="title"
            name="title"
            placeholder="Enter event title"
            value={title}
            onChange={e => setTitle(e.target.value)}
            className="pl-10 h-11"
            required
            disabled={loading}
          />
        </div>
      </div>

      {/* Date Field */}
      <div className="space-y-2">
        <Label htmlFor="date" className="text-sm font-medium">
          Event Date
        </Label>
        <div className="relative">
          <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            id="date"
            name="date"
            type="datetime-local"
            value={date}
            onChange={e => setDate(e.target.value)}
            className="pl-10 h-11"
            required
            disabled={loading}
          />
        </div>
      </div>

      {/* Capacity Field */}
      <div className="space-y-2">
        <Label htmlFor="capacity" className="text-sm font-medium">
          Capacity <span className="text-muted-foreground font-normal">(optional)</span>
        </Label>
        <div className="relative">
          <Users className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            id="capacity"
            name="capacity"
            type="number"
            min="1"
            placeholder="Leave empty for unlimited"
            value={capacity}
            onChange={e => setCapacity(e.target.value === '' ? '' : Number(e.target.value))}
            className="pl-10 h-11"
            disabled={loading}
          />
        </div>
        <p className="text-xs text-muted-foreground">
          Set a limit on how many tickets can be sold for this event.
        </p>
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-2">
        <Button
          type="submit"
          disabled={loading}
          className="gap-2"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              {mode === 'create' ? 'Creating...' : 'Saving...'}
            </>
          ) : mode === 'create' ? (
            <>
              <Plus className="h-4 w-4" />
              Create Event
            </>
          ) : (
            <>
              <Save className="h-4 w-4" />
              Save Changes
            </>
          )}
        </Button>
        {onCancel && (
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={loading}
            className="gap-2"
          >
            <X className="h-4 w-4" />
            Cancel
          </Button>
        )}
      </div>
    </form>
  )
}
