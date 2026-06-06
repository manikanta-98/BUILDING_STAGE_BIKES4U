"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, Suspense } from "react";
import { MessageCircle, LogIn } from "lucide-react";
import { AuthPageLayout } from "@/components/auth/auth-page-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Spinner } from "@/components/ui/spinner";
import { useAuth } from "@/components/providers/auth-provider";
import { getWhatsAppAuthLink } from "@/lib/auth";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuth();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);

  const redirect = searchParams.get("redirect") || "/";

  const validate = () => {
    const next: Record<string, string> = {};
    if (!identifier.trim()) {
      next.identifier = "Email or phone number is required";
    }
    if (!password) {
      next.password = "Password is required";
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    if (!validate()) return;

    setLoading(true);
    try {
      const user = await login(identifier.trim(), password, remember);
      if (user.role === "admin" && redirect === "/admin") {
        router.push("/admin");
      } else if (redirect.startsWith("/")) {
        router.push(redirect);
      } else {
        router.push("/");
      }
    } catch (err) {
      setFormError(
        err instanceof Error ? err.message : "Login failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthPageLayout variant="login">
      <div className="rounded-2xl border border-border bg-card shadow-xl shadow-black/5 dark:shadow-black/20 p-6 sm:p-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-foreground">Login</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Enter your details to access your account
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <div className="space-y-2">
            <Label htmlFor="identifier">Email or Phone Number</Label>
            <Input
              id="identifier"
              type="text"
              placeholder="you@email.com or 9876543210"
              autoComplete="username"
              value={identifier}
              onChange={(e) => {
                setIdentifier(e.target.value);
                if (errors.identifier) setErrors((p) => ({ ...p, identifier: "" }));
              }}
              className={`h-11 rounded-lg bg-background ${errors.identifier ? "border-destructive" : ""}`}
            />
            {errors.identifier && (
              <p className="text-xs text-destructive">{errors.identifier}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Enter your password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (errors.password) setErrors((p) => ({ ...p, password: "" }));
              }}
              className={`h-11 rounded-lg bg-background ${errors.password ? "border-destructive" : ""}`}
            />
            {errors.password && (
              <p className="text-xs text-destructive">{errors.password}</p>
            )}
          </div>

          <div className="flex items-center justify-between gap-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <Checkbox
                checked={remember}
                onCheckedChange={(v) => setRemember(v === true)}
              />
              <span className="text-sm text-muted-foreground">Remember me</span>
            </label>
            <a
              href={getWhatsAppAuthLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium text-primary hover:underline"
            >
              Forgot password?
            </a>
          </div>

          {formError && (
            <p className="text-sm text-destructive rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2">
              {formError}
            </p>
          )}

          <Button
            type="submit"
            className="w-full h-12 rounded-lg text-base font-semibold shadow-md"
            disabled={loading}
          >
            {loading ? (
              <>
                <Spinner className="mr-2 h-5 w-5" />
                Logging in…
              </>
            ) : (
              <>
                <LogIn className="mr-2 h-5 w-5" />
                Login
              </>
            )}
          </Button>

          <Button
            type="button"
            variant="outline"
            className="w-full h-12 rounded-lg text-base gap-2 border-[#25D366]/40 hover:bg-[#25D366]/10"
            asChild
          >
            <a href={getWhatsAppAuthLink()} target="_blank" rel="noopener noreferrer">
              <MessageCircle className="h-5 w-5 text-[#25D366]" />
              Continue with WhatsApp
            </a>
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          New to AK Bikes?{" "}
          <Link href="/signup" className="font-semibold text-primary hover:underline">
            Create Account
          </Link>
        </p>
      </div>
    </AuthPageLayout>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <Spinner className="h-8 w-8" />
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
