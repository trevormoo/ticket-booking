import { Resend } from 'resend'
import { generateQR } from './qr'
const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendConfirmationEmail({
  name,
  email,
  eventTitle,
  eventDate,
  bookingId
}: {
  name: string
  email: string
  eventTitle: string
  eventDate: string
  bookingId: string
}) {
  const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000'
  const ticketUrl = `${baseUrl}/tickets/${bookingId}`

  // ✅ Generate QR code that points to ticket URL
  const qrCode = await generateQR(ticketUrl)

  // ✅ Send email with inline QR image and fallback link
  return resend.emails.send({
    from: 'Ticket App <onboarding@resend.dev>',
    to: email,
    subject: '🎟️ Booking Confirmation with QR Code',
    html: `
      <p>Hi ${name},</p>
      <p>You’re booked for <strong>${eventTitle}</strong> on ${eventDate}.</p>
      <p>Scan the QR code below to access your ticket:</p>
      <img src="${qrCode}" alt="Your Ticket QR Code" style="width:200px; margin-top: 10px;" />
      <p>Or click here if the image doesn't load: <a href="${ticketUrl}">${ticketUrl}</a></p>
      <p>Thanks for booking with us!</p>
    `
  })
}