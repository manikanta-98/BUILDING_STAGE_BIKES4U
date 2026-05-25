"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import {
  ArrowLeft,
  Calendar,
  Loader2,
  MessageCircle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { api, formatPrice, getWhatsAppLink } from "@/lib/api"
import type { Bike } from "@/lib/types"
import { getBikeImages, isAvailable, statusLabel } from "@/lib/bike-helpers"

export default function BikeDetailPage() {
  const params = useParams()
  const id = params.id as string
  const [bike, setBike] = useState<Bike | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [imageIndex, setImageIndex] = useState(0)

  useEffect(() => {
    if (!id) return
    setLoading(true)
    api
      .getBike(id)
      .then((res) => {
        setBike(res.data)
        setError(null)
      })
      .catch((err) => {
        setError(err instanceof Error ? err.message : "Failed to load bike")
      })
      .finally(() => setLoading(false))
  }, [id])

  const images = bike ? getBikeImages(bike) : []

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-8">
        <Button variant="ghost" asChild className="mb-6 gap-2">
          <Link href="/#featured">
            <ArrowLeft className="h-4 w-4" />
            Back to bikes
          </Link>
        </Button>

        {loading && (
          <div className="flex justify-center py-24">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
          </div>
        )}

        {error && (
          <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-6 text-center">
            <p className="text-destructive mb-4">{error}</p>
            <Button asChild variant="outline">
              <Link href="/#featured">Browse all bikes</Link>
            </Button>
          </div>
        )}

        {!loading && bike && (
          <div className="grid lg:grid-cols-2 gap-10">
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-secondary border">
              <img
                src={images[imageIndex]}
                alt={bike.model}
                className="h-full w-full object-cover"
              />
              {images.length > 1 && (
                <>
                  <button
                    type="button"
                    className="absolute left-3 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-background/80 flex items-center justify-center"
                    onClick={() =>
                      setImageIndex((i) => (i - 1 + images.length) % images.length)
                    }
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-background/80 flex items-center justify-center"
                    onClick={() => setImageIndex((i) => (i + 1) % images.length)}
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </>
              )}
              <Badge
                className={`absolute top-4 left-4 ${
                  isAvailable(bike.status)
                    ? "bg-success text-success-foreground"
                    : "bg-destructive text-destructive-foreground"
                }`}
              >
                {statusLabel(bike.status)}
              </Badge>
            </div>

            <div className="space-y-6">
              <div>
                <p className="text-sm font-medium text-primary uppercase tracking-wide mb-1">
                  AK Bikes
                </p>
                <h1 className="text-3xl font-bold">{bike.model}</h1>
              </div>

              <div className="flex flex-wrap gap-4 text-muted-foreground">
                <span className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  {bike.year ?? "Year N/A"}
                </span>
                {bike.number && (
                  <span className="font-mono text-sm bg-secondary px-3 py-1 rounded-lg">
                    {bike.number}
                  </span>
                )}
              </div>

              <p className="text-3xl font-bold text-primary">{formatPrice(bike.price)}</p>

              <p className="text-muted-foreground leading-relaxed">{bike.description}</p>

              <div className="flex flex-wrap gap-3 pt-4">
                <Button
                  size="lg"
                  className="gap-2 bg-[#25D366] hover:bg-[#128C7E] text-white"
                  disabled={!isAvailable(bike.status)}
                  onClick={() => window.open(getWhatsAppLink(bike), "_blank")}
                >
                  <MessageCircle className="h-5 w-5" />
                  WhatsApp Inquiry
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link href="/#featured">View more bikes</Link>
                </Button>
              </div>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  )
}
