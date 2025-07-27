"use client"

import { useRef, useState } from "react"
import Image from "next/image"
import { ShoppingCart, Plus, Minus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/contexts/auth-context"
import type { Product } from "@/lib/types"
import { formatPrice } from "@/lib/cart-utils"
import { LottieSafeWrapper } from "../ui/lottie-safe-wrapper"

interface ProductCardProps {
  product: Product
  onAddToCart?: (productId: number, quantity: number) => void
}

export function ProductCard({ product, onAddToCart }: ProductCardProps) {
  const [quantity, setQuantity] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const { user } = useAuth()
  const handleAddToCart = async () => {
    if (!user || !onAddToCart) return
    setIsLoading(true)
    try {
      await onAddToCart(product.id, quantity)
      setQuantity(1)
    } finally {
      setIsLoading(false)
    }
  }
  const incrementQuantity = () => {
    if (quantity < product.stock) {
      setQuantity((prev) => prev + 1)
    }
  }
  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1)
    }
  }
  const lottieRef = useRef<any>(null);
  return (
    <Card className="group overflow-hidden transition-all hover:shadow-lg">
      <div className="relative aspect-square overflow-hidden">
        <Image
          src={product.image_url || "/placeholder.svg"}
          alt={product.name}
          fill
          className="object-cover transition-transform group-hover:scale-105"
        />
        <Badge variant="black" className="absolute top-2 right-2">
          {product.category}
        </Badge>
        {product.stock < 10 && product.stock > 0 && (
          <Badge variant="destructive" className="absolute top-2 left-2">
            Only {product.stock} left
          </Badge>
        )}
        {product.stock === 0 && (
          <Badge variant="destructive" className="absolute top-2 left-2">
            Out of Stock
          </Badge>
        )}
      </div>
      <CardContent className="p-4">
        <div className="space-y-2">
          <h3 className="font-semibold text-black line-clamp-1">{product.name}</h3>
          <p className="text-black line-clamp-2">{product.description}</p>
          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold text-primary">{formatPrice(product.price)}</span>
            <span className="text-black">Stock: {product.stock}</span>
          </div>
        </div>
        {user && product.stock > 0 && (
          <div className="mt-4 space-y-3">
            <div className="flex items-center justify-center gap-2">
              <Button
                variant="black"
                size="icon"
                onClick={decrementQuantity}
                disabled={quantity <= 1}
                className="h-8 w-8 bg-transparent"
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="w-8 text-center font-medium">{quantity}</span>
              <Button
                variant="antiblack"
                size="icon"
                onClick={incrementQuantity}
                disabled={quantity >= product.stock}
                className="h-8 w-8"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <Button variant="black" onClick={handleAddToCart} disabled={isLoading || product.stock === 0} className="w-full flex items-center justify-center gap-2" onMouseEnter={() => lottieRef.current?.play()} onMouseLeave={() => lottieRef.current?.stop()}>
              <LottieSafeWrapper
                lottieRef={lottieRef} 
                src="/cart.json"
                size={25}
                autoplay={true}
                loop={false}
                fallbackIcon="🔍"
              />
              {isLoading ? "Adding..." : "Add to Cart"}
            </Button>
          </div>
        )}
        {!user && (
          <div className="mt-4">
            <Button variant="outline" className="w-full bg-transparent" disabled>
              Sign in to purchase
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}