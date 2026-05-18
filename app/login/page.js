"use client"

import { useState } from "react"
import { supabase } from "@/lib/supabase"
import { useRouter } from "next/navigation"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [status, setStatus] = useState("")
  const [activeField, setActiveField] = useState("")
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
    <main className="min-h-screen bg-gray-950 flex items-center justify-center p-6 relative overflow-hidden">

      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-500 rounded-full opacity-5 blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-purple-500 rounded-full opacity-5 blur-3xl animate-pulse" />
      </div>

      <div className="w-full max-w-lg relative z-10">

        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
            <span className="text-xs text-gray-500 uppercase tracking-widest font-semibold">
              Admin Access
            </span>
          </div>
          <h1 className="text-4xl font-bold text-white leading-tight">
            Selamat<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
              datang kembali.
            </span>
          </h1>
          <p className="text-gray-500 mt-3 text-sm">
            Masuk untuk mengakses Feedback Center.
          </p>
        </div>

        <form
          onSubmit={handleLogin}
          className="flex flex-col gap-4"
        >
          <div className={`bg-gray-800/50 backdrop-blur rounded-2xl p-5 border transition-all duration-300 ${activeField === "email" ? "border-blue-500/50 shadow-lg shadow-blue-500/10" : "border-gray-700/50"}`}>
            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
              Email
            </label>
            <input
              type="email"
              placeholder="email@kamu.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onFocus={() => setActiveField("email")}
              onBlur={() => setActiveField("")}
              required
              className="w-full bg-transparent text-white placeholder-gray-600 text-lg font-medium focus:outline-none"
            />
          </div>

          <div className={`bg-gray-800/50 backdrop-blur rounded-2xl p-5 border transition-all duration-300 ${activeField === "password" ? "border-purple-500/50 shadow-lg shadow-purple-500/10" : "border-gray-700/50"}`}>
            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
              Password
            </label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onFocus={() => setActiveField("password")}
              onBlur={() => setActiveField("")}
              required
              className="w-full bg-transparent text-white placeholder-gray-600 text-lg font-medium focus:outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={status === "loading"}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl py-4 text-sm font-bold hover:from-blue-500 hover:to-purple-500 active:scale-95 transition-all duration-150 disabled:opacity-50 shadow-lg shadow-blue-500/20"
          >
            {status === "loading" ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Masuk...
              </span>
            ) : (
              "Masuk ke Dashboard"
            )}
          </button>

          {status === "error" && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 text-center">
              <p className="text-red-400 text-xs">
                Email atau password salah. Coba lagi.
              </p>
            </div>
          )}
        </form>

      </div>
    </main>
  )
}