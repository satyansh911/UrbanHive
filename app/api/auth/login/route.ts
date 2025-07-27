import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase, User } from "@/lib/database"
import { verifyPassword, generateToken } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()
    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 })
    }
    await connectToDatabase()
    const user = await User.findOne({ email })
    if(!user){
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }
    if (!verifyPassword(password, user.password)) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }
    const userResponse = {
      id: user._id.toString(),
      email: user.email,
      name: user.name,
    }
    const token = generateToken(userResponse)
    return NextResponse.json({
      user: userResponse,
      token,
    })
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}