import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"
import { parseId } from "@/lib/validations"

export async function POST(req: Request) {
  try {
    const body = await req.text()
    const params = new URLSearchParams(body)
    const ticketIdStr = params.get('ticketId')

    if (!ticketIdStr) {
      return NextResponse.json({ error: 'Missing ticketId' }, { status: 400 })
    }

    const ticketId = parseId(ticketIdStr)
    if (!ticketId) {
      return NextResponse.json({ error: 'Invalid ticketId' }, { status: 400 })
    }

    console.log('🔍 Checking in ticketId:', ticketId)

    // Check if ticket exists first
    const existingTicket = await prisma.ticket.findUnique({
      where: { id: ticketId },
    })

    if (!existingTicket) {
      return NextResponse.json({ error: 'Ticket not found' }, { status: 404 })
    }

    if (existingTicket.checkedIn) {
      return NextResponse.json({ error: 'Ticket already checked in' }, { status: 400 })
    }

    const ticket = await prisma.ticket.update({
      where: { id: ticketId },
      data: { checkedIn: true },
    })

    return NextResponse.redirect(`/check-in/${ticketId}?success=1`)
  } catch (err) {
    console.error('Check-in failed:', err)
    return NextResponse.json({ error: 'Check-in failed' }, { status: 500 })
  }
}