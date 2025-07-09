import { v2 as cloudinary } from 'cloudinary'
import nodemailer from 'nodemailer'
import { generateQR } from './qr'

console.log('📩 Using NEW Nodemailer version of sendConfirmationEmail ✅')

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

const qrCodeDataUrl = await generateQR(ticketUrl)

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

const uploadResult = await cloudinary.uploader.upload(qrCodeDataUrl, {
  folder: 'ticket-qr-codes',
})

const qrCodeImageUrl = uploadResult.secure_url
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: Number(process.env.EMAIL_PORT),
    secure: process.env.EMAIL_SECURE === 'true', // true for 465, false for 587
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  })

  const info = await transporter.sendMail({
    from: `"Ticket App" <${process.env.EMAIL_FROM}>`,
    to: email,
    subject: '🎟️ Your Booking Confirmation',
    html: `
      <p>Hi ${name},</p>
      <p>You’re booked for <strong>${eventTitle}</strong> on ${eventDate}.</p>
      <p>Scan this QR code at the venue:</p>
      <img src="${qrCodeImageUrl}" alt="QR Code" style="width:200px;" />
      <p>Or click here if the image doesn’t load: <a href="${ticketUrl}">${ticketUrl}</a></p>
      <p>Thanks for booking with us!</p>
    `,
  })

  console.log('✅ Email sent:', info.messageId)
}