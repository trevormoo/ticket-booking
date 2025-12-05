import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { createEventSchema, validateRequestBody } from '@/lib/validations'

export async function GET() {
  try {
    const events = await prisma.event.findMany({ orderBy: { date: 'asc' } })
    return NextResponse.json(events)
  } catch (error) {
    console.error('Failed to fetch events:', error)
    return NextResponse.json(
      { error: 'Failed to fetch events' },
      { status: 500 }
    )
  }
}

// POST: Create new event
export async function POST(req: Request) {
  try {
    const body = await req.json()

    // Validate input
    const validation = validateRequestBody(createEventSchema, body)
    if (!validation.success) {
      return NextResponse.json({ error: validation.error }, { status: 400 })
    }

    const { title, date, capacity } = validation.data

    const event = await prisma.event.create({
      data: {
        title,
        date: new Date(date),
        capacity,
      },
    })

    return NextResponse.json(event, { status: 201 })
  } catch (error) {
    console.error('Failed to create event:', error)
    return NextResponse.json(
      { error: 'Failed to create event' },
      { status: 500 }
    )
  }
}