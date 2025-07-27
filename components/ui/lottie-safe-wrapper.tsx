import * as React from "react"
import { useState, useEffect, Suspense } from "react"

interface LottieSafeWrapperProps {
  src: string
  size?: number
  autoplay?: boolean
  loop?: boolean
  fallbackIcon?: string
  className?: string
  lottieRef?: React.Ref<any> // NEW
}

export const LottieSafeWrapper: React.FC<LottieSafeWrapperProps> = ({
  src,
  size = 24,
  autoplay = true,
  loop = true,
  fallbackIcon = "⚡",
  className = "",
  lottieRef, // NEW
}) => {
  const [Player, setPlayer] = useState<any>(null)
  const [isMounted, setIsMounted] = useState(false)
  const [hasError, setHasError] = useState(false)

  useEffect(() => {
    async function loadPlayer() {
      try {
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
      <span style={{ fontSize: size * 0.6 }} className="text-black">
        {fallbackIcon}
      </span>
    </div>
  )

  if (!isMounted || !Player || hasError) {
    return <FallbackComponent />
  }

  return (
    <Suspense fallback={<FallbackComponent />}>
      <Player
        ref={lottieRef} // Pass it down to the underlying Player
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
