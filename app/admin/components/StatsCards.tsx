import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card"
import { Stats } from "../hooks/useStats"

type StatsCardsProps = {
  stats: Stats | null
  loading?: boolean
}

export function StatsCards({ stats, loading }: StatsCardsProps) {
  if (loading || !stats) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[1, 2, 3, 4].map(i => (
          <Card key={i} className="rounded-2xl shadow-lg border-0 animate-pulse bg-gray-100">
            <CardHeader>
              <div className="h-6 bg-gray-300 rounded w-32"></div>
            </CardHeader>
            <CardContent>
              <div className="h-10 bg-gray-300 rounded w-16"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
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
  )
}
