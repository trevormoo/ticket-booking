'use client'

import { signIn } from 'next-auth/react'
import { Button } from '@/app/components/ui/button'
import { Card, CardContent } from '@/app/components/ui/card'
import { Github, Shield, ArrowRight, Ticket } from 'lucide-react'

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-muted/30 py-12 px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-lg shadow-primary/25">
              <Ticket className="h-6 w-6" />
            </div>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Welcome Back
          </h1>
          <p className="text-muted-foreground mt-2">
            Sign in to access the admin dashboard
          </p>
        </div>

        {/* Login Card */}
        <Card className="border-0 shadow-xl">
          <CardContent className="p-8">
            <Button
              onClick={() => signIn('github', { callbackUrl: '/admin' })}
              size="lg"
              className="w-full h-12 gap-3 bg-[#24292F] hover:bg-[#24292F]/90 text-white"
            >
              <Github className="h-5 w-5" />
              Continue with GitHub
              <ArrowRight className="h-4 w-4 ml-auto" />
            </Button>

            {/* Divider */}
            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">
                  Secure authentication
                </span>
              </div>
            </div>

            {/* Trust Indicators */}
            <div className="space-y-4">
              <div className="flex items-start gap-3 text-sm">
                <Shield className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-foreground">Admin Access Only</p>
                  <p className="text-muted-foreground">
                    Only authorized email addresses can access the dashboard.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 text-sm">
                <Github className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-foreground">GitHub OAuth</p>
                  <p className="text-muted-foreground">
                    We use GitHub for secure, passwordless authentication.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <p className="mt-8 text-center text-sm text-muted-foreground">
          By signing in, you agree to our{' '}
          <a href="#" className="text-primary hover:underline">Terms</a>
          {' '}and{' '}
          <a href="#" className="text-primary hover:underline">Privacy Policy</a>
        </p>
      </div>
    </div>
  )
}
