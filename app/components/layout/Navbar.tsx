'use client'

import Link from 'next/link'
import { useState } from 'react'
import { usePathname } from 'next/navigation'
import { Ticket, Menu, X, Sparkles } from 'lucide-react'
import { Button } from '@/app/components/ui/button'
import { cn } from '@/lib/utils'

const navLinks = [
  { href: '/', label: 'Events' },
  { href: '/admin', label: 'Dashboard' },
]

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-lg supports-[backdrop-filter]:bg-background/60">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="relative">
            <div className="absolute -inset-1 rounded-lg bg-gradient-to-r from-primary to-accent opacity-60 blur-sm group-hover:opacity-100 transition-opacity" />
            <div className="relative flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Ticket className="h-5 w-5" />
            </div>
          </div>
          <span className="text-xl font-bold tracking-tight">
            <span className="gradient-text">Tick</span>
            <span className="text-foreground">Flow</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex md:items-center md:gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'px-4 py-2 text-sm font-medium rounded-lg transition-colors',
                pathname === link.href
                  ? 'bg-primary/10 text-primary'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              )}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* CTA Button */}
        <div className="hidden md:flex md:items-center md:gap-4">
          <Link href="/">
            <Button className="gap-2 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg shadow-primary/25 transition-all hover:shadow-xl hover:shadow-primary/30">
              <Sparkles className="h-4 w-4" />
              Browse Events
            </Button>
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden relative z-50 p-2 text-foreground"
          aria-label="Toggle menu"
        >
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>

      {/* Mobile Menu */}
      <div
        className={cn(
          'fixed inset-0 z-40 bg-background/95 backdrop-blur-lg md:hidden transition-all duration-300',
          isOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'
        )}
      >
        <div className="flex flex-col items-center justify-center min-h-screen gap-8 p-8">
          {navLinks.map((link, index) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className={cn(
                'text-2xl font-semibold transition-all duration-300',
                pathname === link.href
                  ? 'text-primary'
                  : 'text-muted-foreground hover:text-foreground',
                isOpen ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
              )}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/"
            onClick={() => setIsOpen(false)}
            className={cn(
              'transition-all duration-300',
              isOpen ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
            )}
            style={{ transitionDelay: '200ms' }}
          >
            <Button size="lg" className="gap-2 bg-gradient-to-r from-primary to-primary/80">
              <Sparkles className="h-4 w-4" />
              Browse Events
            </Button>
          </Link>
        </div>
      </div>
    </header>
  )
}
