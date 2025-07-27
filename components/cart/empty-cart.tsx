import Link from "next/link"
import { ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { LottieSafeWrapper } from "../ui/lottie-safe-wrapper"

export function EmptyCart() {
  return (
    <Card className="text-center py-12">
      <CardContent>
        <div className="flex flex-col items-center space-y-4">
            <LottieSafeWrapper 
              src="/emptyCart.json"
              size={150}
              autoplay={true}
              loop={true}
              fallbackIcon="🔍"
            />
          <div className="space-y-2">
            <h2 className="text-2xl font-semibold">Your cart is empty</h2>
            <p className="text-black max-w-md">
              Looks like you haven't added any items to your cart yet. Start shopping to fill it up!
            </p>
          </div>
          <Button variant="antiblack" asChild size="lg" className="mt-4">
            <Link href="/products">Continue Shopping</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}