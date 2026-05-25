"use client"

import { useState, useEffect } from "react"
import { Search, SlidersHorizontal, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { BikeCard } from "@/components/bike-card"
import { bikes, brands, locations } from "@/lib/data"

export function FeaturedBikesSection() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedBrand, setSelectedBrand] = useState<string>("all")
  const [selectedLocation, setSelectedLocation] = useState<string>("all")
  const [selectedFuel, setSelectedFuel] = useState<string>("all")
  const [priceRange, setPriceRange] = useState<string>("all")
  const [showFilters, setShowFilters] = useState(false)
  const [highlightedBikeId, setHighlightedBikeId] = useState<string | null>(null)

  // Close highlight when clicking outside or pressing Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setHighlightedBikeId(null)
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [])

  const filteredBikes = bikes.filter((bike) => {
    const matchesSearch =
      searchQuery === "" ||
      bike.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      bike.brand.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesBrand = selectedBrand === "all" || bike.brand === selectedBrand
    const matchesLocation = selectedLocation === "all" || bike.location === selectedLocation
    const matchesFuel = selectedFuel === "all" || bike.fuelType === selectedFuel

    let matchesPrice = true
    if (priceRange !== "all") {
      const [min, max] = priceRange.split("-").map(Number)
      matchesPrice = bike.price >= min && (max ? bike.price <= max : true)
    }

    return matchesSearch && matchesBrand && matchesLocation && matchesFuel && matchesPrice
  })

  const clearFilters = () => {
    setSearchQuery("")
    setSelectedBrand("all")
    setSelectedLocation("all")
    setSelectedFuel("all")
    setPriceRange("all")
  }

  const hasActiveFilters =
    searchQuery !== "" ||
    selectedBrand !== "all" ||
    selectedLocation !== "all" ||
    selectedFuel !== "all" ||
    priceRange !== "all"

  return (
    <section id="featured" className="py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-3">
            Featured Bikes
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Explore our handpicked collection of quality second-hand bikes
          </p>
        </div>

        {/* Search & Filter Bar */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search by bike name or brand..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button
              variant="outline"
              className="gap-2 sm:w-auto"
              onClick={() => setShowFilters(!showFilters)}
            >
              <SlidersHorizontal className="h-4 w-4" />
              Filters
              {hasActiveFilters && (
                <span className="ml-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                  !
                </span>
              )}
            </Button>
          </div>

          {/* Expanded Filters */}
          {showFilters && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 rounded-xl bg-secondary/50 border border-border">
              <Select value={selectedBrand} onValueChange={setSelectedBrand}>
                <SelectTrigger>
                  <SelectValue placeholder="Brand" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Brands</SelectItem>
                  {brands.map((brand) => (
                    <SelectItem key={brand} value={brand}>
                      {brand}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={priceRange} onValueChange={setPriceRange}>
                <SelectTrigger>
                  <SelectValue placeholder="Price Range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Prices</SelectItem>
                  <SelectItem value="0-50000">Under ₹50,000</SelectItem>
                  <SelectItem value="50000-100000">₹50,000 - ₹1,00,000</SelectItem>
                  <SelectItem value="100000-150000">₹1,00,000 - ₹1,50,000</SelectItem>
                  <SelectItem value="150000-999999">Above ₹1,50,000</SelectItem>
                </SelectContent>
              </Select>

              <Select value={selectedFuel} onValueChange={setSelectedFuel}>
                <SelectTrigger>
                  <SelectValue placeholder="Fuel Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Fuel Types</SelectItem>
                  <SelectItem value="Petrol">Petrol</SelectItem>
                  <SelectItem value="Electric">Electric</SelectItem>
                  <SelectItem value="Hybrid">Hybrid</SelectItem>
                </SelectContent>
              </Select>

              <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                <SelectTrigger>
                  <SelectValue placeholder="Location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Locations</SelectItem>
                  {locations.map((location) => (
                    <SelectItem key={location} value={location}>
                      {location}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {hasActiveFilters && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearFilters}
                  className="col-span-2 md:col-span-4 gap-2"
                >
                  <X className="h-4 w-4" />
                  Clear All Filters
                </Button>
              )}
            </div>
          )}
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-sm text-muted-foreground">
            Showing <span className="font-medium text-foreground">{filteredBikes.length}</span> bikes
          </p>
        </div>

        {/* Bikes Grid */}
        {filteredBikes.length > 0 ? (
          <>
            {/* Backdrop overlay when a bike is highlighted */}
            {highlightedBikeId && (
              <div 
                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-all duration-300"
                onClick={() => setHighlightedBikeId(null)}
              />
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredBikes.map((bike) => (
                <BikeCard 
                  key={bike.id} 
                  bike={bike} 
                  isHighlighted={highlightedBikeId === bike.id}
                  onHighlight={() => setHighlightedBikeId(highlightedBikeId === bike.id ? null : bike.id)}
                />
              ))}
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-secondary mb-4">
              <Search className="h-10 w-10 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">No bikes found</h3>
            <p className="text-muted-foreground mb-4">
              Try adjusting your filters or search query
            </p>
            <Button variant="outline" onClick={clearFilters}>
              Clear Filters
            </Button>
          </div>
        )}
      </div>
    </section>
  )
}
