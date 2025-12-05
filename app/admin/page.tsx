import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import AdminClient from './AdminClient'

export default async function AdminPage() {
  const session = await getServerSession(authOptions)

  // Get allowed admin emails from environment variable (comma-separated)
  const allowedEmails = process.env.ADMIN_EMAILS?.split(',').map(email => email.trim()) || []

  if (!session || !allowedEmails.includes(session.user?.email || '')) {
    redirect('/login')
  }

  return <AdminClient />
}