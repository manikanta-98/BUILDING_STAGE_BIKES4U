"use client"

import Link from "next/link"
import { Bike, MapPin, Phone, Mail, MessageCircle, Facebook, Instagram, Twitter, Youtube } from "lucide-react"
import { Button } from "@/components/ui/button"

const quickLinks = [
  { name: "Home", href: "#" },
  { name: "Buy Bikes", href: "#featured" },
  { name: "Sell Your Bike", href: "#sell" },
  { name: "Exchange", href: "#exchange" },
  { name: "About Us", href: "#" },
  { name: "Contact", href: "#contact" },
]

const bikeCategories = [
  { name: "Sports Bikes", href: "#" },
  { name: "Scooters", href: "#" },
  { name: "Commuter Bikes", href: "#" },
  { name: "EV Bikes", href: "#" },
  { name: "Budget Bikes", href: "#" },
  { name: "Premium Bikes", href: "#" },
]

const socialLinks = [
  { name: "Facebook", icon: Facebook, href: "#" },
  { name: "Instagram", icon: Instagram, href: "#" },
  { name: "Twitter", icon: Twitter, href: "#" },
  { name: "YouTube", icon: Youtube, href: "#" },
]

export function Footer() {
  const handleWhatsApp = () => {
    window.open("https://wa.me/919676499794?text=Hi! I'm interested in bikes at BIKES4u", "_blank")
  }

  return (
    <footer id="contact" className="border-t border-border bg-card">
      {/* Main Footer */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Column */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
                <Bike className="h-6 w-6 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold tracking-tight">
                BIKES<span className="text-primary">4u</span>
              </span>
            </Link>
            <p className="text-sm text-muted-foreground">
              {"Hyderabad's"} trusted destination for buying, selling, and exchanging quality second-hand bikes. Every bike is verified and comes with complete documentation.
            </p>
            <Button
              onClick={handleWhatsApp}
              className="gap-2 bg-[#25D366] hover:bg-[#128C7E] text-white"
            >
              <MessageCircle className="h-4 w-4" />
              Chat on WhatsApp
            </Button>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="font-semibold mb-4">Bike Categories</h3>
            <ul className="space-y-3">
              {bikeCategories.map((category) => (
                <li key={category.name}>
                  <Link
                    href={category.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {category.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <span className="text-sm text-muted-foreground">
                  BIKES4u, Goodsheds Road,<br />
                  Beside Sub Registrar Office,<br />
                  Moosapet, Hyderabad
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-primary shrink-0" />
                <a
                  href="tel:+919676499794"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  +91 96764 99794
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-primary shrink-0" />
                <a
                  href="mailto:ardhammanikanta763@gmail.com"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  ardhammanikanta763@gmail.com
                </a>
              </li>
            </ul>

            {/* Social Links */}
            <div className="mt-6">
              <h4 className="text-sm font-medium mb-3">Follow Us</h4>
              <div className="flex gap-3">
                {socialLinks.map((social) => (
                  <a
                    key={social.name}
                    href={social.href}
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-secondary text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-colors"
                    aria-label={social.name}
                  >
                    <social.icon className="h-4 w-4" />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-border">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground text-center sm:text-left">
              © {new Date().getFullYear()} BIKES4u. All rights reserved.
            </p>
            <div className="flex gap-6">
              <Link
                href="#"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Privacy Policy
              </Link>
              <Link
                href="#"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
