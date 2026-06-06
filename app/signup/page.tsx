"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { UserPlus } from "lucide-react";
import { AuthPageLayout } from "@/components/auth/auth-page-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Spinner } from "@/components/ui/spinner";
import { useAuth } from "@/components/providers/auth-provider";

export default function SignupPage() {
  const router = useRouter();
  const { signup } = useAuth();
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [agree, setAgree] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);

  const setField = (key: keyof typeof form, value: string) => {
    setForm((p) => ({ ...p, [key]: value }));
    if (errors[key]) setErrors((e) => ({ ...e, [key]: "" }));
  };

  const validate = () => {
    const next: Record<string, string> = {};
    if (!form.name.trim()) next.name = "Full name is required";
    const phone = form.phone.replace(/\D/g, "");
    if (!phone) next.phone = "Phone number is required";
    else if (phone.length !== 10) next.phone = "Enter a valid 10-digit phone number";
    if (!form.email.trim()) next.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      next.email = "Enter a valid email address";
    }
    if (!form.password) next.password = "Password is required";
    else if (form.password.length < 6) {
      next.password = "Password must be at least 6 characters";
    }
    if (form.password !== form.confirmPassword) {
      next.confirmPassword = "Passwords do not match";
    }
    if (!agree) next.agree = "You must agree to Terms & Privacy";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    if (!validate()) return;

    setLoading(true);
    try {
      await signup(
        {
          name: form.name.trim(),
          phone: form.phone.replace(/\D/g, ""),
          email: form.email.trim(),
          password: form.password,
        },
        true
      );
      router.push("/");
    } catch (err) {
      setFormError(
        err instanceof Error ? err.message : "Signup failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthPageLayout variant="signup">
      <div className="rounded-2xl border border-border bg-card shadow-xl shadow-black/5 dark:shadow-black/20 p-6 sm:p-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-foreground">Create Account</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Sign up to buy, sell, and track your bikes
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              placeholder="Your full name"
              autoComplete="name"
              value={form.name}
              onChange={(e) => setField("name", e.target.value)}
              className={`h-11 rounded-lg ${errors.name ? "border-destructive" : ""}`}
            />
            {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              type="tel"
              inputMode="numeric"
              placeholder="10-digit mobile"
              autoComplete="tel"
              value={form.phone}
              onChange={(e) => setField("phone", e.target.value)}
              className={`h-11 rounded-lg ${errors.phone ? "border-destructive" : ""}`}
            />
            {errors.phone && <p className="text-xs text-destructive">{errors.phone}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@email.com"
              autoComplete="email"
              value={form.email}
              onChange={(e) => setField("email", e.target.value)}
              className={`h-11 rounded-lg ${errors.email ? "border-destructive" : ""}`}
            />
            {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="At least 6 characters"
              autoComplete="new-password"
              value={form.password}
              onChange={(e) => setField("password", e.target.value)}
              className={`h-11 rounded-lg ${errors.password ? "border-destructive" : ""}`}
            />
            {errors.password && (
              <p className="text-xs text-destructive">{errors.password}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirm">Confirm Password</Label>
            <Input
              id="confirm"
              type="password"
              placeholder="Re-enter password"
              autoComplete="new-password"
              value={form.confirmPassword}
              onChange={(e) => setField("confirmPassword", e.target.value)}
              className={`h-11 rounded-lg ${errors.confirmPassword ? "border-destructive" : ""}`}
            />
            {errors.confirmPassword && (
              <p className="text-xs text-destructive">{errors.confirmPassword}</p>
            )}
          </div>

          <label className="flex items-start gap-2 cursor-pointer">
            <Checkbox
              checked={agree}
              onCheckedChange={(v) => {
                setAgree(v === true);
                if (errors.agree) setErrors((e) => ({ ...e, agree: "" }));
              }}
              className="mt-0.5"
            />
            <span className="text-sm text-muted-foreground leading-snug">
              I agree to{" "}
              <span className="text-primary font-medium">Terms</span> &{" "}
              <span className="text-primary font-medium">Privacy</span>
            </span>
          </label>
          {errors.agree && <p className="text-xs text-destructive -mt-2">{errors.agree}</p>}

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
                Creating account…
              </>
            ) : (
              <>
                <UserPlus className="mr-2 h-5 w-5" />
                Create Account
              </>
            )}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link href="/login" className="font-semibold text-primary hover:underline">
            Login
          </Link>
        </p>
      </div>
    </AuthPageLayout>
  );
}
