import QRCode from 'qrcode'

export async function generateQR(data: string): Promise<string> {
  try {
    // Returns a base64 image string
    return await QRCode.toDataURL(data, { type: 'image/png'})
  } catch (err) {
    console.error('❌ Failed to generate QR code:', err)
    return ''
  }
}