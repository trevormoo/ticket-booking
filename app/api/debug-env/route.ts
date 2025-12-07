import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({
    hasGithubId: !!process.env.GITHUB_ID,
    hasGithubSecret: !!process.env.GITHUB_SECRET,
    hasNextAuthSecret: !!process.env.NEXTAUTH_SECRET,
    hasNextAuthUrl: !!process.env.NEXTAUTH_URL,
    hasAdminEmails: !!process.env.ADMIN_EMAILS,
    nextAuthUrl: process.env.NEXTAUTH_URL,
  })
}
