import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase, Product } from "@/lib/database"

export async function GET(request: NextRequest) {
  try {
    await connectToDatabase()

    const categories = await Product.aggregate([
      {
        $group: {
          _id: "$category",
          count: { $sum: 1 },
          min_price: { $min: "$price" },
          max_price: { $max: "$price" },
        },
      },
      {
        $project: {
          category: "$_id",
          count: 1,
          min_price: 1,
          max_price: 1,
          _id: 0,
        },
      },
      { $sort: { category: 1 } },
    ])

    // Get overall price range
    const priceRange = await Product.aggregate([
      {
        $group: {
          _id: null,
          min_price: { $min: "$price" },
          max_price: { $max: "$price" },
        },
      },
    ])

    return NextResponse.json({
      categories,
      priceRange: priceRange[0] || { min_price: 0, max_price: 0 },
    })
  } catch (error) {
    console.error("Categories fetch error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
