import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  const body = await req.text()
  const params = new URLSearchParams(body)
  const ticketId = params.get('ticketId')

  if (!ticketId) {
    return NextResponse.json({ error: 'Missing ticketId' }, { status: 400 })
  }

  try {
    console.log('🔍 Received ticketId:', ticketId)

    const ticket = await prisma.ticket.update({
      where: { id: Number(ticketId) },
      data: { checkedIn: true },
    })

    return NextResponse.redirect(`/check-in/${ticketId}?success=1`)
  } catch (err) {
    console.error('❌ Check-in failed:', err)
    return NextResponse.json({ error: 'Check-in failed' }, { status: 500 })
  }
}