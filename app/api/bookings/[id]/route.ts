import { PrismaClient } from '@prisma/client'
import { NextResponse } from 'next/server'

const prisma = new PrismaClient()

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  const id = Number(params.id)

  if (isNaN(id)) {
    return NextResponse.json({ error: 'Invalid ID' }, { status: 400 })
  }

  try {
    const deleted = await prisma.ticket.delete({
      where: { id },
    })

    return NextResponse.json(deleted)
  } catch (error) {
    console.error('❌ Failed to delete booking:', error)
    return NextResponse.json({ error: 'Delete failed' }, { status: 500 })
  }
}