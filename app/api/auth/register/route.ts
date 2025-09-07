import { type NextRequest, NextResponse } from "next/server"
import { getDatabase } from "@/lib/database"
import { hashPassword, generateToken } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    const { email, password, name } = await request.json()

    if (!email || !password || !name) {
      return NextResponse.json({ error: "Email, password, and name are required" }, { status: 400 })
    }

    const db = getDatabase()

    // Check if user already exists
    const existingUser = db.prepare("SELECT id FROM users WHERE email = ?").get(email)
    if (existingUser) {
      return NextResponse.json({ error: "User already exists" }, { status: 400 })
    }

    // Create new user
    const hashedPassword = hashPassword(password)
    const result = db
      .prepare(`
      INSERT INTO users (email, password, name)
      VALUES (?, ?, ?)
    `)
      .run(email, hashedPassword, name)

    const user = {
      id: result.lastInsertRowid as number,
      email,
      name,
    }

    const token = generateToken(user)

    return NextResponse.json({
      user,
      token,
    })
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
