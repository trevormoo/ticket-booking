import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function POST() {
  try {
    // Find all tickets where the related event does NOT exist
    const orphaned = await prisma.ticket.findMany({
      where: {
        event: null, // event relation doesn't exist
      },
    })

    // Delete them all
    const deleted = await prisma.ticket.deleteMany({
      where: {
        event: null,
      },
    })

    return NextResponse.js({
      message: `✅ Cleaned ${deleted.count} orphaned ticket(s).`,
      orphanedIds: orphaned.map(t => t.id),
    })
  } catch (err) {
    console.error('❌ Cleanup failed', err)
    return NextResponse.json({ error: 'Cleanup failed' }, { status: 500 })
  }
}