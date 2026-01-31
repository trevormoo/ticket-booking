import { Card, CardContent } from "@/app/components/ui/card"
import { Stats } from "../hooks/useStats"
import {
  Ticket,
  CheckCircle2,
  Clock,
  Calendar,
  TrendingUp,
  Users
} from "lucide-react"

type StatsCardsProps = {
  stats: Stats | null
  loading?: boolean
}

export function StatsCards({ stats, loading }: StatsCardsProps) {
  if (loading || !stats) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map(i => (
          <Card key={i} className="border-0 shadow-lg overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="space-y-3 flex-1">
                  <div className="h-4 bg-muted rounded w-24 animate-pulse" />
                  <div className="h-8 bg-muted rounded w-16 animate-pulse" />
                  <div className="h-3 bg-muted rounded w-20 animate-pulse" />
                </div>
                <div className="h-12 w-12 rounded-xl bg-muted animate-pulse" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  const checkInRate = stats.totalBookings > 0
    ? Math.round((stats.checkedIn / stats.totalBookings) * 100)
    : 0

  const statCards = [
    {
      label: "Total Bookings",
      value: stats.totalBookings,
      subtext: "All time",
      icon: Ticket,
      color: "from-violet-500 to-purple-600",
      bgColor: "bg-violet-50 dark:bg-violet-950/30",
      iconBg: "bg-gradient-to-br from-violet-500 to-purple-600",
    },
    {
      label: "Checked In",
      value: stats.checkedIn,
      subtext: `${checkInRate}% check-in rate`,
      icon: CheckCircle2,
      color: "from-emerald-500 to-green-600",
      bgColor: "bg-emerald-50 dark:bg-emerald-950/30",
      iconBg: "bg-gradient-to-br from-emerald-500 to-green-600",
    },
    {
      label: "Pending",
      value: stats.notCheckedIn,
      subtext: "Awaiting check-in",
      icon: Clock,
      color: "from-amber-500 to-orange-600",
      bgColor: "bg-amber-50 dark:bg-amber-950/30",
      iconBg: "bg-gradient-to-br from-amber-500 to-orange-600",
    },
    {
      label: "Total Events",
      value: stats.totalEvents,
      subtext: "Active events",
      icon: Calendar,
      color: "from-blue-500 to-indigo-600",
      bgColor: "bg-blue-50 dark:bg-blue-950/30",
      iconBg: "bg-gradient-to-br from-blue-500 to-indigo-600",
    },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {statCards.map((stat, index) => (
        <Card
          key={index}
          className="border-0 shadow-lg overflow-hidden card-hover"
        >
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">
                  {stat.label}
                </p>
                <p className="text-3xl font-bold text-foreground tracking-tight">
                  {stat.value.toLocaleString()}
                </p>
                <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                  {index === 0 && <TrendingUp className="h-3 w-3 text-emerald-500" />}
                  {index === 1 && <Users className="h-3 w-3 text-emerald-500" />}
                  {stat.subtext}
                </p>
              </div>
              <div className={`p-3 rounded-xl ${stat.iconBg} shadow-lg`}>
                <stat.icon className="h-6 w-6 text-white" />
              </div>
            </div>

            {/* Progress bar for check-in stats */}
            {index === 1 && stats.totalBookings > 0 && (
              <div className="mt-4 pt-4 border-t">
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="text-muted-foreground">Progress</span>
                  <span className="font-medium text-foreground">{checkInRate}%</span>
                </div>
                <div className="h-2 rounded-full bg-muted overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-emerald-500 to-green-600 transition-all duration-500"
                    style={{ width: `${checkInRate}%` }}
                  />
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
