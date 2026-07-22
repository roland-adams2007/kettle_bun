// src/app/checkout/layout.tsx
"use client";

import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

const PAPER = "#FBF3E7";
const INK = "#201A17";
const LINE = "rgba(32,26,23,0.12)";

export default function CheckoutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  return (
    <div className="min-h-screen antialiased" style={{ background: PAPER, color: INK, fontFamily: "'Work Sans', sans-serif" }}>
      <header className="sticky top-0 z-40 backdrop-blur border-b" style={{ background: `${PAPER}E6`, borderColor: LINE }}>
        <div className="max-w-6xl mx-auto px-6 lg:px-10 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.back()}
              className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-black/5 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <span
              className="italic text-2xl font-semibold tracking-tight"
              style={{ fontFamily: "'Fraunces', serif" }}
            >
              Kettle &amp; Bun
            </span>
          </div>
          <span
            className="text-xs uppercase tracking-widest opacity-40"
            style={{ fontFamily: "'Space Mono', monospace" }}
          >
            Checkout
          </span>
        </div>
      </header>
      {children}
    </div>
  );
}