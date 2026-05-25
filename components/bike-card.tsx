"use client"

import { useState } from "react"
import { Heart, MessageCircle, MapPin, Gauge, Fuel, Calendar, Eye, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { Bike } from "@/lib/data"

interface BikeCardProps {
  bike: Bike
  isHighlighted?: boolean
  onHighlight?: () => void
}

export function BikeCard({ bike, isHighlighted = false, onHighlight }: BikeCardProps) {
  const [isWishlisted, setIsWishlisted] = useState(false)
  const [imageLoaded, setImageLoaded] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  const handleWhatsApp = (e: React.MouseEvent) => {
    e.stopPropagation()
    const message = `Hi! I'm interested in the ${bike.year} ${bike.brand} ${bike.name} (${bike.registrationNumber}) listed at ₹${bike.price.toLocaleString("en-IN")} on BIKES4u.`
    window.open(`https://wa.me/919676499794?text=${encodeURIComponent(message)}`, "_blank")
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(price)
  }

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation()
    setCurrentImageIndex((prev) => (prev + 1) % bike.images.length)
  }

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation()
    setCurrentImageIndex((prev) => (prev - 1 + bike.images.length) % bike.images.length)
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
      {/* Image Container with Slider */}
      <div className="relative aspect-[4/3] overflow-hidden bg-secondary group/image">
        {!imageLoaded && (
          <div className="absolute inset-0 animate-pulse bg-secondary" />
        )}
        
        {/* Images */}
        <div className="relative h-full w-full">
          {bike.images.map((image, index) => (
            <img
              key={index}
              src={image}
              alt={`${bike.brand} ${bike.name} - Photo ${index + 1}`}
              className={`absolute inset-0 h-full w-full object-cover transition-all duration-500 ${
                index === currentImageIndex 
                  ? "opacity-100 scale-100" 
                  : "opacity-0 scale-105"
              }`}
              onLoad={() => index === 0 && setImageLoaded(true)}
            />
          ))}
        </div>

        {/* Navigation Arrows */}
        {bike.images.length > 1 && (
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

        {/* Dot Indicators */}
        {bike.images.length > 1 && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
            {bike.images.map((_, index) => (
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
        
        {/* Status Badge */}
        <Badge
          className={`absolute top-3 left-3 ${
            bike.status === "Available"
              ? "bg-success text-success-foreground"
              : "bg-destructive text-destructive-foreground"
          }`}
        >
          {bike.status}
        </Badge>

        {/* Wishlist Button */}
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

        {/* Category Tag */}
        <div className="absolute bottom-3 left-3">
          <Badge variant="secondary" className="bg-background/80 backdrop-blur">
            {bike.category}
          </Badge>
        </div>

        {/* Image Counter */}
        {bike.images.length > 1 && (
          <div className="absolute top-3 left-1/2 -translate-x-1/2">
            <Badge variant="secondary" className="bg-background/80 backdrop-blur text-xs">
              {currentImageIndex + 1} / {bike.images.length}
            </Badge>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-4">
        {/* Brand & Name */}
        <div className="mb-2">
          <p className="text-xs font-medium text-primary uppercase tracking-wide">
            {bike.brand}
          </p>
          <h3 className="text-lg font-semibold line-clamp-1">{bike.name}</h3>
        </div>

        {/* Year & Registration */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
          <Calendar className="h-3.5 w-3.5" />
          <span>{bike.year}</span>
          <span className="text-border">•</span>
          <span className="font-mono text-xs">{bike.registrationNumber}</span>
        </div>

        {/* Specs Grid */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          <div className="flex flex-col items-center p-2 rounded-lg bg-secondary/50">
            <Gauge className="h-4 w-4 text-muted-foreground mb-1" />
            <span className="text-xs font-medium">{(bike.kmDriven / 1000).toFixed(0)}k km</span>
          </div>
          <div className="flex flex-col items-center p-2 rounded-lg bg-secondary/50">
            <Fuel className="h-4 w-4 text-muted-foreground mb-1" />
            <span className="text-xs font-medium">{bike.fuelType}</span>
          </div>
          <div className="flex flex-col items-center p-2 rounded-lg bg-secondary/50">
            <MapPin className="h-4 w-4 text-muted-foreground mb-1" />
            <span className="text-xs font-medium truncate w-full text-center">{bike.location}</span>
          </div>
        </div>

        {/* Price */}
        <div className="mb-4">
          <p className="text-2xl font-bold text-primary">
            {formatPrice(bike.price)}
          </p>
        </div>

        {/* Actions */}
        <div className="mt-auto flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="flex-1 gap-1.5"
            onClick={(e) => e.stopPropagation()}
          >
            <Eye className="h-4 w-4" />
            View Details
          </Button>
          <Button
            size="sm"
            className="flex-1 gap-1.5 bg-[#25D366] hover:bg-[#128C7E] text-white"
            onClick={handleWhatsApp}
            disabled={bike.status === "Sold Out"}
          >
            <MessageCircle className="h-4 w-4" />
            Inquire
          </Button>
        </div>
      </div>
    </div>
  )
}
