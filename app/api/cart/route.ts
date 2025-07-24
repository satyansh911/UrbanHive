import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase, CartItem, Product } from "@/lib/database"
import { getUserFromRequest } from "@/lib/auth"

export async function GET(request: NextRequest) {
  try {
    const user = getUserFromRequest(request)
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await connectToDatabase()

    const cartItems = await CartItem.find({ userId: user.id }).populate("productId").sort({ createdAt: -1 }).lean()

    // Transform data to match expected format
    const transformedItems = cartItems.map((item: any) => ({
      id: item._id.toString(),
      quantity: item.quantity,
      created_at: item.createdAt,
      product_id: item.productId._id.toString(),
      name: item.productId.name,
      description: item.productId.description,
      price: item.productId.price,
      category: item.productId.category,
      image_url: item.productId.imageUrl,
      stock: item.productId.stock,
    }))

    // Calculate totals
    const subtotal = transformedItems.reduce((sum: number, item: any) => sum + item.price * item.quantity, 0)
    const itemCount = transformedItems.reduce((sum: number, item: any) => sum + item.quantity, 0)

    return NextResponse.json({
      items: transformedItems,
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

    await connectToDatabase()

    const product = await Product.findById(productId)
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }

    // Check if item already exists in cart
    const existingItem = await CartItem.findOne({ userId: user.id, productId })

    if (existingItem) {
      // Update quantity
      const newQuantity = existingItem.quantity + quantity
      if (newQuantity > product.stock) {
        return NextResponse.json({ error: "Insufficient stock" }, { status: 400 })
      }

      existingItem.quantity = newQuantity
      await existingItem.save()
    } else {
      // Add new item
      if (quantity > product.stock) {
        return NextResponse.json({ error: "Insufficient stock" }, { status: 400 })
      }

      const newCartItem = new CartItem({
        userId: user.id,
        productId,
        quantity,
      })
      await newCartItem.save()
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

    await connectToDatabase()
    await CartItem.deleteMany({ userId: user.id })

    return NextResponse.json({ message: "Cart cleared successfully" })
  } catch (error) {
    console.error("Clear cart error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
