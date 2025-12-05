import { Button } from "@/app/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/app/components/ui/table"
import { Badge } from "@/app/components/ui/badge"
import { Trash2, CheckCircle2 } from "lucide-react"
import { Booking } from "../hooks/useBookings"

type BookingsTableProps = {
  bookings: Booking[]
  onDelete: (id: number) => Promise<boolean>
  loading?: boolean
}

export function BookingsTable({ bookings, onDelete, loading }: BookingsTableProps) {
  const handleDelete = async (id: number) => {
    const confirmed = confirm('Are you sure you want to delete this booking?')
    if (!confirmed) return

    const success = await onDelete(id)
    if (!success) {
      alert('Failed to delete booking.')
    }
  }

  if (loading) {
    return <div className="text-center py-8">Loading bookings...</div>
  }

  if (bookings.length === 0) {
    return <p className="text-gray-500 py-8">No bookings found.</p>
  }

  return (
    <div className="overflow-x-auto mb-8">
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
    </div>
  )
}
