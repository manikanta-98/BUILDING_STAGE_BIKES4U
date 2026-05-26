"use client"

import { useState, useEffect, useCallback } from "react"
import { Search, SlidersHorizontal, X, Loader2 } from "lucide-react"
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
import { api } from "@/lib/api"
import type { Bike } from "@/lib/types"

const PAGE_SIZE = 12

function bikeKey(bike: Bike) {
  return `${bike.id}-${bike.number ?? bike._id ?? "na"}`
}

function mergeBikes(prev: Bike[], list: Bike[], append: boolean): Bike[] {
  const merged = append ? [...prev, ...list] : list
  const seen = new Set<string>()
  return merged.filter((bike) => {
    const key = bikeKey(bike)
    if (seen.has(key)) return false
    seen.add(key)
    return true
  })
}

export function FeaturedBikesSection() {
  const [bikes, setBikes] = useState<Bike[]>([])
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(false)
  const [totalCount, setTotalCount] = useState(0)

  const [searchQuery, setSearchQuery] = useState("")
  const [priceRange, setPriceRange] = useState("all")
  const [yearFilter, setYearFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [sort, setSort] = useState("latest")
  const [showFilters, setShowFilters] = useState(false)
  const [highlightedBikeId, setHighlightedBikeId] = useState<number | null>(null)

  const fetchBikes = useCallback(
    async (pageNum: number, append = false) => {
      try {
        if (append) setLoadingMore(true)
        else setLoading(true)

        const params: Record<string, string> = {
          page: String(pageNum),
          limit: String(PAGE_SIZE),
          sort,
        }
        if (searchQuery.trim()) params.search = searchQuery.trim()
        if (priceRange !== "all") params.priceRange = priceRange
        if (yearFilter !== "all") params.year = yearFilter
        if (statusFilter !== "all") params.status = statusFilter

        const res = await api.getBikes(params)
        const list = Array.isArray(res.data) ? res.data : []
        setBikes((prev) => mergeBikes(prev, list, append))
        setTotalCount(res.pagination?.total ?? list.length)
        setHasMore(res.pagination?.hasMore ?? false)
        setError(null)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load bikes")
        if (!append) setBikes([])
      } finally {
        setLoading(false)
        setLoadingMore(false)
      }
    },
    [searchQuery, priceRange, yearFilter, statusFilter, sort]
  )

  useEffect(() => {
    setPage(1)
    fetchBikes(1, false)
  }, [fetchBikes])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setHighlightedBikeId(null)
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [])

  const loadMore = () => {
    if (loadingMore || loading || !hasMore) return
    const next = page + 1
    setPage(next)
    fetchBikes(next, true)
  }

  const clearFilters = () => {
    setSearchQuery("")
    setPriceRange("all")
    setYearFilter("all")
    setStatusFilter("all")
    setSort("latest")
  }

  const hasActiveFilters =
    searchQuery !== "" ||
    priceRange !== "all" ||
    yearFilter !== "all" ||
    statusFilter !== "all" ||
    sort !== "latest"

  const yearOptions = Array.from({ length: 11 }, (_, i) => 2025 - i)

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

        <div className="mb-8 space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search by bike model..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select value={sort} onValueChange={setSort}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Sort" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="latest">Latest</SelectItem>
                <SelectItem value="price-asc">Price: Low to High</SelectItem>
                <SelectItem value="price-desc">Price: High to Low</SelectItem>
              </SelectContent>
            </Select>
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

          {showFilters && (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 p-4 rounded-xl bg-secondary/50 border border-border">
              <Select value={priceRange} onValueChange={setPriceRange}>
                <SelectTrigger>
                  <SelectValue placeholder="Price" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Prices</SelectItem>
                  <SelectItem value="0-50000">Under ₹50,000</SelectItem>
                  <SelectItem value="50000-100000">₹50,000 - ₹1,00,000</SelectItem>
                  <SelectItem value="100000-150000">₹1,00,000 - ₹1,50,000</SelectItem>
                  <SelectItem value="150000-999999">Above ₹1,50,000</SelectItem>
                </SelectContent>
              </Select>

              <Select value={yearFilter} onValueChange={setYearFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Year" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Years</SelectItem>
                  {yearOptions.map((y) => (
                    <SelectItem key={y} value={String(y)}>
                      {y}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="unsold">Available</SelectItem>
                  <SelectItem value="sold">Sold</SelectItem>
                </SelectContent>
              </Select>

              {hasActiveFilters && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearFilters}
                  className="col-span-2 md:col-span-3 gap-2"
                >
                  <X className="h-4 w-4" />
                  Clear All Filters
                </Button>
              )}
            </div>
          )}
        </div>

        <div className="mb-6">
          <p className="text-sm text-muted-foreground">
            Showing{" "}
            <span className="font-medium text-foreground">{bikes.length}</span>
            {totalCount > 0 && (
              <>
                {" "}
                of <span className="font-medium text-foreground">{totalCount}</span>
              </>
            )}{" "}
            bikes
            {hasMore && !loading && " — use Load More for the rest"}
            {loading && " (loading...)"}
          </p>
        </div>

        {error && (
          <div className="mb-6 rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-sm text-destructive">
            {error}. Start the backend with <code className="font-mono">npm run dev</code> in the{" "}
            <code className="font-mono">backend</code> folder.
          </div>
        )}

        {loading && bikes.length === 0 ? (
          <div className="flex justify-center py-16">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
          </div>
        ) : bikes.length > 0 ? (
          <>
            {highlightedBikeId != null && (
              <div
                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-all duration-300"
                onClick={() => setHighlightedBikeId(null)}
              />
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {bikes.map((bike) => (
                <BikeCard
                  key={bikeKey(bike)}
                  bike={bike}
                  isHighlighted={highlightedBikeId === bike.id}
                  onHighlight={() =>
                    setHighlightedBikeId(highlightedBikeId === bike.id ? null : bike.id)
                  }
                />
              ))}
            </div>

            {hasMore && (
              <div className="mt-10 flex justify-center">
                <Button
                  variant="outline"
                  size="lg"
                  onClick={loadMore}
                  disabled={loadingMore}
                  className="min-w-[160px]"
                >
                  {loadingMore ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Loading...
                    </>
                  ) : (
                    "Load More"
                  )}
                </Button>
              </div>
            )}
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
