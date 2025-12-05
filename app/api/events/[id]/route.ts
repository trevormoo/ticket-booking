import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { updateEventSchema, validateRequestBody, parseId } from '@/lib/validations'

export async function PUT(
  req: Request,
  context: { params: { id: string } }
) {
  try {
    const id = parseId(context.params.id)
    if (!id) {
      return NextResponse.json({ error: 'Invalid event ID' }, { status: 400 })
    }

    const body = await req.json()

    // Validate input
    const validation = validateRequestBody(updateEventSchema, body)
    if (!validation.success) {
      return NextResponse.json({ error: validation.error }, { status: 400 })
    }

    const { title, date, capacity } = validation.data

    // Build update data object with only provided fields
    const updateData: any = {}
    if (title !== undefined) updateData.title = title
    if (date !== undefined) updateData.date = new Date(date)
    if (capacity !== undefined) updateData.capacity = capacity

    const updated = await prisma.event.update({
      where: { id },
      data: updateData,
    })

    return NextResponse.json(updated)
  } catch (error) {
    console.error('Failed to update event:', error)
    return NextResponse.json(
      { error: 'Failed to update event' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  req: Request,
  context: { params: { id: string } }
) {
  try {
    const id = parseId(context.params.id)
    if (!id) {
      return NextResponse.json({ error: 'Invalid event ID' }, { status: 400 })
    }

    // Use transaction for atomicity
    await prisma.$transaction([
      prisma.ticket.deleteMany({
        where: { eventId: id },
      }),
      prisma.event.delete({
        where: { id },
      }),
    ])

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Failed to delete event:', error)
    return NextResponse.json({ error: 'Delete failed' }, { status: 500 })
  }
}
