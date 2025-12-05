import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST() {
  try {
    // Find all ticket IDs
    const allTickets = await prisma.ticket.findMany({
      select: { id: true, eventId: true },
    })

    // Find all event IDs
    const allEvents = await prisma.event.findMany({
      select: { id: true },
    })

    const eventIds = new Set(allEvents.map(e => e.id))
    const orphanedIds = allTickets
      .filter(t => !eventIds.has(t.eventId))
      .map(t => t.id)

    // Delete orphaned tickets
    const deleted = await prisma.ticket.deleteMany({
      where: {
        id: {
          in: orphanedIds,
        },
      },
    })

    return NextResponse.json({
      message: `✅ Cleaned ${deleted.count} orphaned ticket(s).`,
      orphanedIds: orphanedIds,
    })
  } catch (err) {
    console.error('❌ Cleanup failed', err)
    return NextResponse.json({ error: 'Cleanup failed' }, { status: 500 })
  }
}