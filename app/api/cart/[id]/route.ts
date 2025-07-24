import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase, CartItem } from "@/lib/database"
import { getUserFromRequest } from "@/lib/auth"
import mongoose from "mongoose"

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = getUserFromRequest(request)
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const cartItemId = params.id
    const { quantity } = await request.json()

    if (!mongoose.Types.ObjectId.isValid(cartItemId) || !quantity || quantity < 1) {
      return NextResponse.json({ error: "Invalid cart item ID or quantity" }, { status: 400 })
    }

    await connectToDatabase()

    // Verify cart item belongs to user and get product info
    const cartItem = await CartItem.findOne({ _id: cartItemId, userId: user.id }).populate("productId")

    if (!cartItem) {
      return NextResponse.json({ error: "Cart item not found" }, { status: 404 })
    }

    // Check stock availability
    if (quantity > (cartItem.productId as any).stock) {
      return NextResponse.json({ error: "Insufficient stock" }, { status: 400 })
    }

    // Update quantity
    cartItem.quantity = quantity
    await cartItem.save()

    return NextResponse.json({ message: "Cart item updated successfully" })
  } catch (error) {
    console.error("Update cart item error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = getUserFromRequest(request)
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const cartItemId = params.id

    if (!mongoose.Types.ObjectId.isValid(cartItemId)) {
      return NextResponse.json({ error: "Invalid cart item ID" }, { status: 400 })
    }

    await connectToDatabase()

    const result = await CartItem.deleteOne({ _id: cartItemId, userId: user.id })

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Cart item not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "Cart item removed successfully" })
  } catch (error) {
    console.error("Remove cart item error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
