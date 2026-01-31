import { useState } from "react"
import { Button } from "@/app/components/ui/button"
import { Input } from "@/app/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/app/components/ui/table"
import { Badge } from "@/app/components/ui/badge"
import { Trash2, CheckCircle2, Search, X, Ticket, Calendar, Mail } from "lucide-react"
import { Booking } from "../hooks/useBookings"
import { toast } from "sonner"

type BookingsTableProps = {
  bookings: Booking[]
  onDelete: (id: number) => Promise<boolean>
  loading?: boolean
}

export function BookingsTable({ bookings, onDelete, loading }: BookingsTableProps) {
  const [search, setSearch] = useState("")
  const [deletingId, setDeletingId] = useState<number | null>(null)

  const handleDelete = async (id: number) => {
    const confirmed = confirm('Are you sure you want to delete this booking?')
    if (!confirmed) return

    setDeletingId(id)
    const success = await onDelete(id)
    setDeletingId(null)

    if (success) {
      toast.success('Booking deleted successfully')
    } else {
      toast.error('Failed to delete booking')
    }
  }

  const filteredBookings = bookings.filter(b =>
    b.name.toLowerCase().includes(search.toLowerCase()) ||
    b.email.toLowerCase().includes(search.toLowerCase()) ||
    b.event.title.toLowerCase().includes(search.toLowerCase())
  )

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-10 bg-muted rounded-lg animate-pulse w-full max-w-sm" />
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} className="h-16 bg-muted rounded-lg animate-pulse" />
          ))}
        </div>
      </div>
    )
  }

  if (bookings.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-muted mb-4">
          <Ticket className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold text-foreground mb-1">No bookings yet</h3>
        <p className="text-muted-foreground">Bookings will appear here when customers book tickets.</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search by name, email, or event..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10 pr-10"
        />
        {search && (
          <button
            onClick={() => setSearch("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Results count */}
      <p className="text-sm text-muted-foreground">
        Showing {filteredBookings.length} of {bookings.length} bookings
      </p>

      {/* Table */}
      <div className="overflow-x-auto rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="font-semibold">Attendee</TableHead>
              <TableHead className="font-semibold">Event</TableHead>
              <TableHead className="font-semibold">Booked</TableHead>
              <TableHead className="font-semibold">Status</TableHead>
              <TableHead className="font-semibold">Check-in</TableHead>
              <TableHead className="font-semibold text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredBookings.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                  No bookings match your search.
                </TableCell>
              </TableRow>
            ) : (
              filteredBookings.map(b => (
                <TableRow key={b.id} className="hover:bg-muted/30 transition-colors">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 flex-shrink-0">
                        <span className="text-sm font-medium text-primary">
                          {b.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium text-foreground truncate">{b.name}</p>
                        <p className="text-sm text-muted-foreground truncate flex items-center gap-1">
                          <Mail className="h-3 w-3" />
                          {b.email}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="min-w-0">
                      <p className="font-medium text-foreground truncate">{b.event.title}</p>
                      <p className="text-sm text-muted-foreground flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(b.event.date).toLocaleDateString()}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-muted-foreground">
                      {new Date(b.createdAt).toLocaleDateString()}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={b.paid ? "default" : "destructive"}
                      className={b.paid
                        ? "bg-green-100 text-green-700 hover:bg-green-100 dark:bg-green-900/30 dark:text-green-400"
                        : ""
                      }
                    >
                      {b.paid ? "Paid" : "Unpaid"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={b.checkedIn ? "default" : "outline"}
                      className={b.checkedIn
                        ? "bg-blue-100 text-blue-700 hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400"
                        : ""
                      }
                    >
                      {b.checkedIn ? (
                        <>
                          <CheckCircle2 className="inline w-3 h-3 mr-1" />
                          Yes
                        </>
                      ) : (
                        "No"
                      )}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDelete(b.id)}
                      disabled={deletingId === b.id}
                      className="text-destructive hover:text-destructive hover:bg-destructive/10"
                      aria-label="Delete booking"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
