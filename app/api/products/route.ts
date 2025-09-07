import { type NextRequest, NextResponse } from "next/server"
import { getDatabase } from "@/lib/database"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get("category")
    const minPrice = searchParams.get("minPrice")
    const maxPrice = searchParams.get("maxPrice")
    const search = searchParams.get("search")
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "12")
    const offset = (page - 1) * limit

    const db = getDatabase()

    // Build dynamic query with filters
    let query = "SELECT * FROM products WHERE 1=1"
    const params: any[] = []

    if (category && category !== "all") {
      query += " AND category = ?"
      params.push(category)
    }

    if (minPrice) {
      query += " AND price >= ?"
      params.push(Number.parseFloat(minPrice))
    }

    if (maxPrice) {
      query += " AND price <= ?"
      params.push(Number.parseFloat(maxPrice))
    }

    if (search) {
      query += " AND (name LIKE ? OR description LIKE ?)"
      params.push(`%${search}%`, `%${search}%`)
    }

    // Add ordering and pagination
    query += " ORDER BY created_at DESC LIMIT ? OFFSET ?"
    params.push(limit, offset)

    const products = db.prepare(query).all(...params)

    // Get total count for pagination
    let countQuery = "SELECT COUNT(*) as total FROM products WHERE 1=1"
    const countParams: any[] = []

    if (category && category !== "all") {
      countQuery += " AND category = ?"
      countParams.push(category)
    }

    if (minPrice) {
      countQuery += " AND price >= ?"
      countParams.push(Number.parseFloat(minPrice))
    }

    if (maxPrice) {
      countQuery += " AND price <= ?"
      countParams.push(Number.parseFloat(maxPrice))
    }

    if (search) {
      countQuery += " AND (name LIKE ? OR description LIKE ?)"
      countParams.push(`%${search}%`, `%${search}%`)
    }

    const { total } = db.prepare(countQuery).get(...countParams) as { total: number }

    // Get available categories
    const categories = db.prepare("SELECT DISTINCT category FROM products ORDER BY category").all()

    return NextResponse.json({
      products,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
      categories: categories.map((c: any) => c.category),
    })
  } catch (error) {
    console.error("Products fetch error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
