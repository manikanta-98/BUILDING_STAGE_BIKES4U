"use client"

import { useCallback, useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  Bike as BikeIcon,
  Loader2,
  Plus,
  Pencil,
  Trash2,
  Search,
  CheckCircle,
  XCircle,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { api, formatPrice } from "@/lib/api"
import type { Bike as BikeType, BikeStats } from "@/lib/types"
import { getBikeImages, normalizeImageUrl, PLACEHOLDER, statusLabel } from "@/lib/bike-helpers"
import { BikeImage } from "@/components/bike-image"
import { clearAdminSession, getAdminApiKey } from "@/lib/admin-session"

const emptyForm: Partial<BikeType> = {
  id: undefined,
  model: "",
  year: null,
  number: "",
  price: null,
  status: "unsold",
  description: "",
  images: ["", "", "", ""],
}

export default function AdminPage() {
  const router = useRouter()
  const adminKey = getAdminApiKey()
  const [bikes, setBikes] = useState<BikeType[]>([])
  const [stats, setStats] = useState<BikeStats>({ total: 0, available: 0, sold: 0 })
  const [loading, setLoading] = useState(false)
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editing, setEditing] = useState<Partial<BikeType> | null>(null)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const loadBikes = useCallback(async () => {
    if (!adminKey) return
    setLoading(true)
    setError(null)
    try {
      const params: Record<string, string> = { limit: "500", page: "1" }
      if (search.trim()) params.search = search.trim()
      if (statusFilter !== "all") params.status = statusFilter
      const res = await api.getBikes(params)
      setBikes(Array.isArray(res.data) ? res.data : [])
      if (res.stats) {
        setStats({
          total: res.stats.total ?? 0,
          available: res.stats.available ?? 0,
          sold: res.stats.sold ?? 0,
        })
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load")
    } finally {
      setLoading(false)
    }
  }, [adminKey, search, statusFilter])

  useEffect(() => {
    loadBikes()
  }, [loadBikes])

  const logout = () => {
    clearAdminSession()
    router.push("/admin/login")
  }

  const openAdd = () => {
    setEditing({ ...emptyForm })
    setDialogOpen(true)
  }

  const openEdit = (bike: BikeType) => {
    setEditing({
      ...bike,
      images: bike.images?.length ? [...bike.images] : ["", "", "", ""],
    })
    setDialogOpen(true)
  }

  const saveBike = async () => {
    if (!editing || !adminKey) return
    setSaving(true)
    try {
      const payload = {
        id: Number(editing.id),
        model: editing.model,
        year: editing.year === ("" as unknown as number) ? null : editing.year,
        number: editing.number || null,
        price: editing.price === ("" as unknown as number) ? null : editing.price,
        status: editing.status || "unsold",
        description: editing.description || "",
        images: editing.images || ["", "", "", ""],
      }
      const isEdit = bikes.some((b) => b.id === Number(editing.id))
      if (isEdit) {
        await api.updateBike(adminKey, Number(editing.id), payload)
      } else {
        await api.createBike(adminKey, payload)
      }
      setDialogOpen(false)
      setEditing(null)
      await loadBikes()
    } catch (err) {
      alert(err instanceof Error ? err.message : "Save failed")
    } finally {
      setSaving(false)
    }
  }

  const removeBike = async (id: number) => {
    if (!confirm("Delete this bike?")) return
    await api.deleteBike(adminKey, id)
    loadBikes()
  }

  const toggleStatus = async (bike: BikeType) => {
    const next = bike.status === "unsold" ? "sold" : "unsold"
    await api.updateStatus(adminKey, bike.id, next)
    loadBikes()
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <header className="border-b bg-background sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <BikeIcon className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-xl font-bold">AK Bikes Admin</h1>
              <p className="text-sm text-muted-foreground">Inventory management</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" asChild>
              <Link href="/">View Site</Link>
            </Button>
            <Button variant="ghost" onClick={logout}>
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 space-y-8">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Bikes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{stats.total}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Available
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-success">{stats.available}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Sold</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-destructive">{stats.sold}</p>
            </CardContent>
          </Card>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              className="pl-10"
              placeholder="Search model or number..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-[160px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="unsold">Available</SelectItem>
              <SelectItem value="sold">Sold</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={openAdd} className="gap-2">
            <Plus className="h-4 w-4" />
            Add Bike
          </Button>
        </div>

        <p className="text-sm text-muted-foreground">
          Table: <span className="font-medium text-foreground">{bikes.length}</span> rows
          {statusFilter === "all" ? (
            <>
              {" "}
              · Inventory: {stats.total} total, {stats.available} available, {stats.sold} sold
            </>
          ) : (
            <> · Filter: {statusFilter}</>
          )}
        </p>

        {error && (
          <p className="text-sm text-destructive rounded-lg border border-destructive/30 p-3">
            {error}
          </p>
        )}

        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : (
          <div className="rounded-xl border bg-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="p-3 text-left">ID</th>
                    <th className="p-3 text-left">Model</th>
                    <th className="p-3 text-left">Year</th>
                    <th className="p-3 text-left">Number</th>
                    <th className="p-3 text-left">Price</th>
                    <th className="p-3 text-left">Status</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {bikes.map((bike) => (
                    <tr
                      key={`${bike.id}-${bike.number ?? bike._id ?? "row"}`}
                      className="border-b last:border-0 hover:bg-muted/30"
                    >
                      <td className="p-3 font-mono">{bike.id}</td>
                      <td className="p-3 font-medium">{bike.model}</td>
                      <td className="p-3">{bike.year ?? "—"}</td>
                      <td className="p-3 font-mono text-xs">{bike.number ?? "—"}</td>
                      <td className="p-3">{formatPrice(bike.price)}</td>
                      <td className="p-3">
                        <Badge
                          className={
                            bike.status === "unsold"
                              ? "bg-success text-success-foreground"
                              : "bg-destructive text-destructive-foreground"
                          }
                        >
                          {statusLabel(bike.status)}
                        </Badge>
                      </td>
                      <td className="p-3">
                        <div className="flex justify-end gap-1">
                          <Button size="icon" variant="ghost" onClick={() => openEdit(bike)}>
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button size="icon" variant="ghost" onClick={() => toggleStatus(bike)}>
                            {bike.status === "unsold" ? (
                              <CheckCircle className="h-4 w-4 text-success" />
                            ) : (
                              <XCircle className="h-4 w-4 text-muted-foreground" />
                            )}
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="text-destructive"
                            onClick={() => removeBike(bike.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editing?.id && bikes.find((b) => b.id === editing.id) ? "Edit Bike" : "Add Bike"}</DialogTitle>
          </DialogHeader>
          {editing && (
            <div className="grid gap-4 py-2">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>ID</Label>
                  <Input
                    type="number"
                    value={editing.id ?? ""}
                    onChange={(e) =>
                      setEditing({ ...editing, id: e.target.value ? Number(e.target.value) : undefined })
                    }
                  />
                </div>
                <div>
                  <Label>Year</Label>
                  <Input
                    type="number"
                    value={editing.year ?? ""}
                    onChange={(e) =>
                      setEditing({
                        ...editing,
                        year: e.target.value ? Number(e.target.value) : null,
                      })
                    }
                  />
                </div>
              </div>
              <div>
                <Label>Model</Label>
                <Input
                  value={editing.model ?? ""}
                  onChange={(e) => setEditing({ ...editing, model: e.target.value })}
                />
              </div>
              <div>
                <Label>Bike Number</Label>
                <Input
                  value={editing.number ?? ""}
                  onChange={(e) => setEditing({ ...editing, number: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Price (₹)</Label>
                  <Input
                    type="number"
                    value={editing.price ?? ""}
                    onChange={(e) =>
                      setEditing({
                        ...editing,
                        price: e.target.value ? Number(e.target.value) : null,
                      })
                    }
                  />
                </div>
                <div>
                  <Label>Status</Label>
                  <Select
                    value={editing.status ?? "unsold"}
                    onValueChange={(v) =>
                      setEditing({ ...editing, status: v as "unsold" | "sold" })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="unsold">Available</SelectItem>
                      <SelectItem value="sold">Sold</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label>Description</Label>
                <Textarea
                  value={editing.description ?? ""}
                  onChange={(e) => setEditing({ ...editing, description: e.target.value })}
                  rows={3}
                />
              </div>
              <div>
                <Label>Preview</Label>
                <div className="mt-2 relative aspect-video max-w-xs rounded-lg overflow-hidden border bg-secondary">
                  <BikeImage
                    src={
                      editing.images?.[0]?.trim()
                        ? normalizeImageUrl(editing.images[0])
                        : getBikeImages(editing as BikeType)[0] || PLACEHOLDER
                    }
                    alt={editing.model || "Bike"}
                    className="h-full w-full object-cover"
                  />
                </div>
              </div>
              <div>
                <Label>Image URLs (or add files to public/Bikes/REG-1.jpg)</Label>
                {(editing.images || ["", "", "", ""]).map((url, i) => (
                  <Input
                    key={i}
                    className="mt-2"
                    placeholder={`Image ${i + 1} URL`}
                    value={url}
                    onChange={(e) => {
                      const imgs = [...(editing.images || ["", "", "", ""])]
                      imgs[i] = e.target.value
                      setEditing({ ...editing, images: imgs })
                    }}
                  />
                ))}
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={saveBike} disabled={saving}>
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
