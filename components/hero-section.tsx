"use client"

import { Button } from "@/components/ui/button"
import { MessageCircle, ChevronRight } from "lucide-react"

export function HeroSection() {
  const handleWhatsApp = () => {
    window.open("https://wa.me/919876543210?text=Hi! I'm interested in bikes at BIKES4u", "_blank")
  }

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-background via-background to-secondary py-16 md:py-24 lg:py-32">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8882_1px,transparent_1px),linear-gradient(to_bottom,#8882_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)]" />
      
      <div className="container relative mx-auto px-4">
        <div className="grid gap-8 lg:grid-cols-2 lg:gap-12 items-center">
          {/* Content */}
          <div className="flex flex-col justify-center space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center justify-center lg:justify-start">
              <span className="rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
                Your Trusted Bike Shop
              </span>
            </div>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl text-balance">
              Buy or Sell Your{" "}
              <span className="text-primary">Bike</span>{" "}
              With Confidence
            </h1>
            <p className="max-w-xl mx-auto lg:mx-0 text-lg text-muted-foreground text-pretty">
              Looking for a good bike at low price? Want to sell your old bike? We are here to help. All bikes checked by experts.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button size="lg" className="gap-2 text-base" asChild>
                <a href="#featured">
                  See All Bikes
                  <ChevronRight className="h-4 w-4" />
                </a>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="gap-2 text-base border-[#25D366] text-[#25D366] hover:bg-[#25D366] hover:text-white"
                onClick={handleWhatsApp}
              >
                <MessageCircle className="h-5 w-5" />
                Call Us on WhatsApp
              </Button>
            </div>
            {/* Trust Badges */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-6 pt-4">
              <div className="flex items-center gap-2">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <span className="text-xl font-bold text-primary">500+</span>
                </div>
                <span className="text-sm text-muted-foreground">Happy Customers</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <span className="text-xl font-bold text-primary">5</span>
                </div>
                <span className="text-sm text-muted-foreground">Star Rating</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <span className="text-xl font-bold text-primary">RC</span>
                </div>
                <span className="text-sm text-muted-foreground">Papers Ready</span>
              </div>
            </div>
          </div>

          {/* Hero Image */}
          <div className="relative lg:order-last">
            <div className="relative aspect-square max-w-lg mx-auto">
              <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-primary/20 to-primary/5 blur-3xl" />
              <img
                src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=800&fit=crop"
                alt="Premium second-hand bike"
                className="relative z-10 w-full h-full object-cover rounded-3xl shadow-2xl"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
