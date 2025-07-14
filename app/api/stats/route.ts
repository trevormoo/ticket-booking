import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const totalBookings = await prisma.ticket.count()
    const checkedIn = await prisma.ticket.count({ where: { checkedIn: true } })
    const notCheckedIn = await prisma.ticket.count({ where: { checkedIn: false } })
    const totalEvents = await prisma.event.count()

    return NextResponse.json({
      totalBookings,
      checkedIn,
      notCheckedIn,
      totalEvents
    })
  } catch (error) {
    console.error("Failed to fetch stats:", error)
    return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 })
  }
}