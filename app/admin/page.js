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

  if (!authorized || loading) {
    return <p className="p-8 text-gray-500">Memuat...</p>
  }

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">
          Admin - Semua Feedback
        </h1>
        {feedbacks.length === 0 ? (
          <p className="text-gray-500">Belum ada feedback masuk.</p>
        ) : (
          <div className="flex flex-col gap-4">
            {feedbacks.map((item) => (
              <div key={item.id} className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                <div className="flex justify-between items-start mb-2">
                  <p className="font-semibold text-gray-800">{item.name}</p>
                  <p className="text-xs text-gray-400">
                    {new Date(item.created_at).toLocaleString("id-ID")}
                  </p>
                </div>
                <p className="text-gray-600 text-sm">{item.message}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}