"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Bike, LogIn, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import {
  verifyAdminCredentials,
  setAdminLoggedIn,
  isAdminLoggedIn,
} from "@/lib/admin-session";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isAdminLoggedIn()) router.replace("/admin");
  }, [router]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email.trim() || !password) {
      setError("Email and password are required");
      return;
    }

    setLoading(true);
    setTimeout(() => {
      if (verifyAdminCredentials(email, password)) {
        setAdminLoggedIn();
        router.push("/admin");
      } else {
        setError("Invalid email or password");
        setLoading(false);
      }
    }, 400);
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-background">
      <aside className="hidden lg:flex lg:w-[42%] bg-gradient-to-br from-primary via-primary/90 to-primary/80 text-primary-foreground p-10 xl:p-14 flex-col justify-between">
        <div>
          <Link href="/" className="inline-flex items-center gap-2 mb-10">
            <Bike className="h-8 w-8" />
            <span className="text-xl font-bold">AK Bikes</span>
          </Link>
          <h1 className="text-3xl font-bold mb-3">Admin Dashboard</h1>
          <p className="text-primary-foreground/85 text-lg max-w-md">
            Manage inventory, update bike listings, and mark bikes sold from one
            place.
          </p>
        </div>
        <div className="flex items-center gap-3 rounded-2xl bg-white/10 border border-white/20 px-5 py-4">
          <Shield className="h-10 w-10 opacity-90" />
          <p className="text-sm">Authorized staff only</p>
        </div>
      </aside>

      <div className="flex-1 flex items-center justify-center p-4 sm:p-8">
        <div className="w-full max-w-md rounded-2xl border border-border bg-card shadow-xl p-6 sm:p-8">
          <div className="lg:hidden flex items-center gap-2 mb-6 text-primary">
            <Bike className="h-7 w-7" />
            <span className="font-bold text-lg text-foreground">AK Bikes Admin</span>
          </div>
          <h2 className="text-2xl font-bold mb-1">Admin Login</h2>
          <p className="text-sm text-muted-foreground mb-6">
            Sign in to open the dashboard
          </p>

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <div className="space-y-2">
              <Label htmlFor="admin-email">Email</Label>
              <Input
                id="admin-email"
                type="email"
                autoComplete="username"
                placeholder="admin@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-11 rounded-lg"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="admin-password">Password</Label>
              <Input
                id="admin-password"
                type="password"
                autoComplete="current-password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-11 rounded-lg"
              />
            </div>

            {error && (
              <p className="text-sm text-destructive rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2">
                {error}
              </p>
            )}

            <Button
              type="submit"
              className="w-full h-12 rounded-lg font-semibold"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Spinner className="mr-2 h-5 w-5" />
                  Signing in…
                </>
              ) : (
                <>
                  <LogIn className="mr-2 h-5 w-5" />
                  Login to Dashboard
                </>
              )}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            <Link href="/" className="text-primary hover:underline font-medium">
              ← Back to showroom
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
