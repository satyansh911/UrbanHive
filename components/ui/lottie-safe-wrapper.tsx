"use client"

import type React from "react"
import { useState, useEffect, Suspense } from "react"

interface LottieSafeWrapperProps {
  src: string
  size?: number
  autoplay?: boolean
  loop?: boolean
  fallbackIcon?: string
  className?: string
}

export const LottieSafeWrapper: React.FC<LottieSafeWrapperProps> = ({
  src,
  size = 24,
  autoplay = true,
  loop = true,
  fallbackIcon = "⚡",
  className = "",
}) => {
  const [Player, setPlayer] = useState<any>(null)
  const [isMounted, setIsMounted] = useState(false)
  const [hasError, setHasError] = useState(false)

  useEffect(() => {
    const loadPlayer = async () => {
      try {
        // Only load on client side
        if (typeof window !== "undefined") {
          const { Player: LottiePlayer } = await import("@lottiefiles/react-lottie-player")
          setPlayer(() => LottiePlayer)
        }
      } catch (error) {
        console.error("Failed to load Lottie player:", error)
        setHasError(true)
      } finally {
        setIsMounted(true)
      }
    }

    loadPlayer()
  }, [])

  const FallbackComponent = () => (
    <div
      style={{ height: size, width: size }}
      className={`flex items-center justify-center bg-muted/20 rounded-lg ${hasError ? "" : "animate-pulse"} ${className}`}
    >
      <span style={{ fontSize: size * 0.6 }} className="text-muted-foreground">
        {fallbackIcon}
      </span>
    </div>
  )

  // Always show fallback during SSR or if Player failed to load
  if (!isMounted || !Player || hasError) {
    return <FallbackComponent />
  }

  return (
    <Suspense fallback={<FallbackComponent />}>
      <Player
        autoplay={autoplay}
        loop={loop}
        src={src}
        style={{ height: size, width: size }}
        className={className}
        onError={() => setHasError(true)}
      />
    </Suspense>
  )
}
