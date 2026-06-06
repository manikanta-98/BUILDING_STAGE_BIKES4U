"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Heart, MessageCircle, Calendar, Eye, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { Bike } from "@/lib/types"
import { formatPrice, getWhatsAppLink } from "@/lib/api"
import {
  getBikeImages,
  getPrimaryBikeImage,
  normalizeImageUrl,
  PLACEHOLDER,
  isAvailable,
  statusLabel,
} from "@/lib/bike-helpers"
import { BikeImage } from "@/components/bike-image"

interface BikeCardProps {
  bike: Bike
  isHighlighted?: boolean
  onHighlight?: () => void
}

export function BikeCard({ bike, isHighlighted = false, onHighlight }: BikeCardProps) {
  const [isWishlisted, setIsWishlisted] = useState(false)
  const [imageLoaded, setImageLoaded] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const primaryFromApi = bike.images?.[0]?.trim()
    ? normalizeImageUrl(bike.images[0])
    : getPrimaryBikeImage(bike)
  const [imgSrc, setImgSrc] = useState(primaryFromApi || PLACEHOLDER)
  const displayImages = getBikeImages(bike)
  const available = isAvailable(bike.status)

  useEffect(() => {
    const next = bike.images?.[0]?.trim()
      ? normalizeImageUrl(bike.images[0])
      : getPrimaryBikeImage(bike)
    setImgSrc(next || PLACEHOLDER)
    setImageLoaded(false)
    setCurrentImageIndex(0)
  }, [bike.id, bike.images])

  const handleWhatsApp = (e: React.MouseEvent) => {
    e.stopPropagation()
    window.open(getWhatsAppLink(bike), "_blank")
  }

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation()
    setCurrentImageIndex((prev) => (prev + 1) % displayImages.length)
  }

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation()
    setCurrentImageIndex((prev) => (prev - 1 + displayImages.length) % displayImages.length)
  }

  const goToImage = (e: React.MouseEvent, index: number) => {
    e.stopPropagation()
    setCurrentImageIndex(index)
  }

  return (
    <div
      className={`group relative flex flex-col overflow-hidden rounded-2xl border bg-card transition-all duration-300 cursor-pointer ${
        isHighlighted
          ? "z-50 scale-105 shadow-2xl border-primary ring-4 ring-primary/30"
          : "border-border hover:shadow-xl hover:border-primary/50"
      }`}
      onClick={onHighlight}
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-secondary group/image">
        {!imageLoaded && (
          <div className="absolute inset-0 animate-pulse bg-secondary" />
        )}

        <div className="relative h-full w-full">
          {displayImages.length > 1 ? (
            displayImages.map((image, index) => (
              <BikeImage
                key={`${image}-${index}`}
                src={image}
                alt={`${bike.model} - Photo ${index + 1}`}
                className={`absolute inset-0 h-full w-full object-cover transition-all duration-500 ${
                  index === currentImageIndex
                    ? "opacity-100 scale-100"
                    : "opacity-0 scale-105"
                }`}
                onLoad={() => index === currentImageIndex && setImageLoaded(true)}
              />
            ))
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={imgSrc || bike.images?.[0] || PLACEHOLDER}
              alt={bike.model}
              className="absolute inset-0 h-full w-full object-cover"
              referrerPolicy="no-referrer"
              onLoad={() => setImageLoaded(true)}
              onError={() => {
                setImgSrc(PLACEHOLDER)
                setImageLoaded(true)
              }}
            />
          )}
        </div>

        {displayImages.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-2 top-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-full bg-background/80 backdrop-blur opacity-0 group-hover/image:opacity-100 transition-opacity hover:bg-background"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-2 top-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-full bg-background/80 backdrop-blur opacity-0 group-hover/image:opacity-100 transition-opacity hover:bg-background"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </>
        )}

        {displayImages.length > 1 && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
            {displayImages.map((_, index) => (
              <button
                key={index}
                onClick={(e) => goToImage(e, index)}
                className={`h-2 w-2 rounded-full transition-all ${
                  index === currentImageIndex
                    ? "bg-white w-4"
                    : "bg-white/50 hover:bg-white/75"
                }`}
              />
            ))}
          </div>
        )}

        <Badge
          className={`absolute top-3 left-3 ${
            available
              ? "bg-success text-success-foreground"
              : "bg-destructive text-destructive-foreground"
          }`}
        >
          {statusLabel(bike.status)}
        </Badge>

        <button
          onClick={(e) => {
            e.stopPropagation()
            setIsWishlisted(!isWishlisted)
          }}
          className="absolute top-3 right-3 flex h-9 w-9 items-center justify-center rounded-full bg-background/80 backdrop-blur transition-colors hover:bg-background"
        >
          <Heart
            className={`h-5 w-5 transition-colors ${
              isWishlisted ? "fill-destructive text-destructive" : "text-muted-foreground"
            }`}
          />
        </button>

        {displayImages.length > 1 && (
          <div className="absolute top-3 left-1/2 -translate-x-1/2">
            <Badge variant="secondary" className="bg-background/80 backdrop-blur text-xs">
              {currentImageIndex + 1} / {displayImages.length}
            </Badge>
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col p-4">
        <div className="mb-2">
          <p className="text-xs font-medium text-primary uppercase tracking-wide">
            AK Bikes
          </p>
          <h3 className="text-lg font-semibold line-clamp-1">{bike.model}</h3>
        </div>

        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
          <Calendar className="h-3.5 w-3.5 shrink-0" />
          <span>{bike.year ?? "Year N/A"}</span>
          {bike.number && (
            <>
              <span className="text-border">•</span>
              <span className="font-mono text-xs truncate">{bike.number}</span>
            </>
          )}
        </div>

        <p className="text-sm text-muted-foreground line-clamp-2 mb-3 min-h-[2.5rem]">
          {bike.description}
        </p>

        <div className="mb-4">
          <p className="text-2xl font-bold text-primary">{formatPrice(bike.price)}</p>
        </div>

        <div className="mt-auto flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="flex-1 gap-1.5"
            asChild
            onClick={(e) => e.stopPropagation()}
          >
            <Link href={`/bikes/${bike.id}`}>
              <Eye className="h-4 w-4" />
              View Details
            </Link>
          </Button>
          <Button
            size="sm"
            className="flex-1 gap-1.5 bg-[#25D366] hover:bg-[#128C7E] text-white"
            onClick={handleWhatsApp}
            disabled={!available}
          >
            <MessageCircle className="h-4 w-4" />
            WhatsApp Inquiry
          </Button>
        </div>
      </div>
    </div>
  )
}
