"use client"

import { useState } from "react"
import { signOut } from "next-auth/react"
import { Button } from "@/app/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card"
import { useBookings } from "./hooks/useBookings"
import { useEvents, Event } from "./hooks/useEvents"
import { useStats } from "./hooks/useStats"
import { StatsCards } from "./components/StatsCards"
import { BookingsTable } from "./components/BookingsTable"
import { EventForm } from "./components/EventForm"
import { EventsList } from "./components/EventsList"
import {
  LogOut,
  Plus,
  LayoutDashboard,
  Calendar,
  Ticket,
  Settings,
  ChevronRight
} from "lucide-react"

type Tab = 'overview' | 'bookings' | 'events'

export default function AdminClient() {
  const { bookings, loading: bookingsLoading, deleteBooking, refetch: refetchBookings } = useBookings()
  const { events, loading: eventsLoading, createEvent, updateEvent, deleteEvent } = useEvents()
  const { stats, loading: statsLoading, refetch: refetchStats } = useStats()

  const [activeTab, setActiveTab] = useState<Tab>('overview')
  const [editing, setEditing] = useState(false)
  const [editData, setEditData] = useState<Event | null>(null)
  const [showCreateForm, setShowCreateForm] = useState(false)

  const handleEdit = (event: Event) => {
    setEditData({
      ...event,
      date: new Date(event.date).toISOString().split('T')[0],
    })
    setEditing(true)
    setShowCreateForm(false)
  }

  const handleUpdateEvent = async (title: string, date: string, capacity?: number) => {
    if (!editData) return false
    const success = await updateEvent(editData.id, title, date, capacity)
    if (success) {
      setEditing(false)
      setEditData(null)
      refetchStats()
    }
    return success
  }

  const handleCreateEvent = async (title: string, date: string, capacity?: number) => {
    const success = await createEvent(title, date, capacity)
    if (success) {
      setShowCreateForm(false)
      refetchStats()
    }
    return success
  }

  const handleDeleteEvent = async (id: number) => {
    const success = await deleteEvent(id)
    if (success) {
      refetchStats()
    }
    return success
  }

  const handleDeleteBooking = async (id: number) => {
    const success = await deleteBooking(id)
    if (success) {
      refetchStats()
    }
    return success
  }

  const tabs = [
    { id: 'overview' as Tab, label: 'Overview', icon: LayoutDashboard },
    { id: 'bookings' as Tab, label: 'Bookings', icon: Ticket },
    { id: 'events' as Tab, label: 'Events', icon: Calendar },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              Admin Dashboard
            </h1>
            <p className="text-muted-foreground mt-1">
              Manage your events, bookings, and check-ins
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => signOut()}
              className="gap-2"
            >
              <LogOut className="h-4 w-4" />
              Sign Out
            </Button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap gap-2 mb-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium
                transition-all duration-200
                ${activeTab === tab.id
                  ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/25'
                  : 'bg-card text-muted-foreground hover:text-foreground hover:bg-muted border'
                }
              `}
            >
              <tab.icon className="h-4 w-4" />
              {tab.label}
              {tab.id === 'bookings' && bookings.length > 0 && (
                <span className={`ml-1 px-2 py-0.5 rounded-full text-xs ${
                  activeTab === tab.id ? 'bg-primary-foreground/20' : 'bg-muted-foreground/20'
                }`}>
                  {bookings.length}
                </span>
              )}
              {tab.id === 'events' && events.length > 0 && (
                <span className={`ml-1 px-2 py-0.5 rounded-full text-xs ${
                  activeTab === tab.id ? 'bg-primary-foreground/20' : 'bg-muted-foreground/20'
                }`}>
                  {events.length}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-8 animate-slide-up">
            {/* Stats Cards */}
            <StatsCards stats={stats} loading={statsLoading} />

            {/* Quick Actions */}
            <div className="grid gap-6 md:grid-cols-2">
              {/* Recent Bookings Preview */}
              <Card className="border-0 shadow-lg">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-lg font-semibold">Recent Bookings</CardTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setActiveTab('bookings')}
                    className="gap-1 text-primary"
                  >
                    View All
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </CardHeader>
                <CardContent>
                  {bookingsLoading ? (
                    <div className="space-y-3">
                      {[1, 2, 3].map(i => (
                        <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 animate-pulse">
                          <div className="h-10 w-10 rounded-full bg-muted" />
                          <div className="flex-1 space-y-2">
                            <div className="h-4 bg-muted rounded w-24" />
                            <div className="h-3 bg-muted rounded w-32" />
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : bookings.length === 0 ? (
                    <p className="text-muted-foreground text-center py-8">No bookings yet</p>
                  ) : (
                    <div className="space-y-3">
                      {bookings.slice(0, 5).map((booking) => (
                        <div key={booking.id} className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                            <Ticket className="h-5 w-5 text-primary" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-foreground truncate">{booking.name}</p>
                            <p className="text-sm text-muted-foreground truncate">{booking.event.title}</p>
                          </div>
                          <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                            booking.paid
                              ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                              : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                          }`}>
                            {booking.paid ? 'Paid' : 'Pending'}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Quick Create Event */}
              <Card className="border-0 shadow-lg">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-lg font-semibold">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button
                    onClick={() => {
                      setActiveTab('events')
                      setShowCreateForm(true)
                    }}
                    className="w-full justify-start gap-3 h-auto p-4 bg-primary/5 hover:bg-primary/10 text-foreground"
                    variant="ghost"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                      <Plus className="h-5 w-5" />
                    </div>
                    <div className="text-left">
                      <div className="font-medium">Create New Event</div>
                      <div className="text-sm text-muted-foreground">Add a new event to your listing</div>
                    </div>
                  </Button>

                  <Button
                    onClick={() => setActiveTab('bookings')}
                    className="w-full justify-start gap-3 h-auto p-4 bg-primary/5 hover:bg-primary/10 text-foreground"
                    variant="ghost"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary text-secondary-foreground">
                      <Ticket className="h-5 w-5" />
                    </div>
                    <div className="text-left">
                      <div className="font-medium">Manage Bookings</div>
                      <div className="text-sm text-muted-foreground">View and manage all bookings</div>
                    </div>
                  </Button>

                  <Button
                    variant="ghost"
                    className="w-full justify-start gap-3 h-auto p-4 bg-primary/5 hover:bg-primary/10 text-foreground"
                    disabled
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                      <Settings className="h-5 w-5" />
                    </div>
                    <div className="text-left">
                      <div className="font-medium">Settings</div>
                      <div className="text-sm text-muted-foreground">Configure your preferences</div>
                    </div>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Bookings Tab */}
        {activeTab === 'bookings' && (
          <div className="animate-slide-up">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl font-semibold">All Bookings</CardTitle>
              </CardHeader>
              <CardContent>
                <BookingsTable
                  bookings={bookings}
                  onDelete={handleDeleteBooking}
                  loading={bookingsLoading}
                />
              </CardContent>
            </Card>
          </div>
        )}

        {/* Events Tab */}
        {activeTab === 'events' && (
          <div className="space-y-8 animate-slide-up">
            {/* Create Event Button */}
            {!showCreateForm && !editing && (
              <Button
                onClick={() => setShowCreateForm(true)}
                className="gap-2"
              >
                <Plus className="h-4 w-4" />
                Create New Event
              </Button>
            )}

            {/* Create Form */}
            {showCreateForm && (
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-xl font-semibold">Create New Event</CardTitle>
                </CardHeader>
                <CardContent>
                  <EventForm
                    mode="create"
                    onSubmit={handleCreateEvent}
                    onCancel={() => setShowCreateForm(false)}
                  />
                </CardContent>
              </Card>
            )}

            {/* Edit Form */}
            {editing && editData && (
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-xl font-semibold">Edit Event</CardTitle>
                </CardHeader>
                <CardContent>
                  <EventForm
                    mode="edit"
                    initialData={editData}
                    onSubmit={handleUpdateEvent}
                    onCancel={() => {
                      setEditing(false)
                      setEditData(null)
                    }}
                  />
                </CardContent>
              </Card>
            )}

            {/* Events List */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl font-semibold">All Events</CardTitle>
              </CardHeader>
              <CardContent>
                <EventsList
                  events={events}
                  onEdit={handleEdit}
                  onDelete={handleDeleteEvent}
                  loading={eventsLoading}
                />
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
