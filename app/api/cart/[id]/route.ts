import { type NextRequest, NextResponse } from "next/server"
import { getDatabase } from "@/lib/database"
import { getUserFromRequest } from "@/lib/auth"

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = getUserFromRequest(request)
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const cartItemId = Number.parseInt(params.id)
    const { quantity } = await request.json()

    if (isNaN(cartItemId) || !quantity || quantity < 1) {
      return NextResponse.json({ error: "Invalid cart item ID or quantity" }, { status: 400 })
    }

    const db = getDatabase()

    // Verify cart item belongs to user and get product info
    const cartItem = db
      .prepare(`
        SELECT ci.*, p.stock 
        FROM cart_items ci
        JOIN products p ON ci.product_id = p.id
        WHERE ci.id = ? AND ci.user_id = ?
      `)
      .get(cartItemId, user.id)

    if (!cartItem) {
      return NextResponse.json({ error: "Cart item not found" }, { status: 404 })
    }

    // Check stock availability
    if (quantity > (cartItem as any).stock) {
      return NextResponse.json({ error: "Insufficient stock" }, { status: 400 })
    }

    // Update quantity
    db.prepare("UPDATE cart_items SET quantity = ? WHERE id = ? AND user_id = ?").run(quantity, cartItemId, user.id)

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

    const cartItemId = Number.parseInt(params.id)

    if (isNaN(cartItemId)) {
      return NextResponse.json({ error: "Invalid cart item ID" }, { status: 400 })
    }

    const db = getDatabase()

    // Verify cart item belongs to user
    const cartItem = db.prepare("SELECT * FROM cart_items WHERE id = ? AND user_id = ?").get(cartItemId, user.id)

    if (!cartItem) {
      return NextResponse.json({ error: "Cart item not found" }, { status: 404 })
    }

    // Delete cart item
    db.prepare("DELETE FROM cart_items WHERE id = ? AND user_id = ?").run(cartItemId, user.id)

    return NextResponse.json({ message: "Cart item removed successfully" })
  } catch (error) {
    console.error("Remove cart item error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
