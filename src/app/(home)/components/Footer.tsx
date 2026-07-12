import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="max-w-7xl mx-auto px-6 lg:px-10 py-16">
      <div className="grid md:grid-cols-5 gap-10 pb-12 border-b border-[var(--line)]">
        <div className="md:col-span-2">
          <span className="font-display italic text-2xl font-semibold text-[var(--ink)]">
               <Image
            src="/app/logo_description.png"
            alt="Kettle & Bun"
            width={140}
            height={40}
            unoptimized
            className="h-12 w-auto"
          />
          </span>
          <p className="text-sm text-[var(--ink)]/50 mt-4 max-w-xs leading-relaxed">
            Burgers, pizza and more, cooked fresh and delivered while it's still
            hot.
          </p>
          <div className="flex items-center gap-3 mt-6">
            <a
              href="https://instagram.com"
              className="w-9 h-9 rounded-full border border-[var(--line)] flex items-center justify-center hover:bg-[var(--ink)] hover:text-white transition-colors"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
              </svg>
            </a>
            <a
              href="https://twitter.com"
              className="w-9 h-9 rounded-full border border-[var(--line)] flex items-center justify-center hover:bg-[var(--ink)] hover:text-white transition-colors"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </a>
            <a
              href="https://facebook.com"
              className="w-9 h-9 rounded-full border border-[var(--line)] flex items-center justify-center hover:bg-[var(--ink)] hover:text-white transition-colors"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M22 12.06C22 6.505 17.523 2 12 2S2 6.505 2 12.06c0 5.022 3.657 9.184 8.438 9.94v-7.03H7.898v-2.91h2.54V9.845c0-2.508 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.462h-1.26c-1.243 0-1.63.771-1.63 1.562v1.875h2.773l-.443 2.91h-2.33V22c4.78-.756 8.437-4.918 8.437-9.94z" />
              </svg>
            </a>
          </div>
        </div>
        <div>
          <h4 className="text-sm font-semibold text-[var(--ink)] mb-4">Menu</h4>
          <ul className="space-y-2.5 text-sm text-[var(--ink)]/50">
            <li>
              <Link
                href="/order?category=Burgers"
                className="hover:text-[var(--red)]"
              >
                Burgers
              </Link>
            </li>
            <li>
              <Link
                href="/order?category=Pizza"
                className="hover:text-[var(--red)]"
              >
                Pizza
              </Link>
            </li>
            <li>
              <Link
                href="/order?category=Drinks"
                className="hover:text-[var(--red)]"
              >
                Drinks
              </Link>
            </li>
            <li>
              <Link
                href="/order?category=Desserts"
                className="hover:text-[var(--red)]"
              >
                Desserts
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-semibold text-[var(--ink)] mb-4">
            Company
          </h4>
          <ul className="space-y-2.5 text-sm text-[var(--ink)]/50">
            <li>
              <Link href="/about" className="hover:text-[var(--red)]">
                About
              </Link>
            </li>
            <li>
              <Link href="/locations" className="hover:text-[var(--red)]">
                Locations
              </Link>
            </li>
            <li>
              <Link href="/careers" className="hover:text-[var(--red)]">
                Careers
              </Link>
            </li>
            <li>
              <Link href="/contact" className="hover:text-[var(--red)]">
                Contact
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-semibold text-[var(--ink)] mb-4">
            Get updates
          </h4>
          <p className="text-sm text-[var(--ink)]/50 mb-3">
            New menu items, once in a while.
          </p>
          <div className="flex items-center border border-[var(--line)] rounded-full overflow-hidden bg-white">
            <input
              type="email"
              placeholder="Your email"
              className="flex-1 px-4 py-2.5 text-sm outline-none bg-transparent"
            />
            <button className="px-4 text-[var(--red)]">
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
      <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[var(--ink)]/40">
        <span>© 2026 Kettle & Bun. All rights reserved.</span>
        <div className="flex items-center gap-6">
          <Link href="/privacy" className="hover:text-[var(--red)]">
            Privacy
          </Link>
          <Link href="/terms" className="hover:text-[var(--red)]">
            Terms
          </Link>
        </div>
      </div>
    </footer>
  );
}
