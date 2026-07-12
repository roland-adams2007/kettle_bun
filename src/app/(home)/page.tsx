// app/(home)/page.tsx
import type { Metadata } from "next";
import Link from "next/link";
import {
  Flame,
  ArrowRight,
  Timer,
  SlidersHorizontal,
  Beef,
  Pizza,
  Soup,
  CupSoda,
  IceCreamCone,
  ChefHat,
  Bike,
} from "lucide-react";
import ReviewCarousel from "./components/ReviewCarousel";

export const metadata: Metadata = {
  title: "Kettle & Bun | Burgers, Pizza & More Delivered Fresh",
  description:
    "Order burgers, pizza, sides, and desserts online. Fresh, fast delivery from Kettle & Bun.",
  metadataBase: new URL("https://yourdomain.com"),
  openGraph: {
    title: "Kettle & Bun",
    description: "Order burgers, pizza, sides, and desserts online.",
    url: "https://yourdomain.com",
    siteName: "Kettle & Bun",
    images: ["/app/logo.png"],
  },
};

const categories = [
  {
    name: "Burgers",
    icon: Beef,
    img: "https://images.unsplash.com/photo-1553979459-d2229ba7433a?w=400&q=80",
  },
  {
    name: "Pizza",
    icon: Pizza,
    img: "https://images.unsplash.com/photo-1628840042765-356cda07504e?w=400&q=80",
  },
  {
    name: "Sides",
    icon: Soup,
    img: "https://images.unsplash.com/photo-1544145945-f90425340c7e?w=400&q=80",
  },
  {
    name: "Drinks",
    icon: CupSoda,
    img: "https://images.unsplash.com/photo-1621263764928-df1444c5e859?w=400&q=80",
  },
  {
    name: "Desserts",
    icon: IceCreamCone,
    img: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=400&q=80",
  },
];

const popularItems = [
  {
    id: 1,
    category: "Burgers",
    name: "Classic Cheeseburger",
    price: "8.50",
    img: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&q=80",
  },
  {
    id: 2,
    category: "Burgers",
    name: "Smoky BBQ Burger",
    price: "9.25",
    img: "https://images.unsplash.com/photo-1553979459-d2229ba7433a?w=500&q=80",
  },
  {
    id: 5,
    category: "Pizza",
    name: "Pepperoni Pizza",
    price: "12.50",
    img: "https://images.unsplash.com/photo-1628840042765-356cda07504e?w=500&q=80",
  },
  {
    id: 7,
    category: "Sides",
    name: "Crispy Fries",
    price: "4.00",
    img: "https://images.unsplash.com/photo-1544145945-f90425340c7e?w=500&q=80",
  },
  {
    id: 11,
    category: "Drinks",
    name: "Fresh Lemonade",
    price: "2.25",
    img: "https://images.unsplash.com/photo-1621263764928-df1444c5e859?w=500&q=80",
  },
  {
    id: 13,
    category: "Desserts",
    name: "Chocolate Brownie",
    price: "4.75",
    img: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=500&q=80",
  },
];

const steps = [
  {
    num: "01",
    icon: SlidersHorizontal,
    title: "Build your plate",
    text: "Pick your size, toppings and a drink to go with it, right from the menu card.",
  },
  {
    num: "02",
    icon: ChefHat,
    title: "Fired up fresh",
    text: "Nothing sits under a heat lamp. Your plate starts once the order hits the kitchen.",
  },
  {
    num: "03",
    icon: Bike,
    title: "Hot on arrival",
    text: "Sealed packaging and routed delivery mean it still steams when it lands at your door.",
  },
];

