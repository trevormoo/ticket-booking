import { NextRequest, NextResponse } from 'next/server'
import QRCode from 'qrcode'

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams
  const data = searchParams.get('data') || 'default'

  const qr = await QRCode.toBuffer(data)

  return new NextResponse(qr, {
    headers: {
      'Content-Type': 'image/png',
      'Content-Disposition': 'inline; filename="qr.png"',
    },
  })
}