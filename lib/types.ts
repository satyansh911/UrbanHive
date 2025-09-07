export interface Product {
  id: number
  name: string
  description: string
  price: number
  category: string
  image_url: string
  stock: number
  created_at: string
}

export interface CartItem {
  id: number
  user_id: number
  product_id: number
  quantity: number
  created_at: string
  // Joined product fields
  name?: string
  description?: string
  price?: number
  category?: string
  image_url?: string
  stock?: number
  product?: Product
}

export interface User {
  id: number
  email: string
  name: string
}

export interface ProductFilters {
  category?: string
  minPrice?: number
  maxPrice?: number
  search?: string
  page?: number
  limit?: number
}

export interface ProductsResponse {
  products: Product[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
  categories: string[]
}

export interface Category {
  category: string
  count: number
  min_price: number
  max_price: number
}

export interface CartSummary {
  itemCount: number
  subtotal: number
  tax: number
  total: number
}

export interface CartResponse {
  items: CartItem[]
  summary: CartSummary
}

export interface AddToCartRequest {
  productId: number
  quantity?: number
}

export interface UpdateCartItemRequest {
  quantity: number
}
