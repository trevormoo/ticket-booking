import Link from 'next/link'
import { Button } from '@/app/components/ui/button'
import { Card, CardContent } from '@/app/components/ui/card'
import {
  CheckCircle2,
  Mail,
  Ticket,
  Calendar,
  ArrowRight,
  Sparkles,
  QrCode
} from 'lucide-react'

export default function SuccessPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30 flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-lg">
        {/* Success Animation Container */}
        <div className="text-center mb-8">
          {/* Animated Success Icon */}
          <div className="relative inline-flex">
            <div className="absolute inset-0 rounded-full bg-green-500/20 animate-ping" />
            <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-green-400 to-green-600 shadow-xl shadow-green-500/30">
              <CheckCircle2 className="h-12 w-12 text-white" />
            </div>
          </div>

          <h1 className="mt-8 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Booking Confirmed!
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Your tickets have been successfully reserved.
          </p>
        </div>

        {/* Confirmation Details Card */}
        <Card className="border-0 shadow-xl overflow-hidden mb-8">
          <div className="h-2 bg-gradient-to-r from-green-400 to-green-600" />
          <CardContent className="p-6 sm:p-8">
            {/* What's Next Section */}
            <h2 className="font-semibold text-foreground mb-6 flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              What happens next?
            </h2>

            <div className="space-y-6">
              {/* Email Confirmation */}
              <div className="flex gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
                  <Mail className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium text-foreground">Check your email</h3>
                  <p className="text-sm text-muted-foreground">
                    We&apos;ve sent your ticket confirmation with all the details to your email.
                  </p>
                </div>
              </div>

              {/* QR Code */}
              <div className="flex gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
                  <QrCode className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium text-foreground">Save your QR code</h3>
                  <p className="text-sm text-muted-foreground">
                    Your email contains a unique QR code for quick check-in at the venue.
                  </p>
                </div>
              </div>

              {/* Event Day */}
              <div className="flex gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
                  <Calendar className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium text-foreground">Arrive on event day</h3>
                  <p className="text-sm text-muted-foreground">
                    Show your QR code at the entrance for instant check-in. No printing needed!
                  </p>
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className="my-8 border-t border-dashed" />

            {/* Additional Info */}
            <div className="rounded-lg bg-muted/50 p-4 text-center">
              <Ticket className="h-8 w-8 text-primary mx-auto mb-3" />
              <p className="text-sm text-muted-foreground">
                Can&apos;t find your email? Check your spam folder or contact our support team.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Link href="/" className="flex-1">
            <Button
              variant="outline"
              size="lg"
              className="w-full gap-2"
            >
              Browse More Events
            </Button>
          </Link>
          <Link href="/" className="flex-1">
            <Button
              size="lg"
              className="w-full gap-2 bg-gradient-to-r from-primary to-primary/80 shadow-lg shadow-primary/25"
            >
              Back to Home
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>

        {/* Support Link */}
        <p className="mt-8 text-center text-sm text-muted-foreground">
          Need help?{' '}
          <Link href="#" className="text-primary hover:underline">
            Contact Support
          </Link>
        </p>
      </div>
    </div>
  )
}
