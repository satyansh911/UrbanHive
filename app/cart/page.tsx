"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Header } from "@/components/layout/header"
import { CartItemComponent } from "@/components/cart/cart-item"
import { CartSummaryComponent } from "@/components/cart/cart-summary"
import { EmptyCart } from "@/components/cart/empty-cart"
import { useAuth } from "@/contexts/auth-context"
import type { CartItem, CartSummary } from "@/lib/types"

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [cartSummary, setCartSummary] = useState<CartSummary>({
    itemCount: 0,
    subtotal: 0,
    tax: 0,
    total: 0,
  })
  const [loading, setLoading] = useState(true)
  const [isUpdating, setIsUpdating] = useState(false)
  const { user, token } = useAuth()
  const router = useRouter()
  useEffect(() => {
    if (!user && !loading) {
      router.push("/login")
    }
  }, [user, loading, router])
  const fetchCart = useCallback(async () => {
    if (!user || !token) return
    try {
      const response = await fetch("/api/cart", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      if (response.ok) {
        const data = await response.json()
        setCartItems(data.items)
        setCartSummary(data.summary)
      } else {
        toast.error("Failed to load cart")
      }
    } catch (error) {
      console.error("Error fetching cart:", error)
      toast.error("Failed to load cart")
    } finally {
      setLoading(false)
    }
  }, [user, token])
  useEffect(() => {
    fetchCart()
  }, [fetchCart])
  const handleUpdateQuantity = async (itemId: number, quantity: number) => {
    if (!token) return
    setIsUpdating(true)
    try {
      const response = await fetch(`/api/cart/${itemId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ quantity }),
      })
      if (response.ok) {
        await fetchCart()
        toast.success("Cart updated")
      } else {
        const error = await response.json()
        toast.error(error.error || "Failed to update cart")
      }
    } catch (error) {
      console.error("Error updating cart:", error)
      toast.error("Failed to update cart")
    } finally {
      setIsUpdating(false)
    }
  }
  const handleRemoveItem = async (itemId: number) => {
    if (!token) return
    setIsUpdating(true)
    try {
      const response = await fetch(`/api/cart/${itemId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      if (response.ok) {
        await fetchCart()
        toast.success("Item removed from cart")
      } else {
        const error = await response.json()
        toast.error(error.error || "Failed to remove item")
      }
    } catch (error) {
      console.error("Error removing item:", error)
      toast.error("Failed to remove item")
    } finally {
      setIsUpdating(false)
    }
  }
  const handleClearCart = async () => {
    if (!token) return
    setIsUpdating(true)
    try {
      const response = await fetch("/api/cart", {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      if (response.ok) {
        await fetchCart()
        toast.success("Cart cleared")
      } else {
        const error = await response.json()
        toast.error(error.error || "Failed to clear cart")
      }
    } catch (error) {
      console.error("Error clearing cart:", error)
      toast.error("Failed to clear cart")
    } finally {
      setIsUpdating(false)
    }
  }
  const handleCheckout = () => {
    toast.success("Checkout functionality would be implemented here!")
  }
  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header cartItemCount={cartSummary.itemCount} />
        <main className="mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <p className="mt-4 text-black">Loading cart...</p>
            </div>
          </div>
        </main>
      </div>
    )
  }
  if (!user) {
    return null
  }
  return (
    <div className="min-h-screen bg-background">
      <Header cartItemCount={cartSummary.itemCount} />
      <main className="mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-8">
          <Button variant="action" size="icon" asChild>
            <Link href="/products">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Shopping Cart</h1>
            <p className="text-black">
              {cartItems.length === 0 ? "Your cart is empty" : `${cartSummary.itemCount} items in your cart`}
            </p>
          </div>
        </div>
        {cartItems.length === 0 ? (
          <EmptyCart />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((item) => (
                <CartItemComponent
                  key={item.id}
                  item={item}
                  onUpdateQuantity={handleUpdateQuantity}
                  onRemoveItem={handleRemoveItem}
                />
              ))}
            </div>
            <div className="lg:col-span-1">
              <CartSummaryComponent
                summary={cartSummary}
                onClearCart={handleClearCart}
                onCheckout={handleCheckout}
                isLoading={isUpdating}
              />
            </div>
          </div>
        )}
      </main>
    </div>
  )
}