"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import {
  ChevronDown,
  Beef,
  Pizza,
  Soup,
  CupSoda,
  IceCreamCone,
  Utensils,
  ArrowUpRight,
  ShoppingBag,
  Menu,
  type LucideIcon,
} from "lucide-react";
import { useCartStore, useCategoryStore } from "../store/store";

// Maps a category name to an icon; anything not listed here falls back to
// a generic icon instead of breaking.
const CATEGORY_ICONS: Record<string, LucideIcon> = {
  Burgers: Beef,
  Pizza: Pizza,
  Sides: Soup,
  Drinks: CupSoda,
  Desserts: IceCreamCone,
};

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const openCart = useCartStore((s) => s.openCart);
  const isMobileNavOpen = useCartStore((s) => s.isMobileNavOpen);
  const toggleMobileNav = useCartStore((s) => s.toggleMobileNav);
  const cartCount = useCartStore((s) => s.count());

  const { categories, fetchCategories } = useCategoryStore();
  const fetchedRef = useRef(false);

  useEffect(() => {
    if (fetchedRef.current) return;
    fetchedRef.current = true;
    fetchCategories();
  }, [fetchCategories]);

  return (
    <header className="sticky top-0 z-40 bg-[var(--paper)]/90 backdrop-blur border-b border-[var(--line)]">
      <div className="max-w-7xl mx-auto px-6 lg:px-10 h-20 flex items-center justify-between relative">
        <Link href="/" className="flex items-center shrink-0">
          <Image
            src="/app/logo_description.png"
            alt="Kettle & Bun"
            width={140}
            height={40}
            unoptimized
            className="h-12 w-auto"
          />
        </Link>

        <nav className="hidden md:flex items-center gap-9 text-sm font-medium text-[var(--ink)]/70">
          <div className="relative">
            <button
              onClick={() => setIsMenuOpen((v) => !v)}
              className="flex items-center gap-1.5 hover:text-[var(--red)] transition-colors"
            >
              Menu
              <ChevronDown
                className={`w-3.5 h-3.5 transition-transform duration-200 ${
                  isMenuOpen ? "rotate-180" : ""
                }`}
              />
            </button>
            <div
              className={`absolute top-full left-1/2 -translate-x-1/2 mt-4 w-64 bg-white rounded-2xl shadow-xl border border-[var(--line)] py-3 z-50 origin-top transition-all duration-200 ease-out ${
                isMenuOpen
                  ? "opacity-100 scale-100 translate-y-0 pointer-events-auto"
                  : "opacity-0 scale-95 -translate-y-2 pointer-events-none"
              }`}
            >
              {categories.length === 0
                ? Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="px-5 py-2.5">
                      <div className="h-4 w-24 rounded bg-[var(--ink)]/5 animate-pulse" />
                    </div>
                  ))
                : categories.map((cat) => {
                    const Icon = CATEGORY_ICONS[cat.name] ?? Utensils;
                    return (
                      <Link
                        key={cat.id}
                        href={`/order?category=${cat.id}`}
                        className="flex items-center justify-between px-5 py-2.5 hover:bg-[var(--paper)] text-sm"
                      >
                        <span className="flex items-center gap-2.5">
                          <Icon className="w-4 h-4 text-[var(--red)]" /> {cat.name}
                        </span>
                        <ArrowUpRight className="w-3.5 h-3.5 text-[var(--ink)]/30" />
                      </Link>
                    );
                  })}
            </div>
          </div>
          <Link
            href="/order"
            className="hover:text-[var(--red)] transition-colors"
          >
            Order
          </Link>
          <Link
            href="/about"
            className="hover:text-[var(--red)] transition-colors"
          >
            About
          </Link>
          <Link
            href="/contact"
            className="hover:text-[var(--red)] transition-colors"
          >
            Contact
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <button
            onClick={openCart}
            className="relative flex items-center gap-2 bg-[var(--ink)] text-[var(--paper)] px-4 py-2.5 rounded-full text-sm font-medium hover:bg-black transition-colors"
          >
            <ShoppingBag className="w-4 h-4" />
            <span className="hidden sm:inline">Cart</span>
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-[var(--red)] text-white text-[11px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </button>

          <button
            onClick={toggleMobileNav}
            className="md:hidden w-10 h-10 rounded-full flex items-center justify-center text-[var(--ink)]/70 hover:bg-black/5 transition-colors"
            aria-label="Open menu"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div
        className={`md:hidden grid transition-[grid-template-rows] duration-300 ease-in-out ${
          isMobileNavOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        }`}
      >
        <div className="overflow-hidden">
          <div
            className={`border-t border-[var(--line)] bg-[var(--paper)] px-6 py-4 space-y-1 transition-all duration-300 ease-in-out ${
              isMobileNavOpen
                ? "opacity-100 translate-y-0"
                : "opacity-0 -translate-y-2"
            }`}
          >
            {categories.map((cat) => {
              const Icon = CATEGORY_ICONS[cat.name] ?? Utensils;
              return (
                <Link
                  key={cat.id}
                  href={`/order?category=${cat.id}`}
                  className="flex items-center gap-2.5 px-2 py-2.5 rounded-xl hover:bg-black/5 text-sm font-medium"
                >
                  <Icon className="w-4 h-4 text-[var(--red)]" /> {cat.name}
                </Link>
              );
            })}
            <div className="border-t border-[var(--line)] my-2" />
            <Link
              href="/order"
              className="block px-2 py-2.5 rounded-xl hover:bg-black/5 text-sm font-medium"
            >
              Order
            </Link>
            <Link
              href="/about"
              className="block px-2 py-2.5 rounded-xl hover:bg-black/5 text-sm font-medium"
            >
              About
            </Link>
            <Link
              href="/contact"
              className="block px-2 py-2.5 rounded-xl hover:bg-black/5 text-sm font-medium"
            >
              Contact
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}