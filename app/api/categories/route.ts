import { type NextRequest, NextResponse } from "next/server"
import { getDatabase } from "@/lib/database"

export async function GET(request: NextRequest) {
  try {
    const db = getDatabase()

    // Get all unique categories with product counts
    const categories = db
      .prepare(`
      SELECT 
        category,
        COUNT(*) as count,
        MIN(price) as min_price,
        MAX(price) as max_price
      FROM products 
      GROUP BY category 
      ORDER BY category
    `)
      .all()

    // Get overall price range
    const priceRange = db
      .prepare(`
      SELECT 
        MIN(price) as min_price,
        MAX(price) as max_price
      FROM products
    `)
      .get() as { min_price: number; max_price: number }

    return NextResponse.json({
      categories,
      priceRange,
    })
  } catch (error) {
    console.error("Categories fetch error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
