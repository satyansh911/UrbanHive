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
          <div className="flex justify-between text-sm">
            <span>Items ({summary.itemCount})</span>
            <span>{formatPrice(summary.subtotal)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Tax (8%)</span>
            <span>{formatPrice(summary.tax)}</span>
          </div>
          <Separator />
          <div className="flex justify-between font-semibold text-lg">
            <span>Total</span>
            <span className="text-primary">{formatPrice(summary.total)}</span>
          </div>
        </div>

        <div className="space-y-2">
          <Button onClick={onCheckout} className="w-full" size="lg" disabled={isLoading || summary.itemCount === 0}>
            {isLoading ? "Processing..." : "Proceed to Checkout"}
          </Button>
          <Button
            variant="outline"
            onClick={onClearCart}
            className="w-full bg-transparent"
            disabled={isLoading || summary.itemCount === 0}
          >
            Clear Cart
          </Button>
        </div>

        <div className="text-xs text-muted-foreground text-center">
          <p>Secure checkout with SSL encryption</p>
          <p>Free shipping on orders over $50</p>
        </div>
      </CardContent>
    </Card>
  )
}
