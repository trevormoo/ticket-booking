'use client'

import { Html5QrcodeScanner } from 'html5-qrcode'
import { useEffect, useState } from 'react'

export default function CheckInPage() {
  const [message, setMessage] = useState('Scan QR Code to Check In')
  const [checked, setChecked] = useState(false)

  useEffect(() => {
    if (checked) return

    const scanner = new Html5QrcodeScanner(
      'qr-reader',
      { fps: 10, qrbox: 250 },
      false
    )

    scanner.render(
      async (decodedText) => {
        setChecked(true)
        try {
          const res = await fetch('/api/check-in', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ bookingId: decodedText }),
          })

          const result = await res.json()
          if (res.ok) {
            setMessage('✅ Check-in successful!')
          } else {
            setMessage(`❌ ${result.error || 'Check-in failed'}`)
          }
        } catch (err) {
          setMessage('❌ Network error')
        }
      },
      (error) => {
        // silently ignore scan errors
      }
    )
  }, [checked])

  return (
    <main className="p-6 text-center">
      <h1 className="text-2xl font-bold mb-4">QR Code Check-In</h1>
      <div id="qr-reader" className="mx-auto w-80" />
      <p className="mt-4">{message}</p>
    </main>
  )
}