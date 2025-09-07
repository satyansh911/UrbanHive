import { type NextRequest, NextResponse } from "next/server"
import { getDatabase } from "@/lib/database"
import { getUserFromRequest } from "@/lib/auth"

export async function GET(request: NextRequest) {
  try {
    const user = getUserFromRequest(request)
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const db = getDatabase()

    // Get cart items with product details
    const cartItems = db
      .prepare(`
        SELECT 
          ci.id,
          ci.quantity,
          ci.created_at,
          p.id as product_id,
          p.name,
          p.description,
          p.price,
          p.category,
          p.image_url,
          p.stock
        FROM cart_items ci
        JOIN products p ON ci.product_id = p.id
        WHERE ci.user_id = ?
        ORDER BY ci.created_at DESC
      `)
      .all(user.id)

    // Calculate totals
    const subtotal = cartItems.reduce((sum: number, item: any) => sum + item.price * item.quantity, 0)
    const itemCount = cartItems.reduce((sum: number, item: any) => sum + item.quantity, 0)

    return NextResponse.json({
      items: cartItems,
      summary: {
        itemCount,
        subtotal: Number(subtotal.toFixed(2)),
        tax: Number((subtotal * 0.08).toFixed(2)), // 8% tax
        total: Number((subtotal * 1.08).toFixed(2)),
      },
    })
  } catch (error) {
    console.error("Cart fetch error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = getUserFromRequest(request)
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { productId, quantity = 1 } = await request.json()

    if (!productId || quantity < 1) {
      return NextResponse.json({ error: "Invalid product ID or quantity" }, { status: 400 })
    }

    const db = getDatabase()

    // Check if product exists and has sufficient stock
    const product = db.prepare("SELECT * FROM products WHERE id = ?").get(productId)
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }

    // Check if item already exists in cart
    const existingItem = db
      .prepare("SELECT * FROM cart_items WHERE user_id = ? AND product_id = ?")
      .get(user.id, productId)

    if (existingItem) {
      // Update quantity
      const newQuantity = (existingItem as any).quantity + quantity
      if (newQuantity > (product as any).stock) {
        return NextResponse.json({ error: "Insufficient stock" }, { status: 400 })
      }

      db.prepare("UPDATE cart_items SET quantity = ? WHERE user_id = ? AND product_id = ?").run(
        newQuantity,
        user.id,
        productId,
      )
    } else {
      // Add new item
      if (quantity > (product as any).stock) {
        return NextResponse.json({ error: "Insufficient stock" }, { status: 400 })
      }

      db.prepare("INSERT INTO cart_items (user_id, product_id, quantity) VALUES (?, ?, ?)").run(
        user.id,
        productId,
        quantity,
      )
    }

    return NextResponse.json({ message: "Item added to cart successfully" })
  } catch (error) {
    console.error("Add to cart error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const user = getUserFromRequest(request)
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const db = getDatabase()
    db.prepare("DELETE FROM cart_items WHERE user_id = ?").run(user.id)

    return NextResponse.json({ message: "Cart cleared successfully" })
  } catch (error) {
    console.error("Clear cart error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
