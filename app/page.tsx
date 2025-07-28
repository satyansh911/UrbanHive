"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import Loader from "@/components/ui/Loader"

export default function HomePage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  useEffect(() => {
    if (!loading) {
      if (user) {
        router.push("/products")
      } else {
        router.push("/login")
      }
    }
  }, [user, loading, router])
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <Loader/>
        <p className="mt-4 text-black">Loading...</p>
      </div>
    </div>
  )
}