import type { Database } from "better-sqlite3"
import path from "path"

let db: Database | null = null

export function getDatabase() {
  if (!db) {
    const dbPath = path.join(process.cwd(), "ecommerce.db")
    const Database = require("better-sqlite3")
    db = new Database(dbPath)

    // Initialize tables
    initializeTables()
  }
  return db
}

function initializeTables() {
  if (!db) return

  // Users table
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      name TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `)

  // Products table
  db.exec(`
    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      description TEXT,
      price DECIMAL(10,2) NOT NULL,
      category TEXT NOT NULL,
      image_url TEXT,
      stock INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `)

  // Cart items table
  db.exec(`
    CREATE TABLE IF NOT EXISTS cart_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      product_id INTEGER NOT NULL,
      quantity INTEGER NOT NULL DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users (id),
      FOREIGN KEY (product_id) REFERENCES products (id),
      UNIQUE(user_id, product_id)
    )
  `)

  // Insert sample products
  const insertProduct = db.prepare(`
    INSERT OR IGNORE INTO products (name, description, price, category, image_url, stock)
    VALUES (?, ?, ?, ?, ?, ?)
  `)

  const sampleProducts = [
    [
      "Wireless Headphones",
      "High-quality wireless headphones with noise cancellation",
      199.99,
      "Electronics",
      "/wireless-headphones.png",
      50,
    ],
    [
      "Smartphone",
      "Latest smartphone with advanced camera features",
      699.99,
      "Electronics",
      "/modern-smartphone.png",
      30,
    ],
    [
      "Running Shoes",
      "Comfortable running shoes for daily exercise",
      89.99,
      "Sports",
      "/running-shoes-on-track.png",
      100,
    ],
    [
      "Coffee Maker",
      "Automatic coffee maker with programmable settings",
      149.99,
      "Home",
      "/modern-coffee-maker.png",
      25,
    ],
    [
      "Laptop Backpack",
      "Durable laptop backpack with multiple compartments",
      59.99,
      "Accessories",
      "/laptop-backpack.png",
      75,
    ],
    [
      "Fitness Tracker",
      "Smart fitness tracker with heart rate monitoring",
      129.99,
      "Electronics",
      "/fitness-tracker-lifestyle.png",
      40,
    ],
    ["Desk Lamp", "LED desk lamp with adjustable brightness", 39.99, "Home", "/modern-desk-lamp.png", 60],
    ["Water Bottle", "Insulated stainless steel water bottle", 24.99, "Sports", "/reusable-water-bottle.png", 120],
  ]

  sampleProducts.forEach((product) => {
    insertProduct.run(...product)
  })
}
