import { PrismaClient } from '@prisma/client'
import { NextResponse } from 'next/server'

const prisma = new PrismaClient()

export async function GET() {
  const events = await prisma.event.findMany({ orderBy: { date: 'asc' } })
  return NextResponse.json(events)
}

// ✅ POST: Create new event
export async function POST(req: Request) {
  const { title, date } = await req.json()

  if (!title || !date) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
  }

  const event = await prisma.event.create({
    data: {
      title,
      date: new Date(date),
    },
  })

  return NextResponse.json(event, { status: 201 })
}