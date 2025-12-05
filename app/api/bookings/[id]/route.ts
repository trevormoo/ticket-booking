import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { parseId } from '@/lib/validations'

export async function DELETE(
  req: Request,
  context: { params: { id: string } }
) {
  try {
    const id = parseId(context.params.id)

    if (!id) {
      return NextResponse.json({ error: 'Invalid booking ID' }, { status: 400 })
    }

    const deleted = await prisma.ticket.delete({
      where: { id },
    })

    return NextResponse.json(deleted)
  } catch (error) {
    console.error('Failed to delete booking:', error)
    return NextResponse.json({ error: 'Delete failed' }, { status: 500 })
  }
}
