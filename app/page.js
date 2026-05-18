"use client"

import { useState } from "react"
import { supabase } from "@/lib/supabase"

export default function Home() {
  const [name, setName] = useState("")
  const [message, setMessage] = useState("")
  const [status, setStatus] = useState("")

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
    }
  }

  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="bg-white rounded-2xl shadow-md p-8 w-full max-w-md">

        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          Kirim Feedback
        </h1>
        <p className="text-gray-500 mb-6">
          Pendapat kamu sangat berarti. Tulis pesanmu di bawah ini.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nama
            </label>
            <input
              type="text"
              placeholder="Nama kamu"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Pesan
            </label>
            <textarea
              placeholder="Tulis feedbackmu di sini..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
              rows={4}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            className="bg-blue-600 text-white rounded-lg py-2 font-medium hover:bg-blue-700 transition"
          >
            {status === "loading" ? "Mengirim..." : "Kirim Feedback"}
          </button>

          {status === "success" && (
            <p className="text-green-600 text-sm text-center">
              Feedback berhasil dikirim. Terima kasih!
            </p>
          )}
          {status === "error" && (
            <p className="text-red-600 text-sm text-center">
              Terjadi kesalahan. Coba lagi.
            </p>
          )}
        </form>

      </div>
    </main>
  )
}