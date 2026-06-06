"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useTheme } from "next-themes"
import {
  Menu,
  X,
  Search,
  Sun,
  Moon,
  MessageCircle,
  User,
  LogOut,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { triggerSellBikeModal } from "@/components/sell-bike-modal"
import { useAuth } from "@/components/providers/auth-provider"

const navLinks = [
  { name: "Home", href: "/" },
  { name: "Buy Bikes", href: "/#featured" },
  { name: "Sell Bike", href: "#", openSellModal: true },
  { name: "Exchange", href: "/#exchange" },
  { name: "Contact", href: "/#contact" },
]

interface NavbarProps {
  minimalAuth?: boolean
}

export function Navbar({ minimalAuth = false }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const { theme, setTheme } = useTheme()
  const router = useRouter()
  const { user, isAuthenticated, logout, loading } = useAuth()

  const handleWhatsApp = () => {
    window.open(
      "https://wa.me/919676499794?text=Hi! I'm interested in bikes at AK Bikes",
      "_blank"
    )
  }

  const handleLogout = () => {
    logout()
    setIsOpen(false)
    router.push("/")
  }

  const firstName = user?.name?.split(" ")[0] || "User"

  const authButtons = (
    <>
      {loading ? (
        <div className="h-9 w-24 rounded-md bg-muted animate-pulse" />
      ) : isAuthenticated && user ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="gap-2 h-10 px-3 hover:bg-secondary max-w-[200px]"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary shrink-0">
                <User className="h-4 w-4" />
              </div>
              <div className="hidden sm:flex flex-col items-start leading-tight min-w-0">
                <span className="text-[10px] text-muted-foreground">Hello,</span>
                <span className="text-sm font-semibold truncate max-w-[120px]">
                  {firstName}
                </span>
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-52">
            <div className="px-3 py-2 border-b border-border">
              <p className="text-sm font-semibold truncate">{user.name}</p>
              <p className="text-xs text-muted-foreground truncate">{user.email}</p>
            </div>
            <DropdownMenuItem asChild>
              <Link href="/profile">My Profile</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/#featured">Browse Bikes</Link>
            </DropdownMenuItem>
            {user.role === "admin" && (
              <DropdownMenuItem asChild>
                <Link href="/admin">Admin Dashboard</Link>
              </DropdownMenuItem>
            )}
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} className="text-destructive">
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="sm" className="font-semibold" asChild>
            <Link href="/login">Login</Link>
          </Button>
          <Button size="sm" className="font-semibold rounded-sm" asChild>
            <Link href="/signup">Sign Up</Link>
          </Button>
        </div>
      )}
    </>
  )

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="relative">
              <div className="absolute -inset-2 bg-gradient-to-r from-primary/20 via-primary/10 to-transparent rounded-full blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <img
                src="/logo.png"
                alt="AK Bikes Hyderabad"
                className="relative h-14 w-auto drop-shadow-md transition-transform duration-300 group-hover:scale-105"
              />
            </div>
          </Link>

          {!minimalAuth && (
            <div className="hidden flex-1 max-w-md lg:flex">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search bikes by name, brand..."
                  className="w-full pl-10 bg-secondary"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          )}

          {!minimalAuth && (
            <nav className="hidden lg:flex items-center gap-6">
              {navLinks.map((link) =>
                link.openSellModal ? (
                  <button
                    key={link.name}
                    type="button"
                    className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                    onClick={() => triggerSellBikeModal()}
                  >
                    {link.name}
                  </button>
                ) : (
                  <Link
                    key={link.name}
                    href={link.href}
                    className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.name}
                  </Link>
                )
              )}
            </nav>
          )}

          <div className="hidden lg:flex items-center gap-2">
            {authButtons}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="rounded-full"
            >
              <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Toggle theme</span>
            </Button>
            {!minimalAuth && (
              <Button
                onClick={handleWhatsApp}
                className="gap-2 bg-[#25D366] hover:bg-[#128C7E] text-white"
              >
                <MessageCircle className="h-4 w-4" />
                WhatsApp
              </Button>
            )}
          </div>

          <div className="flex lg:hidden items-center gap-2">
            {!minimalAuth && authButtons}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="rounded-full"
            >
              <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            </Button>
            {!minimalAuth && (
              <Button variant="ghost" size="icon" onClick={() => setIsOpen(!isOpen)}>
                {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </Button>
            )}
          </div>
        </div>

        {isOpen && !minimalAuth && (
          <div className="lg:hidden py-4 border-t border-border">
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search bikes..."
                className="w-full pl-10 bg-secondary"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <nav className="flex flex-col gap-2">
              {navLinks.map((link) =>
                link.openSellModal ? (
                  <button
                    key={link.name}
                    type="button"
                    className="w-full px-3 py-2 text-left text-sm font-medium text-muted-foreground transition-colors hover:text-foreground hover:bg-secondary rounded-lg"
                    onClick={() => {
                      setIsOpen(false)
                      triggerSellBikeModal()
                    }}
                  >
                    {link.name}
                  </button>
                ) : (
                  <Link
                    key={link.name}
                    href={link.href}
                    className="px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground hover:bg-secondary rounded-lg"
                    onClick={() => setIsOpen(false)}
                  >
                    {link.name}
                  </Link>
                )
              )}
              <div className="flex gap-2 mt-2">
                {isAuthenticated && user ? (
                  <>
                    <div className="w-full px-3 py-2 mb-1 rounded-lg bg-secondary/60">
                      <p className="text-xs text-muted-foreground">Hello,</p>
                      <p className="text-sm font-semibold">{user.name}</p>
                    </div>
                    <Button variant="outline" className="flex-1" asChild>
                      <Link href="/profile" onClick={() => setIsOpen(false)}>
                        My Profile
                      </Link>
                    </Button>
                    <Button
                      variant="destructive"
                      className="flex-1 gap-1"
                      onClick={handleLogout}
                    >
                      <LogOut className="h-4 w-4" />
                      Logout
                    </Button>
                  </>
                ) : (
                  <>
                    <Button variant="outline" className="flex-1" asChild>
                      <Link href="/login" onClick={() => setIsOpen(false)}>
                        Login
                      </Link>
                    </Button>
                    <Button className="flex-1" asChild>
                      <Link href="/signup" onClick={() => setIsOpen(false)}>
                        Signup
                      </Link>
                    </Button>
                  </>
                )}
              </div>
              <Button
                onClick={handleWhatsApp}
                className="mt-2 gap-2 bg-[#25D366] hover:bg-[#128C7E] text-white"
              >
                <MessageCircle className="h-4 w-4" />
                WhatsApp Us
              </Button>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
