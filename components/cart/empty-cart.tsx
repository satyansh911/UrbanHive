import Link from "next/link"
import { ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export function EmptyCart() {
  return (
    <Card className="text-center py-12">
      <CardContent>
        <div className="flex flex-col items-center space-y-4">
          <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center">
            <ShoppingCart className="w-12 h-12 text-muted-foreground" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-semibold">Your cart is empty</h2>
            <p className="text-muted-foreground max-w-md">
              Looks like you haven't added any items to your cart yet. Start shopping to fill it up!
            </p>
          </div>
          <Button asChild size="lg" className="mt-4">
            <Link href="/products">Continue Shopping</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
