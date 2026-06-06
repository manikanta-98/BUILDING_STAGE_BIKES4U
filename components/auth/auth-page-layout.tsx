"use client";

import Link from "next/link";
import Image from "next/image";
import { Bike } from "lucide-react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { AuthSidePanel } from "@/components/auth/auth-side-panel";

interface AuthPageLayoutProps {
  variant: "login" | "signup";
  children: React.ReactNode;
}

export function AuthPageLayout({ variant, children }: AuthPageLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-muted/40">
      <Navbar minimalAuth />
      <main className="flex-1 flex flex-col lg:flex-row">
        <AuthSidePanel variant={variant} />

        {/* Mobile brand strip */}
        <div className="lg:hidden bg-gradient-to-r from-primary to-primary/80 text-primary-foreground px-6 py-8 text-center">
          <Link href="/" className="inline-flex items-center justify-center gap-2 mb-3">
            <Image
              src="/logo.png"
              alt="AK Bikes"
              width={120}
              height={40}
              className="h-10 w-auto brightness-0 invert"
            />
          </Link>
          <p className="text-sm opacity-90 flex items-center justify-center gap-2">
            <Bike className="h-4 w-4" />
            {variant === "login" ? "Welcome back" : "Join AK Bikes"}
          </p>
        </div>

        <div className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-10">
          <div className="w-full max-w-[440px]">{children}</div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
