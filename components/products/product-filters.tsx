"use client"

import { useState, useEffect, useCallback } from "react"
import { Search, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

interface ProductFiltersProps {
  categories: string[]
  priceRange: { min: number; max: number }
  onFiltersChange: (filters: {
    search: string
    category: string
    minPrice: number
    maxPrice: number
    sortBy: string
  }) => void
}

export function ProductFilters({ categories, priceRange, onFiltersChange }: ProductFiltersProps) {
  const [search, setSearch] = useState("")
  const [category, setCategory] = useState("all")
  const [priceValues, setPriceValues] = useState([priceRange.min, priceRange.max])
  const [sortBy, setSortBy] = useState("newest")

  const handleFiltersChange = useCallback(() => {
    onFiltersChange({
      search,
      category,
      minPrice: priceValues[0],
      maxPrice: priceValues[1],
      sortBy,
    })
  }, [search, category, priceValues, sortBy, onFiltersChange])

  useEffect(() => {
    handleFiltersChange()
  }, [handleFiltersChange])

  const clearFilters = () => {
    setSearch("")
    setCategory("all")
    setPriceValues([priceRange.min, priceRange.max])
    setSortBy("newest")
  }

  const hasActiveFilters =
    search ||
    category !== "all" ||
    priceValues[0] !== priceRange.min ||
    priceValues[1] !== priceRange.max ||
    sortBy !== "newest"

  return (
    <Card className="sticky top-4">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Filters</CardTitle>
          {hasActiveFilters && (
            <Button variant="ghost" size="sm" onClick={clearFilters}>
              <X className="h-4 w-4 mr-1" />
              Clear
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Search */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Search Products</label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <Separator />

        {/* Category Filter */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Category</label>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Separator />

        {/* Price Range */}
        <div className="space-y-4">
          <label className="text-sm font-medium">Price Range</label>
          <div className="px-2">
            <Slider
              value={priceValues}
              onValueChange={setPriceValues}
              min={priceRange.min}
              max={priceRange.max}
              step={10}
              className="w-full"
            />
          </div>
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>${priceValues[0]}</span>
            <span>${priceValues[1]}</span>
          </div>
        </div>

        <Separator />

        {/* Sort By */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Sort By</label>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger>
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest First</SelectItem>
              <SelectItem value="price-low">Price: Low to High</SelectItem>
              <SelectItem value="price-high">Price: High to Low</SelectItem>
              <SelectItem value="name">Name A-Z</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Active Filters */}
        {hasActiveFilters && (
          <>
            <Separator />
            <div className="space-y-2">
              <label className="text-sm font-medium">Active Filters</label>
              <div className="flex flex-wrap gap-2">
                {search && <Badge variant="secondary">Search: {search}</Badge>}
                {category !== "all" && <Badge variant="secondary">Category: {category}</Badge>}
                {(priceValues[0] !== priceRange.min || priceValues[1] !== priceRange.max) && (
                  <Badge variant="secondary">
                    ${priceValues[0]} - ${priceValues[1]}
                  </Badge>
                )}
                {sortBy !== "newest" && <Badge variant="secondary">Sort: {sortBy}</Badge>}
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}
