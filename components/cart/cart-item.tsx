"use client"

import { useState } from "react"
import Image from "next/image"
import { Minus, Plus, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { CartItem } from "@/lib/types"
import { formatPrice, validateCartQuantity } from "@/lib/cart-utils"
import { LottieSafeWrapper } from "../ui/lottie-safe-wrapper"
import Button2 from "../ui/button2"

interface CartItemProps {
  item: CartItem
  onUpdateQuantity: (itemId: number, quantity: number) => void
  onRemoveItem: (itemId: number) => void
}
export function CartItemComponent({ item, onUpdateQuantity, onRemoveItem }: CartItemProps) {
  const [isUpdating, setIsUpdating] = useState(false)
  const [isRemoving, setIsRemoving] = useState(false)
  const handleQuantityChange = async (newQuantity: number) => {
    if (!validateCartQuantity(newQuantity, item.stock || 0)) return
    setIsUpdating(true)
    try {
      await onUpdateQuantity(item.id, newQuantity)
    } finally {
      setIsUpdating(false)
    }
  }
  const handleRemove = async () => {
    setIsRemoving(true)
    try {
      await onRemoveItem(item.id)
    } finally {
      setIsRemoving(false)
    }
  }
  const itemTotal = (item.price || 0) * item.quantity
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-4">
        <div className="flex gap-4">
          <div className="relative w-20 h-20 flex-shrink-0 rounded-md overflow-hidden">
            <Image
              src={item.image_url || "/placeholder.svg"}
              alt={item.name || "Product"}
              fill
              className="object-cover"
            />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="font-semibold text-black line-clamp-1">{item.name}</h3>
                <p className=" text-black line-clamp-2">{item.description}</p>
                <Badge variant="black" className="mt-1">
                  {item.category}
                </Badge>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleRemove}
                disabled={isRemoving}
                className="text-black hover:text-black hover:bg-destructive/10 relative right-15"
              >
                <Button2/>
              </Button>
            </div>
            <div className="flex items-center justify-between relative right-5">
              <div className="flex items-center gap-4 relative left-5">
                <span className="font-semibold text-[#0D3B66]">{formatPrice(item.price || 0)}</span>
                <span className="text-black ">Stock: {item.stock}</span>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="action"
                  size="icon"
                  onClick={() => handleQuantityChange(item.quantity - 1)}
                  disabled={item.quantity <= 1 || isUpdating}
                  className="h-8 w-8"
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="w-8 text-center font-medium">{item.quantity}</span>
                <Button
                  variant="antiblack"
                  size="icon"
                  onClick={() => handleQuantityChange(item.quantity + 1)}
                  disabled={item.quantity >= (item.stock || 0) || isUpdating}
                  className="h-8 w-8"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="mt-3 text-right relative right-5">
              <span className=" text-black">Total: </span>
              <span className="text-black font-bold">{formatPrice(itemTotal)}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}