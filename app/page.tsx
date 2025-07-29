"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { Grid } from 'ldrs/react';
import 'ldrs/react/Grid.css'
import Loading from "@/components/ui/Loading"

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
        <div className="flex items-center justify-center min-h-screen">
          <Loading/>
        </div>
        <p className="mt-4 text-black">Loading...</p>
      </div>
    </div>
  )
}