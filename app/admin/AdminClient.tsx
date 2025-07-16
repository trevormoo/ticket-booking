"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { signOut } from "next-auth/react"
import { Button } from "@/app/components/ui/button"
import { Input } from "@/app/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/app/components/ui/table"
import { Badge } from "@/app/components/ui/badge"
import { Trash2, CheckCircle2 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card"


// Types

type Booking = {
  paid: any
  id: number
  name: string
  email: string
  eventId: number
  createdAt: string
  checkedIn: boolean
  event: {
    id: number
    title: string
    date: string
  }
}

type Event = {
  id: number
  title: string
  date: string
  capacity?: number

}

export default function AdminClient() {
  const [newCapacity, setNewCapacity] = useState<string>('')
  
  const [bookings, setBookings] = useState<Booking[]>([])
  const [events, setEvents] = useState<Event[]>([])
  const [editing, setEditing] = useState(false)
  const [editData, setEditData] = useState<Event>({ id: 0, title: '', date: '', capacity: 0 })
  const [newTitle, setNewTitle] = useState('')
  const [newDate, setNewDate] = useState('')
  const router = useRouter()

  useEffect(() => {
    fetch('/api/bookings')
      .then(res => res.json())
      .then(data => setBookings(data))
  }, [])

  useEffect(() => {
    fetch('/api/events')
      .then(res => res.json())
      .then(data => setEvents(data))
  }, [])

  const [stats, setStats] = useState<{
  totalBookings: number
  checkedIn: number
  notCheckedIn: number
  totalEvents: number
  } | null>(null)

  useEffect(() => {
    fetch('/api/stats')
      .then(res => res.json())
      .then(data => setStats(data))
  }, [])

  const handleDelete = async (id: number) => {
    const confirmed = confirm('Are you sure you want to delete this booking?')
    if (!confirmed) return

    const res = await fetch(`/api/bookings/${id}`, { method: 'DELETE' })

    if (res.ok) {
      const updated = await fetch('/api/bookings').then(res => res.json())
      setBookings(updated)
    } else {
      alert('Failed to delete booking.')
    }
  }

  const handleDeleteEvent = async (id: number) => {
    const confirmed = confirm('Are you sure you want to delete this event?')
    if (!confirmed) return

    const res = await fetch(`/api/events/${id}`, { method: 'DELETE' })

    if (res.ok) {
      const updated = await fetch('/api/events').then(res => res.json())
      setEvents(updated)
    } else {
      alert('Failed to delete event.')
    }
  }

  const handleEdit = (event: Event) => {
    setEditData({
      id: event.id,
      title: event.title,
      date: new Date(event.date).toISOString().split('T')[0],
      capacity: event.capacity ?? 0
    })
    setEditing(true)
  }

  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault()
    const res = await fetch('/api/events', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: newTitle, date: newDate, capacity: newCapacity }) 
    })

    if (res.ok) {
      const newEvent = await res.json()
      setEvents(prev => [newEvent, ...prev])
      setNewTitle('')
      setNewDate('')
      setNewCapacity('');
    } else {
      alert('Failed to create event')
    }
  }

  const handleUpdateEvent = async (e: React.FormEvent) => {
    e.preventDefault()
    const res = await fetch(`/api/events/${editData.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: editData.title, date: editData.date, capacity: editData.capacity})
    })

    if (res.ok) {
      const updated = await res.json()
      setEvents(prev => prev.map(ev => (ev.id === updated.id ? updated : ev)))
      setEditData({ id: 0, title: '', date: '' })
      setEditing(false)
    } else {
      alert('Failed to update event')
    }
  }

  return (
    <main className="p-6 max-w-3xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">All Bookings</h1>
        <Button variant="outline" onClick={() => signOut()}>
          Logout
        </Button>
      </div>


      {stats && (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <Card className="bg-blue-50 rounded-2xl shadow-lg border-0">
          <CardHeader>
            <CardTitle className="text-blue-800">Total Bookings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-extrabold">{stats.totalBookings}</div>
          </CardContent>
        </Card>
        <Card className="bg-green-50 rounded-2xl shadow-lg border-0">
          <CardHeader>
            <CardTitle className="text-green-800">Checked In</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-extrabold">{stats.checkedIn}</div>
          </CardContent>
        </Card>
        <Card className="bg-yellow-50 rounded-2xl shadow-lg border-0">
          <CardHeader>
            <CardTitle className="text-yellow-800">Not Checked In</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-extrabold">{stats.notCheckedIn}</div>
          </CardContent>
        </Card>
        <Card className="bg-purple-50 rounded-2xl shadow-lg border-0">
          <CardHeader>
            <CardTitle className="text-purple-800">Total Events</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-extrabold">{stats.totalEvents}</div>
          </CardContent>
        </Card>
      </div>
    )}

      <div className="overflow-x-auto mb-8">
  {bookings.length === 0 ? (
    <p>No bookings found.</p>
  ) : (
    <Table className="rounded-xl shadow min-w-[900px]">
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Event</TableHead>
          <TableHead>Date</TableHead>
          <TableHead>Booked At</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Checked In</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {bookings.map(b => (
          <TableRow key={b.id} className="hover:bg-gray-50">
            <TableCell>{b.name}</TableCell>
            <TableCell>{b.email}</TableCell>
            <TableCell>{b.event.title}</TableCell>
            <TableCell>{new Date(b.event.date).toLocaleDateString()}</TableCell>
            <TableCell>{new Date(b.createdAt).toLocaleString()}</TableCell>
            <TableCell>
              <Badge variant={b.paid ? "success" : "destructive"}>
                {b.paid ? "Paid" : "Unpaid"}
              </Badge>
            </TableCell>
            <TableCell>
              <Badge variant={b.checkedIn ? "success" : "outline"}>
                {b.checkedIn ? (
                  <>
                    <CheckCircle2 className="inline w-4 h-4 mr-1" />
                    Yes
                  </>
                ) : (
                  "No"
                )}
              </Badge>
            </TableCell>
            <TableCell>
              <Button
                size="icon"
                variant="destructive"
                onClick={() => handleDelete(b.id)}
                aria-label="Delete booking"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )}
</div>

      <h2 className="text-xl font-bold mt-8 mb-2">Create New Event</h2>
      <form onSubmit={handleCreateEvent} className="space-y-2 mb-6">
        <Input
          name="title"
          placeholder="Event title"
          value={newTitle}
          onChange={e => setNewTitle(e.target.value)}
          required
        />
        <Input
          name="date"
          type="date"
          value={newDate}
          onChange={e => setNewDate(e.target.value)}
          required
        />
          <Input
            name="capacity"
            type="number"
            placeholder="Max attendees"
            value={newCapacity}
            onChange={e => setNewCapacity(e.target.value)}
            required
        />
        
        <Button type="submit">
          Create Event
        </Button>
      </form>

      {editing && (
        <form onSubmit={handleUpdateEvent} className="space-y-2 mb-6 mt-6">
          <h2 className="text-xl font-bold">Edit Event</h2>
          <Input
            name="title"
            value={editData.title}
            onChange={e => setEditData({ ...editData, title: e.target.value })}
            required
          />
          <Input
            name="date"
            type="date"
            value={editData.date}
            onChange={e => setEditData({ ...editData, date: e.target.value })}
            required
          />
          <Input
            name="capacity"
            type="number"
            value={editData.capacity}
            onChange={e => setEditData({ ...editData, capacity: Number(e.target.value) })}
            placeholder="Max attendees"
            required
          />
          <Button type="submit" variant="secondary">
            Save Changes
          </Button>
        </form>
      )}

      <h2 className="text-xl font-bold mt-8 mb-4">All Events</h2>
      <ul className="space-y-2">
        {events.map(e => (
          <li key={e.id} className="border p-2 rounded flex justify-between items-center">
            <span>
              {e.title} – {new Date(e.date).toLocaleDateString()} 
              {typeof e.capacity === 'number' && ` | Capacity: ${e.capacity}`}
            </span>
            <div className="space-x-2">
              <Button variant="outline" onClick={() => handleEdit(e)}>
                Edit
              </Button>
              <Button variant="destructive" onClick={() => handleDeleteEvent(e.id)}>
                Delete
              </Button>
            </div>
          </li>
        ))}
      </ul>
    </main>
  )
}