"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import type { CartSummary } from "@/lib/types"
import { formatPrice } from "@/lib/cart-utils"

interface CartSummaryProps {
  summary: CartSummary
  onClearCart: () => void
  onCheckout: () => void
  isLoading?: boolean
}

export function CartSummaryComponent({ summary, onClearCart, onCheckout, isLoading = false }: CartSummaryProps) {
  return (
    <Card className="sticky top-4">
      <CardHeader>
        <CardTitle>Order Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between text-black">
            <span>Items ({summary.itemCount})</span>
            <span>{formatPrice(summary.subtotal)}</span>
          </div>
          <div className="flex justify-between text-black">
            <span>Tax (8%)</span>
            <span>{formatPrice(summary.tax)}</span>
          </div>
          <Separator />
          <div className="flex justify-between font-semibold text-black">
            <span>Total</span>
            <span className="text-primary">{formatPrice(summary.total)}</span>
          </div>
        </div>
        <div className="space-y-2">
          <Button variant="antiblack" onClick={onCheckout} className="w-full" size="lg" disabled={isLoading || summary.itemCount === 0}>
            {isLoading ? "Processing..." : "Proceed to Checkout"}
          </Button>
          <Button
            variant="black"
            onClick={onClearCart}
            className="w-full bg-transparent"
            disabled={isLoading || summary.itemCount === 0}
          >
            Clear Cart
          </Button>
        </div>
        <div className="text-xs text-black text-center">
          <p>Secure checkout with <b>SSL encryption</b></p>
          <br></br>
          <p><i>Free shipping on orders over ₹999</i></p>
        </div>
      </CardContent>
    </Card>
  )
}