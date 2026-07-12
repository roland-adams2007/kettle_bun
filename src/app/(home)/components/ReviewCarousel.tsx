"use client";

import { useRef, useState } from "react";
import { ArrowLeft, ArrowRight, Star } from "lucide-react";

const reviews = [
  { text: "The BBQ burger showed up still steaming and the fries were properly crisp, not the usual soggy delivery fries.", name: "Tomi A.", location: "Lagos" },
  { text: "Being able to swap toppings before ordering instead of leaving notes and hoping for the best is a genuine relief.", name: "Chidi O.", location: "Lekki" },
  { text: "Ordered the pepperoni pizza twice this week. Twenty minutes both times, right on the mark.", name: "Ngozi E.", location: "Yaba" },
  { text: "Customized my burger with extra pickles and no onions, and it actually came out that way. Small thing that matters.", name: "Femi K.", location: "Ikeja" },
  { text: "Delivery tracking actually matched the driver's real location instead of just guessing an ETA.", name: "Amaka N.", location: "Surulere" },
  { text: "The dessert brownie alone is worth ordering separately. Still warm when it arrived.", name: "Bola S.", location: "Victoria Island" },
];

export default function ReviewCarousel() {
  const trackRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const scrollBy = (dir: 1 | -1) => {
    const track = trackRef.current;
    if (!track) return;
    const cardWidth = track.firstElementChild?.clientWidth ?? 300;
    track.scrollBy({ left: dir * (cardWidth + 24), behavior: "smooth" });
  };

  const handleScroll = () => {
    const track = trackRef.current;
    if (!track) return;
    const cardWidth = track.firstElementChild?.clientWidth ?? 300;
    const index = Math.round(track.scrollLeft / (cardWidth + 24));
    setActiveIndex(index);
  };

  return (
    <section id="reviews" className="max-w-7xl mx-auto px-6 lg:px-10 py-16">
      <div className="flex items-end justify-between mb-8 flex-wrap gap-4">
        <h2 className="font-display text-3xl font-medium text-[var(--ink)]">What people say</h2>
        <div className="hidden sm:flex items-center gap-2">
          <button
            onClick={() => scrollBy(-1)}
            aria-label="Previous reviews"
            className="w-10 h-10 rounded-full border border-[var(--line)] flex items-center justify-center hover:bg-[var(--ink)] hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => scrollBy(1)}
            aria-label="Next reviews"
            className="w-10 h-10 rounded-full border border-[var(--line)] flex items-center justify-center hover:bg-[var(--ink)] hover:text-white transition-colors"
          >
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="relative">
        <div
          ref={trackRef}
          onScroll={handleScroll}
          id="reviewTrack"
          className="flex gap-6 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-2 -mx-6 px-6 lg:mx-0 lg:px-0"
          style={{ scrollbarWidth: "none" }}
        >
          {reviews.map((review) => (
            <div
              key={review.name}
              className="shrink-0 snap-start w-[85%] sm:w-[60%] lg:w-[calc((100%-3rem)/3)] bg-white rounded-2xl p-6 border border-[var(--line)]"
            >
              <div className="flex gap-0.5 text-[var(--mustard)] mb-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
              </div>
              <p className="text-sm text-[var(--ink)]/70 leading-relaxed">{review.text}</p>
              <p className="text-sm font-medium text-[var(--ink)] mt-4">{review.name}</p>
              <p className="text-xs text-[var(--ink)]/40">{review.location}</p>
            </div>
          ))}
        </div>
        <div className="flex sm:hidden items-center justify-center gap-2 mt-5">
          {reviews.map((_, i) => (
            <span
              key={i}
              className={`review-dot ${i === activeIndex ? "active" : ""}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}