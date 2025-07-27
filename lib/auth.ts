import jwt from "jsonwebtoken"
import bcrypt from "bcryptjs"
import type { NextRequest } from "next/server"

if (!process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET is not set in environment variables")
}
const JWT_SECRET = process.env.JWT_SECRET
export interface User {
  id: number
  email: string
  name: string
}
export function hashPassword(password: string): string {
  return bcrypt.hashSync(password, 10)
}
export function verifyPassword(password: string, hashedPassword: string): boolean {
  return bcrypt.compareSync(password, hashedPassword)
}
export function generateToken(user: User): string {
  return jwt.sign({ id: user.id, email: user.email, name: user.name }, JWT_SECRET, { expiresIn: "7d" })
}
export function verifyToken(token: string): User | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as User
    return decoded
  } catch (error) {
    return null
  }
}
export function getUserFromRequest(request: NextRequest): User | null {
  const authHeader = request.headers.get("authorization")
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return null
  }
  const token = authHeader.substring(7)
  return verifyToken(token)
}