"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Phone, Mail, MessageCircle, MapPin } from "lucide-react";

const contactMethods = [
  {
    icon: Phone,
    title: "Call us",
    subtitle: "Daily, 10am – 10pm",
    href: "tel:+2348001234567",
    label: "+234 800 123 4567",
  },
  {
    icon: Mail,
    title: "Email us",
    subtitle: "Replies within a day",
    href: "mailto:hello@kettleandbun.com",
    label: "hello@kettleandbun.com",
  },
  {
    icon: MessageCircle,
    title: "WhatsApp",
    subtitle: "Fastest for quick questions",
    href: "https://wa.me/2348001234567",
    label: "Chat with us",
  },
];

const kitchens = [
  {
    name: "Yaba (flagship)",
    address: "14 Herbert Macaulay Way, Yaba, Lagos",
    hours: "10am – 10pm daily",
  },
  {
    name: "Lekki Phase 1",
    address: "22 Admiralty Way, Lekki, Lagos",
    hours: "10am – 10pm daily",
  },
  {
    name: "Ikeja",
    address: "7 Allen Avenue, Ikeja, Lagos",
    hours: "10am – 10pm daily",
  },
  {
    name: "Surulere",
    address: "39 Adeniran Ogunsanya St, Surulere, Lagos",
    hours: "10am – 10pm daily",
  },
];

export default function ContactPage() {
  return (
    <div className="antialiased">
      <section className="max-w-7xl mx-auto px-6 lg:px-10 pt-16 pb-14">
        <span className="inline-flex items-center gap-2 px-4 py-1.5 border border-dashed border-[var(--ink)]/30 rounded-full text-xs font-semibold uppercase tracking-widest text-[var(--red)]">
          <Phone className="w-3.5 h-3.5" />
          Get in touch
        </span>
        <h1 className="font-display text-5xl md:text-6xl font-medium leading-[1.05] mt-6 text-[var(--ink)] max-w-2xl">
          Questions, catering,
          <br />
          <span className="italic">or just say hi.</span>
        </h1>
        <p className="mt-6 text-[var(--ink)]/60 text-lg max-w-md leading-relaxed">
          Order issues go through{" "}
          <a
            href="/dispute"
            className="text-[var(--red)] font-medium hover:underline"
          >
            order support
          </a>{" "}
          for the fastest response. Everything else, reach us here.
        </p>
      </section>

      <section className="max-w-7xl mx-auto px-6 lg:px-10 pb-16 border-t border-[var(--line)] pt-14">
        <div className="grid md:grid-cols-3 gap-6">
          {contactMethods.map(
            ({ icon: Icon, title, subtitle, href, label }) => (
              <div
                key={title}
                className="bg-white rounded-2xl p-6 border border-[var(--line)]"
              >
                <div className="w-11 h-11 rounded-full bg-[var(--paper)] flex items-center justify-center mb-5">
                  <Icon className="w-5 h-5 text-[var(--red)]" />
                </div>
                <h3 className="font-display text-lg font-medium text-[var(--ink)]">
                  {title}
                </h3>
                <p className="text-sm text-[var(--ink)]/50 mt-1.5 mb-3">
                  {subtitle}
                </p>
                <a
                  href={href}
                  className="font-mono text-sm text-[var(--red)] font-medium"
                >
                  {label}
                </a>
              </div>
            ),
          )}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 lg:px-10 py-16 border-t border-[var(--line)]">
        <div className="flex items-end justify-between mb-8 flex-wrap gap-4">
          <div>
            <h2 className="font-display text-3xl font-medium text-[var(--ink)]">
              Our kitchens
            </h2>
            <p className="text-sm text-[var(--ink)]/50 mt-1.5">
              Stop by, or check if we deliver to you.
            </p>
          </div>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          {kitchens.map(({ name, address, hours }) => (
            <div
              key={name}
              className="bg-white rounded-2xl p-6 border border-[var(--line)] flex items-start gap-4"
            >
              <div className="w-11 h-11 rounded-full bg-[var(--paper)] flex items-center justify-center shrink-0">
                <MapPin className="w-5 h-5 text-[var(--red)]" />
              </div>
              <div>
                <h3 className="font-medium text-[var(--ink)]">{name}</h3>
                <p className="text-sm text-[var(--ink)]/50 mt-1">{address}</p>
                <p className="text-xs text-[var(--ink)]/40 mt-2 font-mono">
                  {hours}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 lg:px-10 pb-16">
        <div className="bg-[var(--ink)] rounded-3xl px-8 py-12 md:py-16 flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
          <div>
            <h2 className="font-display text-3xl md:text-4xl font-medium text-[var(--paper)]">
              Problem with an order?
            </h2>
            <p className="text-[var(--paper)]/60 mt-2 max-w-md">
              File a dispute and we&apos;ll sort it out, usually same day.
            </p>
          </div>
          <a
            href="/dispute"
            className="bg-[var(--red)] text-white px-7 py-3.5 rounded-full text-sm font-semibold hover:bg-[#a8341a] transition-colors shrink-0"
          >
            Report an issue
          </a>
        </div>
      </section>
    </div>
  );
}
