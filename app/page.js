"use client"

import { useState, useEffect, useRef } from "react"
import { supabase } from "@/lib/supabase"
import confetti from "canvas-confetti"

export default function Home() {
  const [name, setName] = useState("")
  const [message, setMessage] = useState("")
  const [status, setStatus] = useState("")
  const [charCount, setCharCount] = useState(0)

  function fireConfetti() {
    confetti({
      particleCount: 120,
      spread: 80,
      origin: { y: 0.6 },
      colors: ["#111", "#555", "#999", "#3B82F6", "#ffffff"],
    })
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setStatus("loading")

    const { error } = await supabase
      .from("feedbacks")
      .insert([{ name, message }])

    if (error) {
      setStatus("error")
    } else {
      setStatus("success")
      setName("")
      setMessage("")
      setCharCount(0)
      fireConfetti()
    }
  }

  return (
    <main className="min-h-screen bg-[#F7F7F5] flex items-center justify-center p-6">
      <div className="w-full max-w-lg">

        <div className="mb-8">
          <span className="text-xs font-semibold tracking-widest text-gray-400 uppercase">
            Feedback
          </span>
          <h1 className="text-3xl font-bold text-gray-900 mt-1">
            Apa pendapatmu?
          </h1>
          <p className="text-gray-500 mt-2 text-sm">
            Ceritakan pengalamanmu. Setiap kata berarti bagi kami.
          </p>
        </div>

        {status === "success" ? (
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 text-center">
            <div className="text-4xl mb-3">🎉</div>
            <h2 className="text-lg font-semibold text-gray-800 mb-1">
              Terima kasih!
            </h2>
            <p className="text-gray-500 text-sm mb-6">
              Feedbackmu sudah kami terima.
            </p>
            <button
              onClick={() => setStatus("")}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium transition"
            >
              Kirim feedback lagi
            </button>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 flex flex-col gap-5"
          >
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                Nama
              </label>
              <input
                type="text"
                placeholder="Nama kamu"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full bg-[#F7F7F5] border-0 rounded-xl px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 transition"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Pesan
                </label>
                <span className="text-xs text-gray-400">
                  {charCount}/300
                </span>
              </div>
              <textarea
                placeholder="Tulis feedbackmu di sini..."
                value={message}
                onChange={(e) => {
                  setMessage(e.target.value)
                  setCharCount(e.target.value.length)
                }}
                required
                maxLength={300}
                rows={4}
                className="w-full bg-[#F7F7F5] border-0 rounded-xl px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 transition resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={status === "loading"}
              className="w-full bg-gray-900 text-white rounded-xl py-3 text-sm font-semibold hover:bg-gray-700 active:scale-95 transition-all duration-150 disabled:opacity-50"
            >
              {status === "loading" ? "Mengirim..." : "Kirim Feedback"}
            </button>

            {status === "error" && (
              <p className="text-red-500 text-xs text-center">
                Terjadi kesalahan. Coba lagi.
              </p>
            )}
          </form>
        )}

        <p className="text-center text-xs text-gray-400 mt-6">
          Feedback kamu aman dan terjaga privasinya.
        </p>

      </div>
    </main>
  )
}