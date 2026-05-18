"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { useRouter } from "next/navigation"

export default function AdminPage() {
  const [feedbacks, setFeedbacks] = useState([])
  const [loading, setLoading] = useState(true)
  const [authorized, setAuthorized] = useState(false)
  const router = useRouter()

  useEffect(() => {
    async function init() {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        router.replace("/login")
        return
      }
      setAuthorized(true)
      const { data, error } = await supabase
        .from("feedbacks")
        .select("*")
        .order("created_at", { ascending: false })
      if (!error) setFeedbacks(data)
      setLoading(false)
    }
    init()
  }, [router])

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push("/login")
  }

  if (!authorized || loading) {
    return (
      <main className="min-h-screen bg-[#F7F7F5] flex items-center justify-center">
        <p className="text-sm text-gray-400">Memuat...</p>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-[#F7F7F5] p-6">
      <div className="max-w-2xl mx-auto">

        <div className="flex justify-between items-start mb-8">
          <div>
            <span className="text-xs font-semibold tracking-widest text-gray-400 uppercase">
              Admin
            </span>
            <h1 className="text-3xl font-bold text-gray-900 mt-1">
              Semua Feedback
            </h1>
            <p className="text-gray-500 mt-1 text-sm">
              {feedbacks.length} feedback masuk
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="text-xs text-gray-400 hover:text-gray-700 font-medium transition mt-1"
          >
            Keluar
          </button>
        </div>

        {feedbacks.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 text-center">
            <p className="text-gray-400 text-sm">Belum ada feedback masuk.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {feedbacks.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200"
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-gray-900 flex items-center justify-center">
                      <span className="text-white text-xs font-semibold">
                        {item.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <p className="font-semibold text-gray-900 text-sm">
                      {item.name}
                    </p>
                  </div>
                  <p className="text-xs text-gray-400">
                    {new Date(item.created_at).toLocaleString("id-ID")}
                  </p>
                </div>
                <p className="text-gray-600 text-sm leading-relaxed pl-9">
                  {item.message}
                </p>
              </div>
            ))}
          </div>
        )}

      </div>
    </main>
  )
}