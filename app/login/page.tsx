'use client'

import { signIn } from 'next-auth/react'

export default function LoginPage() {
  return (
    <main className="p-8 max-w-sm mx-auto text-center space-y-4">
      <h1 className="text-2xl font-bold">Admin Login</h1>
      <button
        onClick={() => signIn('github')}
        className="bg-black text-white px-4 py-2 rounded"
      >
        Sign in with GitHub
      </button>
    </main>
  )
}