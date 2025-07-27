import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase, User } from "@/lib/database"
import { hashPassword, generateToken } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    const { email, password, name } = await request.json()
    if (!email || !password || !name) {
      return NextResponse.json({ error: "Email, password, and name are required" }, { status: 400 })
    }
    await connectToDatabase()
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return NextResponse.json({ error: "User already exists" }, { status: 400 })
    }
    const hashedPassword = hashPassword(password)
    const newUser = new User({
      email,
      password: hashedPassword,
      name,
    })
    const savedUser = await newUser.save()
    const user = {
      id: savedUser._id.toString(),
      email: savedUser.email,
      name: savedUser.name,
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