export default function Home() {
  return (
    <>
      <section className="max-w-7xl mx-auto px-6 lg:px-10 pt-16 pb-20 grid lg:grid-cols-2 gap-12 items-center">
        <div>
          <span className="inline-flex items-center gap-2 px-4 py-1.5 border border-dashed border-[var(--ink)]/30 rounded-full text-xs font-semibold uppercase tracking-widest text-[var(--red)]">
            <Flame className="w-3.5 h-3.5" />
            Fired up daily
          </span>
          <h1 className="font-display text-5xl md:text-6xl font-medium leading-[1.05] mt-6 text-[var(--ink)]">
            Cooked to order,
            <br />
            <span className="italic">delivered hot.</span>
          </h1>
          <p className="mt-6 text-[var(--ink)]/60 text-lg max-w-md leading-relaxed">
            Burgers, pizza, sides and drinks made fresh when you order, not
            before. Build your plate exactly how you want it.
          </p>
          <div className="mt-9 flex items-center gap-4">
            <Link
              href="/order"
              className="bg-[var(--red)] text-white px-7 py-3.5 rounded-full text-sm font-semibold hover:bg-[#a8341a] transition-colors"
            >
              See the menu
            </Link>
            <a
              href="#popular"
              className="text-sm font-semibold text-[var(--ink)] flex items-center gap-1.5 group"
            >
              Popular picks
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </a>
          </div>
          <div className="mt-12 flex items-center gap-8 text-sm text-[var(--ink)]/50">
            <div className="flex items-center gap-2">
              <Timer className="w-4 h-4" /> Ready in 20 min
            </div>
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4" /> Fully customizable
            </div>
          </div>
        </div>
        <div className="relative">
          <img
            src="https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=900&q=80"
            className="rounded-3xl w-full h-[26rem] object-cover"
            alt="Cheeseburger fresh off the grill"
          />
          <div className="absolute -bottom-8 -left-6 sm:-left-10 w-60 bg-white rounded-2xl shadow-xl border border-[var(--line)] p-5 rotate-[-3deg]">
            <div className="ticket-tear h-3 -mt-5 -mx-5 mb-3 bg-[var(--paper)]" />
            <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-widest text-[var(--ink)]/40 mb-3">
              <span>Order #048</span>
              <span>12:04pm</span>
            </div>
            <ul className="font-mono text-xs text-[var(--ink)]/70 space-y-1.5">
              <li className="flex justify-between">
                <span>2x Cheeseburger</span>
                <span>17.00</span>
              </li>
              <li className="flex justify-between">
                <span>1x Fries</span>
                <span>4.00</span>
              </li>
              <li className="flex justify-between">
                <span>1x Lemonade</span>
                <span>2.25</span>
              </li>
            </ul>
            <div className="border-t border-dashed border-[var(--line)] mt-3 pt-3 flex justify-between font-mono text-xs font-bold text-[var(--ink)]">
              <span>Total</span>
              <span>$23.25</span>
            </div>
          </div>
        </div>
      </section>

      <section
        id="categories"
        className="max-w-7xl mx-auto px-6 lg:px-10 pt-8 pb-14 border-t border-[var(--line)]"
      >
        <h2 className="font-display text-2xl font-medium text-[var(--ink)] mb-6">
          What are you in the mood for?
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {categories.map(({ name, icon: Icon, img }, i) => (
            <Link
              key={name}
              href={`/order?category=${name}`}
              className={`group relative rounded-2xl overflow-hidden h-36 ${
                i === categories.length - 1 ? "col-span-2 md:col-span-1" : ""
              }`}
            >
              <img
                src={img}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                alt={name}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
              <div className="absolute bottom-3 left-4 flex items-center gap-2 text-white font-medium text-sm">
                <Icon className="w-4 h-4" /> {name}
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section
        id="popular"
        className="max-w-7xl mx-auto px-6 lg:px-10 py-14 border-t border-[var(--line)]"
      >
        <div className="flex items-end justify-between mb-8 flex-wrap gap-4">
          <div>
            <h2 className="font-display text-3xl font-medium text-[var(--ink)]">
              Popular right now
            </h2>
            <p className="text-sm text-[var(--ink)]/50 mt-1.5">
              A few favorites, tap one to build it your way.
            </p>
          </div>
          <Link
            href="/order"
            className="text-sm font-semibold text-[var(--red)] flex items-center gap-1.5 group shrink-0"
          >
            View full menu
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-5">
          {popularItems.map((item) => (
            <Link
              key={item.id}
              href={`/order?item=${item.id}`}
              className="group"
            >
              <div className="relative rounded-2xl overflow-hidden bg-white aspect-square">
                <img
                  src={item.img}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  alt={item.name}
                />
              </div>
              <div className="mt-3">
                <span className="text-xs uppercase tracking-wide text-[var(--ink)]/40">
                  {item.category}
                </span>
                <h3 className="font-medium text-[var(--ink)] mt-0.5 text-sm">
                  {item.name}
                </h3>
                <p className="text-sm text-[var(--ink)]/50 font-mono">
                  ${item.price}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section id="about" className="bg-[var(--ink)] text-[var(--paper)] mt-14">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 py-20">
          <h2 className="font-display text-3xl font-medium mb-12">
            From tap to table, in three steps
          </h2>
          <div className="grid md:grid-cols-3 gap-10">
            {steps.map(({ num, icon: Icon, title, text }) => (
              <div key={num}>
                <span className="font-mono text-sm text-[var(--mustard)]">
                  {num}
                </span>
                <Icon className="w-7 h-7 my-4 text-[var(--mustard)]" />
                <h3 className="font-display text-xl font-medium mb-2">
                  {title}
                </h3>
                <p className="text-sm text-[var(--paper)]/60 leading-relaxed">
                  {text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <ReviewCarousel />

      <section className="max-w-7xl mx-auto px-6 lg:px-10 pb-16">
        <div className="bg-[var(--red)] rounded-3xl px-8 py-12 md:py-16 flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
          <div>
            <h2 className="font-display text-3xl md:text-4xl font-medium text-white">
              Hungry already?
            </h2>
            <p className="text-white/70 mt-2 max-w-md">
              Build your plate now and it's on the grill in minutes.
            </p>
          </div>
          <Link
            href="/order"
            className="bg-white text-[var(--red)] px-7 py-3.5 rounded-full text-sm font-semibold hover:bg-[var(--paper)] transition-colors shrink-0"
          >
            Start your order
          </Link>
        </div>
      </section>
    </>
  );
}
