"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import {
  Flame,
  Timer,
  SlidersHorizontal,
  ChevronRight,
  ChevronLeft,
  X,
  Ruler,
  Layers,
  CupSoda,
  Ban,
  Citrus,
  Droplets,
  CheckCircle2,
  Circle,
} from "lucide-react";
import { useCartStore } from "../store/store";

type SizeOption = { label: string; delta: number };
type ToppingOption = { label: string; price: number };
type Product = {
  id: number;
  name: string;
  category: string;
  price: number;
  img: string;
  sizes: SizeOption[];
  toppings: ToppingOption[];
  pairDrink: boolean;
};
type Drink = { name: string; price: number; icon: typeof CupSoda };

const drinksList: Drink[] = [
  { name: "Cola", price: 2.0, icon: CupSoda },
  { name: "Lemonade", price: 2.25, icon: Citrus },
  { name: "Iced Tea", price: 2.25, icon: CupSoda },
  { name: "Sparkling Water", price: 2.0, icon: Droplets },
];

const products: Product[] = [
  { id: 1, name: "Classic Cheeseburger", category: "Burgers", price: 8.5, img: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&q=80",
    sizes: [{ label: "Single", delta: 0 }, { label: "Double", delta: 3.5 }],
    toppings: [{ label: "Extra cheese", price: 1 }, { label: "Bacon", price: 1.5 }, { label: "Fried egg", price: 1 }, { label: "Jalapeños", price: 0.5 }, { label: "Avocado", price: 1.2 }],
    pairDrink: true },
  { id: 2, name: "Smoky BBQ Burger", category: "Burgers", price: 9.25, img: "https://images.unsplash.com/photo-1553979459-d2229ba7433a?w=600&q=80",
    sizes: [{ label: "Single", delta: 0 }, { label: "Double", delta: 3.5 }],
    toppings: [{ label: "Extra cheese", price: 1 }, { label: "Onion rings", price: 1.5 }, { label: "Bacon", price: 1.5 }, { label: "BBQ drizzle", price: 0.5 }],
    pairDrink: true },
  { id: 3, name: "Spicy Chicken Burger", category: "Burgers", price: 8.75, img: "https://images.unsplash.com/photo-1606755962773-d324e0a13086?w=600&q=80",
    sizes: [{ label: "Single", delta: 0 }, { label: "Double", delta: 3.5 }],
    toppings: [{ label: "Extra cheese", price: 1 }, { label: "Jalapeños", price: 0.5 }, { label: "Spicy mayo", price: 0.5 }],
    pairDrink: true },
  { id: 4, name: "Margherita Pizza", category: "Pizza", price: 11.0, img: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600&q=80",
    sizes: [{ label: '10"', delta: 0 }, { label: '14"', delta: 5 }, { label: '18"', delta: 9 }],
    toppings: [{ label: "Extra cheese", price: 1.5 }, { label: "Basil", price: 0.5 }, { label: "Chili flakes", price: 0 }],
    pairDrink: true },
  { id: 5, name: "Pepperoni Pizza", category: "Pizza", price: 12.5, img: "https://images.unsplash.com/photo-1628840042765-356cda07504e?w=600&q=80",
    sizes: [{ label: '10"', delta: 0 }, { label: '14"', delta: 5 }, { label: '18"', delta: 9 }],
    toppings: [{ label: "Extra pepperoni", price: 2 }, { label: "Mushrooms", price: 1 }, { label: "Olives", price: 1 }, { label: "Extra cheese", price: 1.5 }],
    pairDrink: true },
  { id: 6, name: "BBQ Chicken Pizza", category: "Pizza", price: 13.0, img: "https://images.unsplash.com/photo-1571407970349-bc81e7e96d47?w=600&q=80",
    sizes: [{ label: '10"', delta: 0 }, { label: '14"', delta: 5 }, { label: '18"', delta: 9 }],
    toppings: [{ label: "Extra cheese", price: 1.5 }, { label: "Red onion", price: 0.5 }, { label: "BBQ drizzle", price: 0.5 }],
    pairDrink: true },
  { id: 7, name: "Crispy Fries", category: "Sides", price: 4.0, img: "https://images.unsplash.com/photo-1544145945-f90425340c7e?w=600&q=80",
    sizes: [{ label: "Regular", delta: 0 }, { label: "Large", delta: 1.5 }],
    toppings: [{ label: "Cheese sauce", price: 1 }, { label: "Chili seasoning", price: 0.5 }],
    pairDrink: true },
  { id: 8, name: "Onion Rings", category: "Sides", price: 4.5, img: "https://images.unsplash.com/photo-1639024471283-03518883512d?w=600&q=80",
    sizes: [{ label: "Regular", delta: 0 }, { label: "Large", delta: 1.5 }],
    toppings: [{ label: "Ranch dip", price: 0.75 }, { label: "Spicy mayo", price: 0.75 }],
    pairDrink: true },
  { id: 9, name: "Mozzarella Sticks", category: "Sides", price: 5.25, img: "https://images.unsplash.com/photo-1531749668029-2db88e4276c7?w=600&q=80",
    sizes: [{ label: "Regular", delta: 0 }, { label: "Large", delta: 1.5 }],
    toppings: [{ label: "Marinara dip", price: 0.5 }], pairDrink: true },
  { id: 10, name: "Cola", category: "Drinks", price: 2.0, img: "https://images.unsplash.com/photo-1554866585-cd94860890b7?w=600&q=80",
    sizes: [{ label: "Regular", delta: 0 }, { label: "Large", delta: 0.75 }],
    toppings: [], pairDrink: false },
  { id: 11, name: "Fresh Lemonade", category: "Drinks", price: 2.25, img: "https://images.unsplash.com/photo-1621263764928-df1444c5e859?w=600&q=80",
    sizes: [{ label: "Regular", delta: 0 }, { label: "Large", delta: 0.75 }],
    toppings: [], pairDrink: false },
  { id: 12, name: "Iced Tea", category: "Drinks", price: 2.25, img: "https://images.unsplash.com/photo-1499638673689-79a0b5115d87?w=600&q=80",
    sizes: [{ label: "Regular", delta: 0 }, { label: "Large", delta: 0.75 }],
    toppings: [], pairDrink: false },
  { id: 13, name: "Chocolate Brownie", category: "Desserts", price: 4.75, img: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=600&q=80",
    sizes: [], toppings: [{ label: "Vanilla scoop", price: 1.5 }, { label: "Caramel drizzle", price: 0.75 }], pairDrink: true },
  { id: 14, name: "New York Cheesecake", category: "Desserts", price: 5.25, img: "https://images.unsplash.com/photo-1524351199678-941a58a3df50?w=600&q=80",
    sizes: [], toppings: [{ label: "Berry compote", price: 1 }], pairDrink: true },
];

