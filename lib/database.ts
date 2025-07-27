import mongoose from "mongoose"

let isConnected = false

export async function connectToDatabase() {
  if (isConnected) {
    return
  }
  try {
    const mongoUri = process.env.MONGODB_URI
    if (!mongoUri) {
      throw new Error("MONGODB_URI environment variable is not set")
    }
    await mongoose.connect(mongoUri)
    isConnected = true
    console.log("Connected to MongoDB")
  } catch (error) {
    console.error("MongoDB connection error:", error)
    throw error
  }
}
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
})
const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  price: { type: Number, required: true },
  category: { type: String, required: true },
  imageUrl: { type: String },
  gifUrl: { type: String },
  stock: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
})
const cartItemSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
  quantity: { type: Number, required: true, default: 1 },
  createdAt: { type: Date, default: Date.now },
})
cartItemSchema.index({ userId: 1, productId: 1 }, { unique: true })
export const User = mongoose.models.User || mongoose.model("User", userSchema)
export const Product = mongoose.models.Product || mongoose.model("Product", productSchema)
export const CartItem = mongoose.models.CartItem || mongoose.model("CartItem", cartItemSchema)
export async function initializeSampleData() {
  try {
    await connectToDatabase()
    const existingProducts = await Product.countDocuments()
    if (existingProducts > 0) {
      return
    }
    const sampleProducts = [
      {
        name: "Wireless Headphones",
        description: "High-quality wireless headphones with noise cancellation",
        price: 199.99,
        category: "Electronics",
        imageUrl: "/wireless-headphones.png",
        stock: 50,
      },
      {
        name: "Smartphone",
        description: "Latest smartphone with advanced camera features",
        price: 699.99,
        category: "Electronics",
        imageUrl: "/modern-smartphone.png",
        stock: 30,
      },
      {
        name: "Running Shoes",
        description: "Comfortable running shoes for daily exercise",
        price: 89.99,
        category: "Sports",
        imageUrl: "/Bally_shoe_animation.png",
        stock: 100,
      },
      {
        name: "Coffee Maker",
        description: "Automatic coffee maker with programmable settings",
        price: 149.99,
        category: "Home",
        imageUrl: "/modern-coffee-maker.png",
        stock: 25,
      },
      {
        name: "Laptop Backpack",
        description: "Durable laptop backpack with multiple compartments",
        price: 59.99,
        category: "Accessories",
        imageUrl: "/laptop-backpack.png",
        stock: 75,
      },
      {
        name: "Fitness Tracker",
        description: "Smart fitness tracker with heart rate monitoring",
        price: 129.99,
        category: "Electronics",
        imageUrl: "/fitness-tracker-lifestyle.png",
        stock: 40,
      },
      {
        name: "Desk Lamp",
        description: "LED desk lamp with adjustable brightness",
        price: 39.99,
        category: "Home",
        imageUrl: "/modern-desk-lamp.png",
        stock: 60,
      },
      {
        name: "Water Bottle",
        description: "Insulated stainless steel water bottle",
        price: 24.99,
        category: "Sports",
        imageUrl: "/reusable-water-bottle.png",
        stock: 120,
      },
    ]
    await Product.insertMany(sampleProducts)
    console.log("Sample products inserted successfully")
  } catch (error) {
    console.error("Error initializing sample data:", error)
  }
}