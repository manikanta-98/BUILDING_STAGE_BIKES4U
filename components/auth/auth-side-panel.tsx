"use client";

import Image from "next/image";
import Link from "next/link";
import { Bike, CheckCircle2, Shield } from "lucide-react";

const loginBenefits = [
  "Save your wishlist",
  "Track inquiries",
  "Sell your bike faster",
  "Instant WhatsApp support",
];

const signupBenefits = [
  "Save bikes",
  "Get updates",
  "Sell instantly",
  "Contact faster",
];

interface AuthSidePanelProps {
  variant: "login" | "signup";
}

export function AuthSidePanel({ variant }: AuthSidePanelProps) {
  const isLogin = variant === "login";
  const benefits = isLogin ? loginBenefits : signupBenefits;

  return (
    <aside className="hidden lg:flex lg:w-[44%] xl:w-[42%] relative overflow-hidden bg-gradient-to-br from-primary via-primary/90 to-primary/70 text-primary-foreground">
      <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_30%_20%,white_0%,transparent_50%)]" />
      <div className="absolute -right-20 -bottom-20 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
      <div className="absolute -left-10 top-1/3 h-48 w-48 rounded-full bg-white/5 blur-2xl" />

      <div className="relative z-10 flex flex-col justify-between p-10 xl:p-14 w-full min-h-full">
        <div>
          <Link href="/" className="inline-block mb-10">
            <Image
              src="/logo.png"
              alt="AK Bikes"
              width={160}
              height={56}
              className="h-12 w-auto brightness-0 invert drop-shadow-md"
            />
          </Link>

          <h1 className="text-3xl xl:text-4xl font-bold tracking-tight mb-3">
            {isLogin ? "Welcome Back" : "Welcome to AK Bikes"}
          </h1>
          <p className="text-primary-foreground/85 text-lg leading-relaxed max-w-md">
            {isLogin
              ? "Buy or sell your bike easily with AK Bikes."
              : "Create your account and manage your bikes easily."}
          </p>

          <ul className="mt-10 space-y-4">
            {benefits.map((item) => (
              <li key={item} className="flex items-start gap-3 text-base">
                <CheckCircle2 className="h-5 w-5 shrink-0 mt-0.5 opacity-95" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-12 flex items-end justify-between gap-6">
          <div className="flex items-center gap-3 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 px-5 py-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-white/15">
              <Bike className="h-8 w-8" strokeWidth={1.5} />
            </div>
            <div>
              <p className="font-semibold text-sm">Trusted showroom</p>
              <p className="text-xs text-primary-foreground/75">
                Buy · Sell · Exchange in Hyderabad
              </p>
            </div>
          </div>
          <Shield className="h-16 w-16 opacity-25 hidden xl:block" />
        </div>
      </div>
    </aside>
  );
}
