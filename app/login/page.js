"use client"

import { useState } from "react"
import { supabase } from "@/lib/supabase"
import { useRouter } from "next/navigation"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [status, setStatus] = useState("")
  const router = useRouter()

  async function handleLogin(e) {
    e.preventDefault()
    setStatus("loading")

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      setStatus("error")
    } else {
      router.push("/admin")
    }
  }

  return (
    <main className="min-h-screen bg-[#F7F7F5] flex items-center justify-center p-6">
      <div className="w-full max-w-lg">

        <div className="mb-8">
          <span className="text-xs font-semibold tracking-widest text-gray-400 uppercase">
            Admin
          </span>
          <h1 className="text-3xl font-bold text-gray-900 mt-1">
            Selamat datang.
          </h1>
          <p className="text-gray-500 mt-2 text-sm">
            Masuk untuk melihat semua feedback yang masuk.
          </p>
        </div>

        <form
          onSubmit={handleLogin}
          className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 flex flex-col gap-5"
        >
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
              Email
            </label>
            <input
              type="email"
              placeholder="Email kamu"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-[#F7F7F5] border-0 rounded-xl px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 transition"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
              Password
            </label>
            <input
              type="password"
              placeholder="Password kamu"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full bg-[#F7F7F5] border-0 rounded-xl px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 transition"
            />
          </div>

          <button
            type="submit"
            disabled={status === "loading"}
            className="w-full bg-gray-900 text-white rounded-xl py-3 text-sm font-semibold hover:bg-gray-700 active:scale-95 transition-all duration-150 disabled:opacity-50"
          >
            {status === "loading" ? "Masuk..." : "Masuk"}
          </button>

          {status === "error" && (
            <p className="text-red-500 text-xs text-center">
              Email atau password salah.
            </p>
          )}
        </form>

      </div>
    </main>
  )
}