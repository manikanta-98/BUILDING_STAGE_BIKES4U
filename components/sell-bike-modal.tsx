"use client"

import { useEffect, useRef, useState } from "react"
import {
  Bike,
  Camera,
  CheckCircle2,
  ImagePlus,
  Loader2,
  MessageCircle,
  Send,
  Sparkles,
  X,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { api } from "@/lib/api"
import { cn } from "@/lib/utils"

export const OPEN_SELL_MODAL_EVENT = "ak-bikes-open-sell-modal"

export function triggerSellBikeModal() {
  window.dispatchEvent(new CustomEvent(OPEN_SELL_MODAL_EVENT))
}

const WHATSAPP = "919676499794"
const MAX_PHOTOS = 8
const ACCEPT = "image/jpeg,image/jpg,image/png,image/webp"

type FormState = {
  name: string
  phone: string
  model: string
  brand: string
  year: string
  registration: string
  km: string
  price: string
  location: string
  description: string
}

const initialForm: FormState = {
  name: "",
  phone: "",
  model: "",
  brand: "",
  year: "",
  registration: "",
  km: "",
  price: "",
  location: "",
  description: "",
}

function field(value: string) {
  return value.trim() || "—"
}

function buildWhatsAppMessage(form: FormState, photoLinks: string[]) {
  const photoBlock =
    photoLinks.length > 0
      ? photoLinks.map((u, i) => `${i + 1}. ${u}`).join("\n")
      : "—"

  return [
    "New Bike Seller Inquiry",
    "",
    `Name: ${field(form.name)}`,
    `Phone: ${field(form.phone)}`,
    `Model: ${field(form.model)}`,
    `Brand: ${field(form.brand)}`,
    `Year: ${field(form.year)}`,
    `Registration: ${field(form.registration)}`,
    `KM Driven: ${field(form.km)}`,
    `Expected Price: ${form.price.trim() ? `₹${form.price.trim()}` : "—"}`,
    `Location: ${field(form.location)}`,
    `Description: ${field(form.description)}`,
    "",
    "Photos:",
    photoBlock,
    "",
    "Please contact customer.",
  ].join("\n")
}

function openWhatsAppChat(text: string) {
  const url = `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(text)}`
  const link = document.createElement("a")
  link.href = url
  link.target = "_blank"
  link.rel = "noopener noreferrer"
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

interface SellBikeModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function SellBikeModal({ open, onOpenChange }: SellBikeModalProps) {
  const [form, setForm] = useState<FormState>(initialForm)
  const [files, setFiles] = useState<File[]>([])
  const [previews, setPreviews] = useState<string[]>([])
  const [submitting, setSubmitting] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [dragOver, setDragOver] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const urls = files.map((f) => URL.createObjectURL(f))
    setPreviews(urls)
    return () => urls.forEach((u) => URL.revokeObjectURL(u))
  }, [files])

  useEffect(() => {
    if (!open) {
      setForm(initialForm)
      setFiles([])
      setError(null)
      setUploading(false)
      document.body.style.overflow = ""
      return
    }
    document.body.style.overflow = "hidden"
    return () => {
      document.body.style.overflow = ""
    }
  }, [open])

  const update = (fieldKey: keyof FormState, value: string) => {
    setForm((prev) => ({ ...prev, [fieldKey]: value }))
  }

  const addFiles = (picked: File[]) => {
    const valid = picked.filter(
      (f) =>
        ACCEPT.includes(f.type) ||
        /\.(jpe?g|png|webp)$/i.test(f.name)
    )
    if (valid.length < picked.length) {
      setError("Only JPG, JPEG, PNG, and WEBP images are allowed.")
      return
    }
    setError(null)
    setFiles((prev) => [...prev, ...valid].slice(0, MAX_PHOTOS))
  }

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    addFiles(Array.from(e.target.files || []))
    e.target.value = ""
  }

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    addFiles(Array.from(e.dataTransfer.files || []))
  }

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name.trim() || !form.phone.trim() || !form.model.trim()) {
      setError("Customer name, phone number, and bike model are required.")
      return
    }

    setSubmitting(true)
    setError(null)

    let photoLinks: string[] = []

    if (files.length > 0) {
      setUploading(true)
      try {
        photoLinks = await api.uploadSellPhotos(files)
      } catch (err) {
        setUploading(false)
        setSubmitting(false)
        setError(
          err instanceof Error
            ? err.message
            : "Photo upload failed. Start backend and try again."
        )
        return
      }
      setUploading(false)
    }

    const message = buildWhatsAppMessage(form, photoLinks)
    openWhatsAppChat(message)

    setSubmitting(false)
    onOpenChange(false)
  }

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center p-0 sm:p-4"
      role="presentation"
    >
      <button
        type="button"
        className="absolute inset-0 bg-black/70 backdrop-blur-md"
        aria-label="Close"
        onClick={() => !submitting && onOpenChange(false)}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="sell-bike-title"
        className="relative z-[201] flex w-full max-h-[100dvh] sm:max-h-[92vh] flex-col sm:max-w-2xl overflow-hidden rounded-t-2xl sm:rounded-2xl border border-border bg-card shadow-2xl"
      >
        {/* Header */}
        <div className="relative shrink-0 overflow-hidden border-b border-border bg-gradient-to-br from-primary/15 via-background to-background px-5 py-5 sm:px-6">
          <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-primary/10 blur-2xl" />
          <div className="relative flex items-start justify-between gap-3">
            <div>
              <div className="mb-2 inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                <Sparkles className="h-3.5 w-3.5" />
                Quick inquiry
              </div>
              <h2
                id="sell-bike-title"
                className="flex items-center gap-2 text-xl font-bold tracking-tight sm:text-2xl"
              >
                <Bike className="h-6 w-6 text-primary" />
                Sell Your Bike
              </h2>
              <p className="mt-1.5 max-w-md text-sm text-muted-foreground">
                Fill in your bike details and photos. We&apos;ll open WhatsApp with
                everything ready to send.
              </p>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="shrink-0 rounded-full"
              disabled={submitting}
              onClick={() => onOpenChange(false)}
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="flex flex-1 flex-col overflow-hidden"
        >
          <div className="flex-1 overflow-y-auto px-5 py-5 sm:px-6 space-y-6">
            {/* Contact */}
            <section className="space-y-3">
              <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-xs text-primary">
                  1
                </span>
                Your details
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="sell-name">Customer Name *</Label>
                  <Input
                    id="sell-name"
                    value={form.name}
                    onChange={(e) => update("name", e.target.value)}
                    placeholder="Full name"
                    required
                    className="bg-background"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="sell-phone">Phone Number *</Label>
                  <Input
                    id="sell-phone"
                    type="tel"
                    inputMode="tel"
                    value={form.phone}
                    onChange={(e) => update("phone", e.target.value)}
                    placeholder="10-digit mobile"
                    required
                    className="bg-background"
                  />
                </div>
                <div className="space-y-1.5 sm:col-span-2">
                  <Label htmlFor="sell-location">Location</Label>
                  <Input
                    id="sell-location"
                    value={form.location}
                    onChange={(e) => update("location", e.target.value)}
                    placeholder="City / area"
                    className="bg-background"
                  />
                </div>
              </div>
            </section>

            {/* Bike */}
            <section className="space-y-3">
              <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-xs text-primary">
                  2
                </span>
                Bike information
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="sell-model">Bike Model *</Label>
                  <Input
                    id="sell-model"
                    value={form.model}
                    onChange={(e) => update("model", e.target.value)}
                    placeholder="e.g. Activa 6G"
                    required
                    className="bg-background"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="sell-brand">Brand</Label>
                  <Input
                    id="sell-brand"
                    value={form.brand}
                    onChange={(e) => update("brand", e.target.value)}
                    placeholder="e.g. Honda"
                    className="bg-background"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="sell-year">Year</Label>
                  <Input
                    id="sell-year"
                    type="number"
                    value={form.year}
                    onChange={(e) => update("year", e.target.value)}
                    placeholder="2022"
                    className="bg-background"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="sell-reg">Registration Number</Label>
                  <Input
                    id="sell-reg"
                    value={form.registration}
                    onChange={(e) => update("registration", e.target.value)}
                    placeholder="TS08XX0000"
                    className="bg-background font-mono text-sm"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="sell-km">KM Driven</Label>
                  <Input
                    id="sell-km"
                    value={form.km}
                    onChange={(e) => update("km", e.target.value)}
                    placeholder="e.g. 12000"
                    className="bg-background"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="sell-price">Expected Price</Label>
                  <Input
                    id="sell-price"
                    value={form.price}
                    onChange={(e) => update("price", e.target.value)}
                    placeholder="₹ amount"
                    className="bg-background"
                  />
                </div>
                <div className="space-y-1.5 sm:col-span-2">
                  <Label htmlFor="sell-desc">Description</Label>
                  <Textarea
                    id="sell-desc"
                    value={form.description}
                    onChange={(e) => update("description", e.target.value)}
                    placeholder="Condition, owners, service history..."
                    rows={3}
                    className="bg-background resize-none"
                  />
                </div>
              </div>
            </section>

            {/* Photos */}
            <section className="space-y-3">
              <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-xs text-primary">
                  3
                </span>
                Bike photos
                <span className="font-normal text-muted-foreground">
                  ({files.length}/{MAX_PHOTOS})
                </span>
              </h3>

              <input
                ref={fileInputRef}
                type="file"
                accept={ACCEPT}
                multiple
                className="hidden"
                onChange={onFileChange}
              />

              <div
                onDragOver={(e) => {
                  e.preventDefault()
                  setDragOver(true)
                }}
                onDragLeave={() => setDragOver(false)}
                onDrop={onDrop}
                className={cn(
                  "rounded-xl border-2 border-dashed p-6 text-center transition-colors",
                  dragOver
                    ? "border-primary bg-primary/5"
                    : "border-border bg-secondary/30 hover:border-primary/40"
                )}
              >
                <Camera className="mx-auto h-10 w-10 text-muted-foreground mb-3" />
                <p className="text-sm font-medium mb-1">Drag & drop photos here</p>
                <p className="text-xs text-muted-foreground mb-4">
                  JPG, JPEG, PNG, WEBP — up to {MAX_PHOTOS} images
                </p>
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  className="gap-2"
                  disabled={files.length >= MAX_PHOTOS || submitting}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <ImagePlus className="h-4 w-4" />
                  Choose photos
                </Button>
              </div>

              {previews.length > 0 && (
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                  {previews.map((src, i) => (
                    <div
                      key={`${src}-${i}`}
                      className="group relative aspect-square overflow-hidden rounded-lg border border-border bg-secondary"
                    >
                      <img
                        src={src}
                        alt={`Bike photo ${i + 1}`}
                        className="h-full w-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => removeFile(i)}
                        className="absolute top-1.5 right-1.5 flex h-7 w-7 items-center justify-center rounded-full bg-destructive text-destructive-foreground shadow-md opacity-90 hover:opacity-100"
                        aria-label={`Remove photo ${i + 1}`}
                      >
                        <X className="h-4 w-4" />
                      </button>
                      <span className="absolute bottom-1.5 left-1.5 rounded bg-black/60 px-1.5 py-0.5 text-[10px] text-white">
                        {i + 1}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </section>

            {error && (
              <p className="text-sm text-destructive rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2.5">
                {error}
              </p>
            )}
          </div>

          {/* Footer CTA */}
          <div className="shrink-0 border-t border-border bg-card/95 p-4 sm:p-5 backdrop-blur-sm">
            <Button
              type="submit"
              size="lg"
              className="w-full h-12 gap-2 text-base font-semibold bg-[#25D366] hover:bg-[#128C7E] text-white shadow-lg"
              disabled={submitting}
            >
              {uploading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Uploading photos…
                </>
              ) : submitting ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Opening WhatsApp…
                </>
              ) : (
                <>
                  <Send className="h-5 w-5" />
                  Submit &amp; Send on WhatsApp
                </>
              )}
            </Button>
            <p className="mt-2 flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
              <CheckCircle2 className="h-3.5 w-3.5 text-[#25D366]" />
              Photos upload first, then WhatsApp opens automatically
            </p>
          </div>
        </form>
      </div>
    </div>
  )
}
