import { Resend } from 'resend'
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
  const qrData = `Name: ${name}\nEvent: ${eventTitle}\nDate: ${eventDate}`
 
  return resend.emails.send({
    from: 'Ticket App <onboarding@resend.dev>',
    to: email,
    subject: '🎟️ Booking Confirmation with QR Code',
    html: `<p>Hi ${name},</p>
       <p>You’re booked for <strong>${eventTitle}</strong> on ${eventDate}.</p>
       <p>Open this QR code link:</p>
       <a href="http://localhost:3000/api/qr?data=${bookingId}">
         http://localhost:3000/api/qr?data=${bookingId}
       </a>
       <p>Thanks for booking with us!</p>`
  })
}