"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ShoppingCart, User, LogOut, Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/contexts/auth-context"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { LottieSafeWrapper } from "../ui/lottie-safe-wrapper"

interface HeaderProps {
  cartItemCount?: number
}

export function Header({ cartItemCount = 0 }: HeaderProps) {
  const { user, logout } = useAuth()
  const router = useRouter()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const handleLogout = () => {
    logout()
    router.push("/login")
  }
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link href="/products" className="flex items-center space-x-2">
            <LottieSafeWrapper 
              src="/logo.json"
              size={60}
              autoplay={true}
              loop={true}
              fallbackIcon="🔍"
            />
            <span className="font-bold text-xl">UrbanHive</span>
          </Link>
          <nav className="hidden md:flex items-center space-x-6">
            <Link href="/products" className="text-black hover:text-primary transition-colors">
              Products
            </Link>
          </nav>
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <Button variant="action" size="icon" asChild className="relative">
                  <Link href="/cart">
                    <LottieSafeWrapper 
                      src="/cart.json"
                      size={30}
                      autoplay={true}
                      loop={true}
                      fallbackIcon="🔍"
                    />
                    {cartItemCount > 0 && (
                      <Badge
                        variant="destructive"
                        className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs"
                      >
                        {cartItemCount}
                      </Badge>
                    )}
                  </Link>
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="action" size="icon">
                      <LottieSafeWrapper 
                        src="/user.json"
                        size={30}
                        autoplay={true}
                        loop={true}
                        fallbackIcon="🔍"
                      />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <div className="px-2 py-1.5 text-black font-medium">{user.name}</div>
                    <div className="px-2 py-1.5 text-xs text-black">{user.email}</div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout}>
                      <LottieSafeWrapper 
                        src="/logout.json"
                        size={30}
                        autoplay={true}
                        loop={true}
                        fallbackIcon="🔍"
                      />
                      Sign out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <div className="flex items-center space-x-2">
                <Button variant="antiblack" asChild>
                  <Link href="/login">Sign In</Link>
                </Button>
                <Button variant="antiblack" asChild>
                  <Link href="/signup">Sign Up</Link>
                </Button>
              </div>
            )}
            <Button
              variant="antiblack"
              size="icon"
              className="md:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>
        {isMobileMenuOpen && (
          <div className="md:hidden border-t py-4">
            <nav className="flex flex-col space-y-2">
              <Link
                href="/products"
                className="px-2 py-2 text-black hover:text-primary transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Products
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}