"use client"

import { useState } from "react"
import Link from "next/link"
import { useTheme } from "next-themes"
import { Menu, X, Search, Sun, Moon, MessageCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { triggerSellBikeModal } from "@/components/sell-bike-modal"

const navLinks = [
  { name: "Home", href: "#" },
  { name: "Buy Bikes", href: "#featured" },
  { name: "Sell Bike", href: "#", openSellModal: true },
  { name: "Exchange", href: "#exchange" },
  { name: "Contact", href: "#contact" },
]

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const { theme, setTheme } = useTheme()

  const handleWhatsApp = () => {
    window.open("https://wa.me/919676499794?text=Hi! I'm interested in bikes at BIKES4u", "_blank")
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="relative">
              <div className="absolute -inset-2 bg-gradient-to-r from-primary/20 via-primary/10 to-transparent rounded-full blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <img 
                src="/logo.png" 
                alt="BIKES4U Hyderabad" 
                className="relative h-14 w-auto drop-shadow-md transition-transform duration-300 group-hover:scale-105"
              />
            </div>
          </Link>

          {/* Desktop Search Bar */}
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

          {/* Desktop Navigation */}
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

          {/* Desktop Actions */}
          <div className="hidden lg:flex items-center gap-2">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/login">Login</Link>
            </Button>
            <Button size="sm" asChild>
              <Link href="/signup">Signup</Link>
            </Button>
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
            <Button onClick={handleWhatsApp} className="gap-2 bg-[#25D366] hover:bg-[#128C7E] text-white">
              <MessageCircle className="h-4 w-4" />
              WhatsApp
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex lg:hidden items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="rounded-full"
            >
              <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="lg:hidden py-4 border-t border-border">
            {/* Mobile Search */}
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
              </div>
              <Button onClick={handleWhatsApp} className="mt-2 gap-2 bg-[#25D366] hover:bg-[#128C7E] text-white">
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
