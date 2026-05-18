"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"
import confetti from "canvas-confetti"

export default function Home() {
  const [name, setName] = useState("")
  const [message, setMessage] = useState("")
  const [rating, setRating] = useState(0)
  const [hoveredRating, setHoveredRating] = useState(0)
  const [status, setStatus] = useState("")
  const [charCount, setCharCount] = useState(0)
  const [activeField, setActiveField] = useState("")
  const [step, setStep] = useState(1)

  function fireConfetti() {
    const end = Date.now() + 2000
    const colors = ["#111", "#3B82F6", "#8B5CF6", "#EC4899", "#F59E0B"]
    ;(function frame() {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors,
      })
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors,
      })
      if (Date.now() < end) requestAnimationFrame(frame)
    })()
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (rating === 0) {
      alert("Pilih rating dulu ya!")
      return
    }
    setStatus("loading")

    const { error } = await supabase
      .from("feedbacks")
      .insert([{ name, message, rating }])

    if (error) {
      setStatus("error")
    } else {
      setStatus("success")
      fireConfetti()
    }
  }

  const progress = ((step - 1) / 2) * 100

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-800 flex items-center justify-center p-6 relative overflow-hidden">

      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-500 rounded-full opacity-5 blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-purple-500 rounded-full opacity-5 blur-3xl animate-pulse" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-500 rounded-full opacity-3 blur-3xl" />
      </div>

      <div className="w-full max-w-lg relative z-10">

        {status === "success" ? (
          <div className="text-center">
            <div className="text-8xl mb-6 animate-bounce">🎉</div>
            <h2 className="text-4xl font-bold text-white mb-3">Luar biasa!</h2>
            <p className="text-gray-400 mb-2">Feedback kamu sudah kami terima.</p>
            <p className="text-gray-500 text-sm mb-8">Tim kami akan membaca pesanmu dengan seksama.</p>
            <button
              onClick={() => {
                setStatus("")
                setName("")
                setMessage("")
                setRating(0)
                setCharCount(0)
                setStep(1)
              }}
              className="px-6 py-3 bg-white text-gray-900 rounded-xl text-sm font-semibold hover:bg-gray-100 active:scale-95 transition-all"
            >
              Kirim feedback lagi
            </button>
          </div>
        ) : (
          <>
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                <span className="text-xs text-gray-500 uppercase tracking-widest font-semibold">
                  Live Feedback
                </span>
              </div>
              <h1 className="text-4xl font-bold text-white leading-tight">
                Suaramu<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                  penting bagi kami.
                </span>
              </h1>
              <p className="text-gray-500 mt-3 text-sm">
                Ceritakan pengalamanmu. Jujur, singkat, atau panjang sekalipun.
              </p>
            </div>

            <div className="mb-6">
              <div className="flex justify-between text-xs text-gray-600 mb-2">
                <span>Progress</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <div className="w-full bg-gray-800 rounded-full h-1">
                <div
                  className="bg-gradient-to-r from-blue-500 to-purple-500 h-1 rounded-full transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <div className="flex justify-between mt-2">
                {["Nama", "Pesan", "Rating"].map((s, i) => (
                  <span
                    key={s}
                    className={`text-xs transition-colors ${step > i ? "text-blue-400" : "text-gray-600"}`}
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">

              <div className={`bg-gray-800/50 backdrop-blur rounded-2xl p-5 border transition-all duration-300 ${activeField === "name" ? "border-blue-500/50 shadow-lg shadow-blue-500/10" : "border-gray-700/50"}`}>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                  01 — Nama kamu
                </label>
                <input
                  type="text"
                  placeholder="Ketik namamu di sini..."
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value)
                    if (e.target.value) setStep(Math.max(step, 2))
                  }}
                  onFocus={() => setActiveField("name")}
                  onBlur={() => setActiveField("")}
                  required
                  className="w-full bg-transparent text-white placeholder-gray-600 text-lg font-medium focus:outline-none"
                />
                {name && (
                  <div className="mt-2 flex items-center gap-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-400" />
                    <span className="text-xs text-green-400">Keren, hai {name}!</span>
                  </div>
                )}
              </div>

              <div className={`bg-gray-800/50 backdrop-blur rounded-2xl p-5 border transition-all duration-300 ${activeField === "message" ? "border-purple-500/50 shadow-lg shadow-purple-500/10" : "border-gray-700/50"}`}>
                <div className="flex justify-between items-center mb-3">
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    02 — Pesanmu
                  </label>
                  <div className="flex items-center gap-2">
                    <div className="w-16 bg-gray-700 rounded-full h-1">
                      <div
                        className="bg-purple-500 h-1 rounded-full transition-all"
                        style={{ width: `${(charCount / 300) * 100}%` }}
                      />
                    </div>
                    <span className="text-xs text-gray-500">{charCount}/300</span>
                  </div>
                </div>
                <textarea
                  placeholder="Ceritakan pengalamanmu..."
                  value={message}
                  onChange={(e) => {
                    setMessage(e.target.value)
                    setCharCount(e.target.value.length)
                    if (e.target.value) setStep(Math.max(step, 3))
                  }}
                  onFocus={() => setActiveField("message")}
                  onBlur={() => setActiveField("")}
                  required
                  maxLength={300}
                  rows={3}
                  className="w-full bg-transparent text-white placeholder-gray-600 text-sm focus:outline-none resize-none leading-relaxed"
                />
              </div>

              <div className={`bg-gray-800/50 backdrop-blur rounded-2xl p-5 border transition-all duration-300 ${rating > 0 ? "border-yellow-500/50 shadow-lg shadow-yellow-500/10" : "border-gray-700/50"}`}>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">
                  03 — Rating pengalamanmu
                </label>
                <div className="flex gap-2 justify-center">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoveredRating(star)}
                      onMouseLeave={() => setHoveredRating(0)}
                      className="text-3xl transition-all duration-150 hover:scale-125 active:scale-95"
                    >
                      <span className={`transition-all ${star <= (hoveredRating || rating) ? "opacity-100" : "opacity-20"}`}>
                        ⭐
                      </span>
                    </button>
                  ))}
                </div>
                {rating > 0 && (
                  <p className="text-center text-xs text-yellow-400 mt-3">
                    {["", "Sangat buruk", "Kurang baik", "Cukup baik", "Baik sekali", "Luar biasa!"][rating]}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={status === "loading" || !name || !message || rating === 0}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl py-4 text-sm font-bold hover:from-blue-500 hover:to-purple-500 active:scale-95 transition-all duration-150 disabled:opacity-30 disabled:cursor-not-allowed shadow-lg shadow-blue-500/20"
              >
                {status === "loading" ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Mengirim...
                  </span>
                ) : (
                  "Kirim Feedback"
                )}
              </button>

              {status === "error" && (
                <p className="text-red-400 text-xs text-center">
                  Terjadi kesalahan. Coba lagi.
                </p>
              )}
            </form>

            <p className="text-center text-xs text-gray-600 mt-6">
              Feedbackmu aman dan tidak akan disebarluaskan.
            </p>
          </>
        )}
      </div>
    </main>
  )
}