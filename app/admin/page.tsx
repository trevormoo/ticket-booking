import { getServerSession } from 'next-auth'
import { authOptions } from '../api/auth/[...nextauth]/route'
import { redirect } from 'next/navigation'
import AdminClient from './AdminClient'

export default async function AdminPage() {
  const session = await getServerSession(authOptions)
  const allowedEmails = ['spacebierd@gmail.com'] // <- put your GitHub email here

  if (!session || !allowedEmails.includes(session.user?.email || '')) {
    redirect('/login')
  }

  return <AdminClient />
}