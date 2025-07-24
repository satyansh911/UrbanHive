import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase, Product } from "@/lib/database"
import mongoose from "mongoose"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const productId = params.id

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return NextResponse.json({ error: "Invalid product ID" }, { status: 400 })
    }

    await connectToDatabase()
    const product = await Product.findById(productId).lean()

    if (!product || Array.isArray(product)) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }

    return NextResponse.json({
      product: {
        ...product,
        id: (product as { _id: mongoose.Types.ObjectId })._id.toString(),
        image_url: (product as any).imageUrl,
      },
    })
  } catch (error) {
    console.error("Product fetch error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
