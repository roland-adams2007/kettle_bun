"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Beef,
  Pizza,
  Soup,
  CupSoda,
  IceCreamCone,
  ChefHat,
  Flame,
  SlidersHorizontal,
  MapPin,
} from "lucide-react";

const team = [
  {
    name: "Tunde A.",
    role: "Founder & head chef",
    img: "https://images.unsplash.com/photo-1583394293214-28ded15ee548?w=500&q=80",
    alt: "Founder and head chef",
  },
  {
    name: "Kemi O.",
    role: "Kitchen operations lead",
    img: "https://images.unsplash.com/photo-1607631568010-a87245c0daf8?w=500&q=80",
    alt: "Kitchen lead",
  },
  {
    name: "Segun I.",
    role: "Delivery & routing lead",
    img: "https://images.unsplash.com/photo-1622021142947-da7dedc7c39a?w=500&q=80",
    alt: "Delivery lead",
  },
  {
    name: "Aisha B.",
    role: "Sous chef",
    img: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=500&q=80",
    alt: "Sous chef",
  },
];

const stats = [
  { value: "2019", label: "Kitchen opened in Yaba" },
  { value: "20 min", label: "Average time to your door" },
  { value: "4", label: "Kitchens across Lagos" },
  { value: "4.8/5", label: "Average order rating" },
];

const promises = [
  {
    icon: Flame,
    title: "Cooked to order",
    body: "Nothing sits under a heat lamp. Your order starts the moment it hits the kitchen, every time.",
  },
  {
    icon: SlidersHorizontal,
    title: "Actually customizable",
    body: "Swap toppings, drop ingredients, build it your way. No notes field, no crossed fingers.",
  },
  {
    icon: MapPin,
    title: "Local, on purpose",
    body: "We keep our delivery radius tight so food arrives hot, not eventually.",
  },
];

export default function AboutPage() {
  return (
    <div className="antialiased">
      <section className="max-w-7xl mx-auto px-6 lg:px-10 pt-16 pb-14 grid lg:grid-cols-2 gap-12 items-center">
        <div>
          <span className="inline-flex items-center gap-2 px-4 py-1.5 border border-dashed border-[var(--ink)]/30 rounded-full text-xs font-semibold uppercase tracking-widest text-[var(--red)]">
            <ChefHat className="w-3.5 h-3.5" />
            Our story
          </span>
          <h1 className="font-display text-5xl md:text-6xl font-medium leading-[1.05] mt-6 text-[var(--ink)]">
            We started because
            <br />
            <span className="italic">delivery food went cold.</span>
          </h1>
          <p className="mt-6 text-[var(--ink)]/60 text-lg max-w-md leading-relaxed">
            Kettle &amp; Bun opened as one small kitchen with a simple rule:
            nothing goes out the door until the order is placed. No steam
            tables, no guessing what people will want tonight.
          </p>
        </div>
        <div className="relative">
          <img
            loading="lazy"
            src="https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=900&q=80"
            className="rounded-3xl w-full h-[26rem] object-cover"
            alt="Kitchen staff plating an order"
          />
          <div className="absolute -bottom-8 -left-6 sm:-left-10 w-56 bg-white rounded-2xl shadow-xl border border-[var(--line)] p-5 rotate-[-3deg]">
            <div className="ticket-tear h-3 -mt-5 -mx-5 mb-3 bg-[var(--paper)]"></div>
            <div className="font-mono text-[10px] uppercase tracking-widest text-[var(--ink)]/40 mb-2">
              Since
            </div>
            <div className="font-display text-3xl font-medium text-[var(--ink)]">
              2019
            </div>
            <p className="text-xs text-[var(--ink)]/50 mt-1">
              One kitchen, Yaba
            </p>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 lg:px-10 py-14 border-t border-[var(--line)]">
        <div className="grid md:grid-cols-3 gap-10">
          <div>
            <span className="font-mono text-sm text-[var(--red)]">
              The problem
            </span>
            <p className="text-[var(--ink)]/70 mt-3 leading-relaxed">
              Most delivery food is cooked ahead and held under heat until an
              order comes in. It travels fine. It just isn&apos;t fresh by the
              time it reaches you.
            </p>
          </div>
          <div>
            <span className="font-mono text-sm text-[var(--red)]">The fix</span>
            <p className="text-[var(--ink)]/70 mt-3 leading-relaxed">
              Every burger, pizza and side starts when your order lands in the
              kitchen, not before. Slower to start, better to eat.
            </p>
          </div>
          <div>
            <span className="font-mono text-sm text-[var(--red)]">
              The result
            </span>
            <p className="text-[var(--ink)]/70 mt-3 leading-relaxed">
              A menu you can actually customize, packaging built to keep heat
              in, and a plate that still steams when it lands at your door.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-[var(--ink)] text-[var(--paper)] mt-4">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 py-20">
          <h2 className="font-display text-3xl font-medium mb-12">
            What we won&apos;t compromise on
          </h2>
          <div className="grid md:grid-cols-3 gap-10">
            {promises.map(({ icon: Icon, title, body }) => (
              <div key={title}>
                <Icon className="w-7 h-7 mb-4 text-[var(--mustard)]" />
                <h3 className="font-display text-xl font-medium mb-2">
                  {title}
                </h3>
                <p className="text-sm text-[var(--paper)]/60 leading-relaxed">
                  {body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 lg:px-10 py-16 border-b border-[var(--line)]">
        <div className="flex items-end justify-between mb-8 flex-wrap gap-4">
          <h2 className="font-display text-3xl font-medium text-[var(--ink)]">
            A few numbers
          </h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map(({ value, label }) => (
            <div
              key={label}
              className="bg-white rounded-2xl p-6 border border-[var(--line)]"
            >
              <div className="font-display text-3xl font-medium text-[var(--ink)]">
                {value}
              </div>
              <p className="text-sm text-[var(--ink)]/50 mt-1">{label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 lg:px-10 py-16">
        <div className="flex items-end justify-between mb-8 flex-wrap gap-4">
          <div>
            <h2 className="font-display text-3xl font-medium text-[var(--ink)]">
              Who&apos;s cooking
            </h2>
            <p className="text-sm text-[var(--ink)]/50 mt-1.5">
              A small team, four kitchens, one standard.
            </p>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {team.map(({ name, role, img, alt }) => (
            <div key={name}>
              <div className="relative rounded-2xl overflow-hidden bg-white aspect-square">
                <img
                  loading="lazy"
                  src={img}
                  className="w-full h-full object-cover"
                  alt={alt}
                />
              </div>
              <div className="mt-3">
                <h3 className="font-medium text-[var(--ink)] text-sm">
                  {name}
                </h3>
                <p className="text-xs text-[var(--ink)]/50">{role}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 lg:px-10 pb-16">
        <div className="bg-[var(--red)] rounded-3xl px-8 py-12 md:py-16 flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
          <div>
            <h2 className="font-display text-3xl md:text-4xl font-medium text-white">
              Come taste it fresh
            </h2>
            <p className="text-white/70 mt-2 max-w-md">
              Build your plate now and it&apos;s on the grill in minutes.
            </p>
          </div>
          <a
            href="/order"
            className="bg-white text-[var(--red)] px-7 py-3.5 rounded-full text-sm font-semibold hover:bg-[var(--paper)] transition-colors shrink-0"
          >
            Start your order
          </a>
        </div>
      </section>
    </div>
  );
}
