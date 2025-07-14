import { PrismaClient } from '@prisma/client'
import { NextResponse } from 'next/server'

const prisma = new PrismaClient()

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { title, date, capacity} = await req.json()

  const updated = await prisma.event.update({
    where: { id: Number(params.id) },
    data: {
      title,
      date: new Date(date),
      capacity: Number(capacity),
    },
  })

  return NextResponse.json(updated)
}


export async function DELETE(
  req: Request,
  context: { params: { id: string } }
) {
  const id = Number(context.params.id) 
  try {
    await prisma.ticket.deleteMany({
      where: { eventId: id },
    })

    // ✅ Then delete the event
    await prisma.event.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('❌ Failed to delete event:', error)
    return NextResponse.json({ error: 'Delete failed' }, { status: 500 })
  }
}