"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Header } from "@/components/layout/header"
import { ProductFilters } from "@/components/products/product-filters"
import { ProductGrid } from "@/components/products/product-grid"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { useAuth } from "@/contexts/auth-context"
import type { Product, ProductsResponse } from "@/lib/types"

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<string[]>([])
  const [priceRange, setPriceRange] = useState({ min: 0, max: 1000 })
  const [pagination, setPagination] = useState({ page: 1, limit: 12, total: 0, totalPages: 0 })
  const [loading, setLoading] = useState(true)
  const [cartItemCount, setCartItemCount] = useState(0)
  const [filters, setFilters] = useState({
    search: "",
    category: "all",
    minPrice: 0,
    maxPrice: 1000,
    sortBy: "newest",
  })
  const { user, token } = useAuth()
  const router = useRouter()
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("/api/categories")
        const data = await response.json()
        setCategories(data.categories.map((c: any) => c.category))
        setPriceRange(data.priceRange)
        setFilters((prev) => ({
          ...prev,
          minPrice: data.priceRange.min,
          maxPrice: data.priceRange.max,
        }))
      } catch (error) {
        console.error("Error fetching categories:", error)
      }
    }
    fetchCategories()
  }, [])
  const fetchProducts = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
        ...(filters.search && { search: filters.search }),
        ...(filters.category !== "all" && { category: filters.category }),
        ...(filters.minPrice !== priceRange.min && { minPrice: filters.minPrice.toString() }),
        ...(filters.maxPrice !== priceRange.max && { maxPrice: filters.maxPrice.toString() }),
      })
      const response = await fetch(`/api/products?${params}`)
      const data: ProductsResponse = await response.json()
      const sortedProducts = [...data.products]
      switch (filters.sortBy) {
        case "price-low":
          sortedProducts.sort((a, b) => a.price - b.price)
          break
        case "price-high":
          sortedProducts.sort((a, b) => b.price - a.price)
          break
        case "name":
          sortedProducts.sort((a, b) => a.name.localeCompare(b.name))
          break
        default:
          break
      }
      setProducts(sortedProducts)
      setPagination(data.pagination)
    } catch (error) {
      console.error("Error fetching products:", error)
      toast.error("Failed to load products")
    } finally {
      setLoading(false)
    }
  }, [filters, pagination.page, pagination.limit, priceRange])
  const fetchCartCount = useCallback(async () => {
    if (!user || !token) return
    try {
      const response = await fetch("/api/cart", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      const data = await response.json()
      setCartItemCount(data.summary?.itemCount || 0)
    } catch (error) {
      console.error("Error fetching cart count:", error)
    }
  }, [user, token])
  useEffect(() => {
    fetchProducts()
  }, [fetchProducts])
  useEffect(() => {
    fetchCartCount()
  }, [fetchCartCount])
  const handleFiltersChange = useCallback((newFilters: typeof filters) => {
    setFilters(newFilters)
    setPagination((prev) => ({ ...prev, page: 1 }))
  }, [])
  const handleAddToCart = async (productId: number, quantity: number) => {
    if (!user || !token) {
      router.push("/login")
      return
    }
    try {
      const response = await fetch("/api/cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ productId, quantity }),
      })
      if (response.ok) {
        toast.success("Product added to cart!")
        fetchCartCount()
      } else {
        const error = await response.json()
        toast.error(error.error || "Failed to add to cart")
      }
    } catch (error) {
      console.error("Error adding to cart:", error)
      toast.error("Failed to add to cart")
    }
  }
  const handlePageChange = (page: number) => {
    setPagination((prev) => ({ ...prev, page }))
    window.scrollTo({ top: 0, behavior: "smooth" })
  }
  return (
    <div className="min-h-screen bg-background">
      <Header cartItemCount={cartItemCount} />
      <main className="mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          <aside className="lg:w-80 flex-shrink-0">
            <ProductFilters categories={categories} priceRange={priceRange} onFiltersChange={handleFiltersChange} />
          </aside>
          <div className="flex-1">
            <div className="mb-6">
              <h1 className="text-3xl font-bold mb-2">Products</h1>
              <p className="text-black">{loading ? "Loading..." : `${pagination.total} products found`}</p>
            </div>
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="bg-muted rounded-lg aspect-square mb-4"></div>
                    <div className="space-y-2">
                      <div className="h-4 bg-muted rounded w-3/4"></div>
                      <div className="h-3 bg-muted rounded w-1/2"></div>
                      <div className="h-6 bg-muted rounded w-1/4"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <>
                <ProductGrid products={products} onAddToCart={handleAddToCart} />
                {pagination.totalPages > 1 && (
                  <div className="mt-8 flex justify-center">
                    <Pagination>
                      <PaginationContent>
                        <PaginationItem>
                          <PaginationPrevious
                            onClick={() => handlePageChange(pagination.page - 1)}
                            className={pagination.page <= 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                          />
                        </PaginationItem>
                        {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((page) => (
                          <PaginationItem key={page}>
                            <PaginationLink
                              onClick={() => handlePageChange(page)}
                              isActive={page === pagination.page}
                              className="cursor-pointer"
                            >
                              {page}
                            </PaginationLink>
                          </PaginationItem>
                        ))}
                        <PaginationItem>
                          <PaginationNext
                            onClick={() => handlePageChange(pagination.page + 1)}
                            className={
                              pagination.page >= pagination.totalPages
                                ? "pointer-events-none opacity-50"
                                : "cursor-pointer"
                            }
                          />
                        </PaginationItem>
                      </PaginationContent>
                    </Pagination>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}