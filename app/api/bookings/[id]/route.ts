import { PrismaClient } from '@prisma/client'
import { NextResponse } from 'next/server'

const prisma = new PrismaClient()

export async function DELETE(
  req: Request,
  context: { params: { id: string } }
) {
  const { params } = await Promise.resolve(context) // ✅ this avoids the warning
  const id = Number(params.id)

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