const categories = ["All", "Burgers", "Pizza", "Sides", "Drinks", "Desserts"];
const PAGE_SIZE = 8;

function OrderPageContent() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const addItem = useCartStore((s) => s.addItem);
  const openCartDrawer = useCartStore((s) => s.openCart);

  const [currentCategory, setCurrentCategory] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);

  const [activeProduct, setActiveProduct] = useState<Product | null>(null);
  const [activeSizeIndex, setActiveSizeIndex] = useState(0);
  const [activeToppings, setActiveToppings] = useState<number[]>([]);
  const [activeDrink, setActiveDrink] = useState("");
  const [activeQty, setActiveQty] = useState(1);
  const [activeSection, setActiveSection] = useState<"size" | "toppings" | "drink">("size");

  // Initialize category from URL once on mount
  useEffect(() => {
    const cat = searchParams.get("category");
    if (cat && categories.includes(cat)) setCurrentCategory(cat);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Open/close the customize drawer based on ?item= in the URL
  useEffect(() => {
    const itemId = searchParams.get("item");
    if (!itemId) {
      setActiveProduct(null);
      return;
    }
    const product = products.find((p) => p.id === Number(itemId));
    if (!product) {
      setActiveProduct(null);
      return;
    }
    setActiveProduct(product);
    setActiveSizeIndex(0);
    setActiveToppings([]);
    setActiveDrink("");
    setActiveQty(1);
    setActiveSection(
      product.sizes.length ? "size" : product.toppings.length ? "toppings" : "drink"
    );
  }, [searchParams]);

  const filteredProducts = useMemo(() => {
    return products.filter(
      (p) => currentCategory === "All" || p.category === currentCategory
    );
  }, [currentCategory]);

  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / PAGE_SIZE));
  const page = Math.min(currentPage, totalPages);
  const pageItems = filteredProducts.slice(
    (page - 1) * PAGE_SIZE,
    (page - 1) * PAGE_SIZE + PAGE_SIZE
  );

  const setCategory = (cat: string) => {
    setCurrentCategory(cat);
    setCurrentPage(1);
  };

  const openItem = (id: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("item", String(id));
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const closeItem = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("item");
    const query = params.toString();
    router.push(query ? `${pathname}?${query}` : pathname, { scroll: false });
  };

  const custTotal = useMemo(() => {
    if (!activeProduct) return 0;
    let total = activeProduct.price;
    if (activeProduct.sizes.length) total += activeProduct.sizes[activeSizeIndex].delta;
    activeToppings.forEach((i) => (total += activeProduct.toppings[i].price));
    if (activeDrink) {
      const d = drinksList.find((d) => d.name === activeDrink);
      if (d) total += d.price;
    }
    return total * activeQty;
  }, [activeProduct, activeSizeIndex, activeToppings, activeDrink, activeQty]);

  const toggleTopping = (i: number) => {
    setActiveToppings((prev) =>
      prev.includes(i) ? prev.filter((x) => x !== i) : [...prev, i]
    );
  };

  const handleAddToCart = () => {
    if (!activeProduct) return;
    let unitPrice = activeProduct.price;
    if (activeProduct.sizes.length) unitPrice += activeProduct.sizes[activeSizeIndex].delta;
    const toppingLabels = activeToppings.map((i) => {
      unitPrice += activeProduct.toppings[i].price;
      return activeProduct.toppings[i].label;
    });
    if (activeDrink) {
      const d = drinksList.find((d) => d.name === activeDrink);
      if (d) unitPrice += d.price;
    }

    const optionParts: string[] = [];
    if (activeProduct.sizes.length) optionParts.push(activeProduct.sizes[activeSizeIndex].label);
    if (toppingLabels.length) optionParts.push(toppingLabels.join(", "));
    if (activeDrink) optionParts.push(`+ ${activeDrink}`);

    addItem({
      name: activeProduct.name,
      img: activeProduct.img,
      unitPrice,
      qty: activeQty,
      options: optionParts.join(" · "),
    });

    closeItem();
    openCartDrawer();
  };

  return (
    <>
      <section className="max-w-7xl mx-auto px-6 lg:px-10 pt-14 pb-8">
        <div className="flex items-center gap-2 text-xs text-[var(--ink)]/40 mb-4">
          <a href="/" className="hover:text-[var(--red)]">Home</a>
          <ChevronRight className="w-3 h-3" />
          <span className="text-[var(--ink)]/70">Order</span>
        </div>
        <div className="flex items-end justify-between flex-wrap gap-4">
          <div>
            <span className="inline-flex items-center gap-2 px-4 py-1.5 border border-dashed border-[var(--ink)]/30 rounded-full text-xs font-semibold uppercase tracking-widest text-[var(--red)] mb-4">
              <Flame className="w-3.5 h-3.5" />
              Fired up daily
            </span>
            <h1 className="font-display text-5xl font-medium leading-[1.05] text-[var(--ink)]">
              Order online
            </h1>
            <p className="mt-3 text-[var(--ink)]/60 max-w-md">
              Pick a category, tap anything to customize it, and send it to the kitchen.
            </p>
          </div>
          <div className="flex items-center gap-8 text-sm text-[var(--ink)]/50">
            <div className="flex items-center gap-2"><Timer className="w-4 h-4" /> Ready in 20 min</div>
            <div className="flex items-center gap-2"><SlidersHorizontal className="w-4 h-4" /> Fully customizable</div>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 lg:px-10 py-8 border-t border-[var(--line)]">
        <div className="flex gap-3 overflow-x-auto pb-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`shrink-0 px-5 py-2.5 rounded-full text-sm font-semibold transition-colors ${
                currentCategory === cat
                  ? "bg-[var(--ink)] text-[var(--paper)]"
                  : "bg-white text-[var(--ink)]/70 hover:bg-[var(--ink)] hover:text-white"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      <section id="shop" className="max-w-7xl mx-auto px-6 lg:px-10 py-6 pb-20">
        {pageItems.length === 0 ? (
          <div className="text-center py-16 text-[var(--ink)]/40 text-sm">
            No items match your search.
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {pageItems.map((p) => (
              <button
                key={p.id}
                onClick={() => openItem(p.id)}
                className="group text-left cursor-pointer"
              >
                <div className="relative rounded-2xl overflow-hidden bg-white aspect-square">
                  <img
                    src={p.img}
                    alt={p.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <span className="absolute bottom-3 right-3 bg-white/90 text-[var(--ink)] text-xs font-semibold px-3 py-1.5 rounded-full flex items-center gap-1.5">
                    <SlidersHorizontal className="w-3 h-3" /> Customize
                  </span>
                </div>
                <div className="mt-3">
                  <span className="text-xs uppercase tracking-wide text-[var(--ink)]/40">{p.category}</span>
                  <h3 className="font-medium text-[var(--ink)] mt-0.5">{p.name}</h3>
                  <p className="text-sm text-[var(--ink)]/50 mt-0.5 font-mono">from ${p.price.toFixed(2)}</p>
                </div>
              </button>
            ))}
          </div>
        )}

        <div className="flex items-center justify-center gap-4 mt-12">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={page <= 1}
            className="w-11 h-11 rounded-full border border-[var(--line)] flex items-center justify-center hover:bg-[var(--ink)] hover:text-white transition-colors disabled:opacity-30 disabled:pointer-events-none"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-sm font-mono text-[var(--ink)]/50">{page} / {totalPages}</span>
          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={page >= totalPages}
            className="w-11 h-11 rounded-full border border-[var(--line)] flex items-center justify-center hover:bg-[var(--ink)] hover:text-white transition-colors disabled:opacity-30 disabled:pointer-events-none"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* Customize drawer */}
      <div
        onClick={closeItem}
        className={`fixed inset-0 bg-black/40 z-50 transition-opacity duration-300 ease-in-out ${
          activeProduct ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      />
      <aside
        className={`side-panel fixed top-0 right-0 h-full w-full sm:w-[460px] bg-[var(--paper)] z-50 flex flex-col shadow-2xl ${
          activeProduct ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {activeProduct && (
          <>
            <div className="relative shrink-0">
              <img src={activeProduct.img} alt={activeProduct.name} className="w-full h-48 object-cover" />
              <button
                onClick={closeItem}
                className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/90 flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="px-6 pt-5 shrink-0">
              <span className="text-xs uppercase tracking-wide text-[var(--red)] font-semibold">
                {activeProduct.category}
              </span>
              <h3 className="font-display text-2xl font-medium text-[var(--ink)] mt-1">
                {activeProduct.name}
              </h3>
              <p className="font-mono text-sm text-[var(--ink)]/50 mt-1">
                Base price ${activeProduct.price.toFixed(2)}
              </p>
            </div>

            <div className="flex flex-1 overflow-hidden mt-5">
              <div className="w-20 shrink-0 border-r border-[var(--line)] flex flex-col items-center gap-2 py-4">
                {activeProduct.sizes.length > 0 && (
                  <button
                    onClick={() => setActiveSection("size")}
                    className={`w-14 h-14 rounded-2xl flex flex-col items-center justify-center gap-1 text-[10px] font-semibold transition-colors ${
                      activeSection === "size" ? "bg-[var(--ink)] text-white" : "text-[var(--ink)]/50"
                    }`}
                  >
                    <Ruler className="w-4 h-4" />
                    Size
                  </button>
                )}
                {activeProduct.toppings.length > 0 && (
                  <button
                    onClick={() => setActiveSection("toppings")}
                    className={`w-14 h-14 rounded-2xl flex flex-col items-center justify-center gap-1 text-[10px] font-semibold transition-colors ${
                      activeSection === "toppings" ? "bg-[var(--ink)] text-white" : "text-[var(--ink)]/50"
                    }`}
                  >
                    <Layers className="w-4 h-4" />
                    Toppings
                  </button>
                )}
                {activeProduct.pairDrink && (
                  <button
                    onClick={() => setActiveSection("drink")}
                    className={`w-14 h-14 rounded-2xl flex flex-col items-center justify-center gap-1 text-[10px] font-semibold transition-colors ${
                      activeSection === "drink" ? "bg-[var(--ink)] text-white" : "text-[var(--ink)]/50"
                    }`}
                  >
                    <CupSoda className="w-4 h-4" />
                    Drink
                  </button>
                )}
              </div>

              <div className="flex-1 overflow-y-auto px-6 py-4">
                {activeSection === "size" && activeProduct.sizes.length > 0 && (
                  <>
                    <h4 className="text-sm font-semibold text-[var(--ink)] mb-4">Choose a size</h4>
                    <div className="space-y-2.5">
                      {activeProduct.sizes.map((s, i) => (
                        <button
                          key={s.label}
                          onClick={() => setActiveSizeIndex(i)}
                          className={`w-full flex items-center justify-between px-4 py-3.5 rounded-xl border text-sm font-medium transition-colors ${
                            i === activeSizeIndex
                              ? "bg-[var(--ink)] text-white border-[var(--ink)]"
                              : "bg-white text-[var(--ink)]/70 border-[var(--line)]"
                          }`}
                        >
                          <span>{s.label}</span>
                          <span className="font-mono">{s.delta > 0 ? `+$${s.delta.toFixed(2)}` : "Included"}</span>
                        </button>
                      ))}
                    </div>
                  </>
                )}

                {activeSection === "toppings" && activeProduct.toppings.length > 0 && (
                  <>
                    <h4 className="text-sm font-semibold text-[var(--ink)] mb-4">Add toppings</h4>
                    <div className="space-y-2.5">
                      {activeProduct.toppings.map((t, i) => {
                        const selected = activeToppings.includes(i);
                        return (
                          <button
                            key={t.label}
                            onClick={() => toggleTopping(i)}
                            className={`w-full flex items-center justify-between px-4 py-3.5 rounded-xl border text-sm font-medium transition-colors ${
                              selected
                                ? "bg-[var(--ink)] text-white border-[var(--ink)]"
                                : "bg-white text-[var(--ink)]/70 border-[var(--line)]"
                            }`}
                          >
                            <span className="flex items-center gap-2.5">
                              {selected ? <CheckCircle2 className="w-4 h-4" /> : <Circle className="w-4 h-4" />}
                              {t.label}
                            </span>
                            <span className="font-mono">{t.price > 0 ? `+$${t.price.toFixed(2)}` : "Free"}</span>
                          </button>
                        );
                      })}
                    </div>
                  </>
                )}

                {activeSection === "drink" && activeProduct.pairDrink && (
                  <>
                    <h4 className="text-sm font-semibold text-[var(--ink)] mb-4">Pair a drink</h4>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        onClick={() => setActiveDrink("")}
                        className={`flex flex-col items-center justify-center gap-2 px-3 py-5 rounded-xl border text-xs font-medium ${
                          activeDrink === ""
                            ? "bg-[var(--ink)] text-white border-[var(--ink)]"
                            : "bg-white text-[var(--ink)]/70 border-[var(--line)]"
                        }`}
                      >
                        <Ban className="w-5 h-5" />
                        No drink
                      </button>
                      {drinksList.map((d) => {
                        const Icon = d.icon;
                        return (
                          <button
                            key={d.name}
                            onClick={() => setActiveDrink(d.name)}
                            className={`flex flex-col items-center justify-center gap-2 px-3 py-5 rounded-xl border text-xs font-medium ${
                              activeDrink === d.name
                                ? "bg-[var(--ink)] text-white border-[var(--ink)]"
                                : "bg-white text-[var(--ink)]/70 border-[var(--line)]"
                            }`}
                          >
                            <Icon className="w-5 h-5" />
                            {d.name}
                            <span className="font-mono">+${d.price.toFixed(2)}</span>
                          </button>
                        );
                      })}
                    </div>
                  </>
                )}
              </div>
            </div>

            <div className="px-6 py-5 border-t border-dashed border-[var(--ink)]/25 shrink-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setActiveQty((q) => Math.max(1, q - 1))}
                    className="w-9 h-9 rounded-full border border-[var(--line)] flex items-center justify-center"
                  >
                    −
                  </button>
                  <span className="w-6 text-center font-medium">{activeQty}</span>
                  <button
                    onClick={() => setActiveQty((q) => q + 1)}
                    className="w-9 h-9 rounded-full border border-[var(--line)] flex items-center justify-center"
                  >
                    +
                  </button>
                </div>
                <button
                  onClick={handleAddToCart}
                  className="bg-[var(--red)] text-white px-6 py-3.5 rounded-full text-sm font-semibold hover:bg-[#a8341a] transition-colors flex items-center gap-2"
                >
                  Add to cart
                  <span className="font-mono">${custTotal.toFixed(2)}</span>
                </button>
              </div>
            </div>
          </>
        )}
      </aside>
    </>
  );
}

export default function OrderPage() {
  return (
    <Suspense fallback={null}>
      <OrderPageContent />
    </Suspense>
  );
}