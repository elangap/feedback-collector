"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { useRouter } from "next/navigation"

export default function AdminPage() {
  const [feedbacks, setFeedbacks] = useState([])
  const [filtered, setFiltered] = useState([])
  const [loading, setLoading] = useState(true)
  const [authorized, setAuthorized] = useState(false)
  const [search, setSearch] = useState("")
  const [filterRating, setFilterRating] = useState(0)
  const [deletingId, setDeletingId] = useState(null)
  const router = useRouter()

  useEffect(() => {
    async function init() {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) { router.replace("/login"); return }
      setAuthorized(true)
      await fetchFeedbacks()
      setLoading(false)
    }
    init()
  }, [router])

  async function fetchFeedbacks() {
    const { data, error } = await supabase
      .from("feedbacks")
      .select("*")
      .order("created_at", { ascending: false })
    if (!error) {
      setFeedbacks(data)
      setFiltered(data)
    }
  }

  useEffect(() => {
    let result = feedbacks
    if (search) {
      result = result.filter(f =>
        f.name.toLowerCase().includes(search.toLowerCase()) ||
        f.message.toLowerCase().includes(search.toLowerCase())
      )
    }
    if (filterRating > 0) {
      result = result.filter(f => f.rating === filterRating)
    }
    setFiltered(result)
  }, [search, filterRating, feedbacks])

  async function handleDelete(id) {
    setDeletingId(id)
    await supabase.from("feedbacks").delete().eq("id", id)
    await fetchFeedbacks()
    setDeletingId(null)
  }

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push("/login")
  }

  const avgRating = feedbacks.length
    ? (feedbacks.reduce((sum, f) => sum + (f.rating || 0), 0) / feedbacks.filter(f => f.rating).length).toFixed(1)
    : 0

  const todayCount = feedbacks.filter(f =>
    new Date(f.created_at).toDateString() === new Date().toDateString()
  ).length

  if (!authorized || loading) {
    return (
      <main className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-gray-700 border-t-blue-500 rounded-full animate-spin" />
          <p className="text-sm text-gray-500">Memuat dashboard...</p>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gray-950 p-6">
      <div className="max-w-3xl mx-auto">

        <div className="flex justify-between items-start mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <span className="text-xs text-gray-500 uppercase tracking-widest font-semibold">Dashboard</span>
            </div>
            <h1 className="text-3xl font-bold text-white">Feedback Center</h1>
          </div>
          <button
            onClick={handleLogout}
            className="text-xs text-gray-500 hover:text-red-400 font-medium transition px-3 py-2 rounded-lg hover:bg-red-400/10"
          >
            Keluar
          </button>
        </div>

        <div className="grid grid-cols-3 gap-3 mb-6">
          {[
            { label: "Total Feedback", value: feedbacks.length, icon: "💬", color: "blue" },
            { label: "Rata-rata Rating", value: `${avgRating} ⭐`, icon: "⭐", color: "yellow" },
            { label: "Hari Ini", value: todayCount, icon: "📅", color: "green" },
          ].map((stat) => (
            <div key={stat.label} className="bg-gray-900 rounded-2xl p-4 border border-gray-800">
              <p className="text-xs text-gray-500 mb-1">{stat.label}</p>
              <p className="text-2xl font-bold text-white">{stat.value}</p>
            </div>
          ))}
        </div>

        <div className="flex gap-3 mb-6">
          <input
            type="text"
            placeholder="Cari nama atau pesan..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 bg-gray-900 border border-gray-800 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
          />
          <div className="flex gap-1">
            {[0, 1, 2, 3, 4, 5].map((r) => (
              <button
                key={r}
                onClick={() => setFilterRating(r)}
                className={`px-3 py-2 rounded-xl text-xs font-semibold transition ${filterRating === r ? "bg-blue-600 text-white" : "bg-gray-900 text-gray-500 border border-gray-800 hover:border-gray-600"}`}
              >
                {r === 0 ? "Semua" : `${r}⭐`}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-3">
          {filtered.length === 0 ? (
            <div className="bg-gray-900 rounded-2xl p-8 border border-gray-800 text-center">
              <p className="text-gray-500 text-sm">Tidak ada feedback ditemukan.</p>
            </div>
          ) : (
            filtered.map((item) => (
              <div
                key={item.id}
                className={`bg-gray-900 rounded-2xl p-5 border border-gray-800 hover:border-gray-600 transition-all duration-200 ${deletingId === item.id ? "opacity-0 scale-95" : "opacity-100"}`}
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
                      <span className="text-white text-xs font-bold">
                        {item.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <p className="font-semibold text-white text-sm">{item.name}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(item.created_at).toLocaleString("id-ID")}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {item.rating && (
                      <span className="text-xs bg-yellow-500/10 text-yellow-400 px-2 py-1 rounded-lg font-medium">
                        {"⭐".repeat(item.rating)}
                      </span>
                    )}
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="text-xs text-gray-600 hover:text-red-400 transition px-2 py-1 rounded-lg hover:bg-red-400/10"
                    >
                      Hapus
                    </button>
                  </div>
                </div>
                <p className="text-gray-400 text-sm leading-relaxed pl-11">
                  {item.message}
                </p>
              </div>
            ))
          )}
        </div>

      </div>
    </main>
  )
}