"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { Bike, LogIn } from "lucide-react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export default function LoginPage() {
  const router = useRouter()

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    router.push("/")
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 flex items-center justify-center px-4 py-12 bg-gradient-to-br from-background via-background to-secondary">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8882_1px,transparent_1px),linear-gradient(to_bottom,#8882_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_40%,transparent_100%)] pointer-events-none" />
        <Card className="relative w-full max-w-md border-border shadow-xl">
          <CardHeader className="text-center space-y-2">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <Bike className="h-6 w-6 text-primary" />
            </div>
            <CardTitle className="text-2xl">Login</CardTitle>
            <CardDescription>
              Welcome back to AK Bikes. Sign in to continue.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="login-identifier">Email or Phone</Label>
                <Input
                  id="login-identifier"
                  type="text"
                  placeholder="you@email.com or 10-digit mobile"
                  autoComplete="username"
                  required
                  className="bg-background"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="login-password">Password</Label>
                <Input
                  id="login-password"
                  type="password"
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  required
                  className="bg-background"
                />
              </div>
              <Button type="submit" className="w-full gap-2" size="lg">
                <LogIn className="h-4 w-4" />
                Login
              </Button>
            </form>
            <p className="mt-6 text-center text-sm text-muted-foreground">
              Don&apos;t have an account?{" "}
              <Link
                href="/signup"
                className="font-medium text-primary hover:underline"
              >
                Create account
              </Link>
            </p>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  )
}
