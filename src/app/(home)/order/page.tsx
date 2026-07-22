"use client";

import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams, usePathname } from "next/navigation";
import {
  Flame,
  Timer,
  SlidersHorizontal,
  ChevronRight,
  ChevronLeft,
  X,
  Layers,
  CheckCircle2,
  Circle,
  Loader2,
} from "lucide-react";
import {
  useCartStore,
  useCategoryStore,
  useProductStore,
} from "../store/store";
import type {
  Product,
  ProductOptionGroup,
} from "../store/modules/productStore";

const formatNaira = (amount: number) =>
  `₦${Math.round(amount).toLocaleString("en-NG")}`;

function OrderPageContent() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const addItem = useCartStore((s) => s.addItem);
  const openCartDrawer = useCartStore((s) => s.openCart);

  const {
    fetchCategories,
    isLoading: categoryLoading,
    categories,
    error: categoryError,
  } = useCategoryStore();
  const fetchCategoryRef = useRef(false);

  const {
    products,
    meta,
    isLoading,
    error,
    fetchProducts,
    fetchProductById,
  } = useProductStore();

  const [categoryId, setCategoryId] = useState(
    () => searchParams.get("category") || "all",
  );
  const [itemId, setItemId] = useState<string | null>(() =>
    searchParams.get("item"),
  );
  const [cursorHistory, setCursorHistory] = useState<(string | undefined)[]>([
    undefined,
  ]);
  const [pageIndex, setPageIndex] = useState(0);

  const [activeProduct, setActiveProduct] = useState<Product | null>(null);
  const [itemNotFound, setItemNotFound] = useState(false);
  const [itemLoading, setItemLoading] = useState(false);
  const [selections, setSelections] = useState<Record<string, string[]>>({});
  const [activeGroupId, setActiveGroupId] = useState<string | null>(null);
  const [activeQty, setActiveQty] = useState(1);

  useEffect(() => {
    if (fetchCategoryRef.current) return;
    fetchCategoryRef.current = true;
    fetchCategories();
  }, [fetchCategories]);

  // Once the category list has loaded, drop back to "all" if the id in the
  // URL doesn't actually correspond to a real category.
  useEffect(() => {
    if (categories.length === 0) return;
    const cat = searchParams.get("category");
    if (!cat || cat === "all") return;
    if (!categories.some((c) => c.id === cat)) {
      setCategoryId("all");
    }
  }, [categories]);

  useEffect(() => {
    const onPopState = () => {
      const params = new URLSearchParams(window.location.search);
      setItemId(params.get("item"));
      const cat = params.get("category");
      setCategoryId(cat && categories.some((c) => c.id === cat) ? cat : "all");
    };
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, [categories]);

  useEffect(() => {
    setCursorHistory([undefined]);
    setPageIndex(0);
    fetchProducts({
      categoryId: categoryId === "all" ? undefined : categoryId,
    });
  }, [categoryId, fetchProducts]);

  const applyActiveProduct = (product: Product) => {
    setActiveProduct(product);
    const initialSelections: Record<string, string[]> = {};
    product.optionGroups.forEach((g) => {
      if (g.required && !g.multiple && g.options.length > 0) {
        initialSelections[g.id] = [g.options[0].id];
      } else {
        initialSelections[g.id] = [];
      }
    });
    setSelections(initialSelections);
    setActiveGroupId(product.optionGroups[0]?.id ?? null);
    setActiveQty(1);
  };

  useEffect(() => {
    if (!itemId) {
      setActiveProduct(null);
      setItemNotFound(false);
      setItemLoading(false);
      return;
    }

    const product = products.find((p) => p.id === itemId);
    if (product) {
      setItemNotFound(false);
      setItemLoading(false);
      applyActiveProduct(product);
      return;
    }

    // Not in the currently loaded page (e.g. deep link, pagination) —
    // fetch it directly instead of leaving the drawer silently closed.
    let cancelled = false;
    setItemNotFound(false);
    setItemLoading(true);
    fetchProductById(itemId).then((fetched) => {
      if (cancelled) return;
      setItemLoading(false);
      if (fetched) {
        applyActiveProduct(fetched);
      } else {
        setActiveProduct(null);
        setItemNotFound(true);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [itemId, products, fetchProductById]);

  const pushUrl = (mutate: (p: URLSearchParams) => void) => {
    const params = new URLSearchParams(window.location.search);
    mutate(params);
    const qs = params.toString();
    window.history.pushState(null, "", qs ? `${pathname}?${qs}` : pathname);
  };

  const setCategory = (id: string) => {
    setCategoryId(id);
    setItemId(null);
    pushUrl((p) => {
      if (id === "all") p.delete("category");
      else p.set("category", id);
      p.delete("item");
    });
  };

  const openItem = (id: string) => {
    setItemId(id);
    pushUrl((p) => p.set("item", id));
  };

  const closeItem = () => {
    setItemId(null);
    pushUrl((p) => p.delete("item"));
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const goNext = () => {
    if (!meta?.hasNextPage || !meta.nextCursor || isLoading) return;
    const nextCursor = meta.nextCursor;
    setCursorHistory((prev) => [...prev.slice(0, pageIndex + 1), nextCursor]);
    setPageIndex((i) => i + 1);
    fetchProducts({
      categoryId: categoryId === "all" ? undefined : categoryId,
      cursor: nextCursor,
    });
    scrollToTop();
  };

  const goPrev = () => {
    if (pageIndex <= 0 || isLoading) return;
    const newIndex = pageIndex - 1;
    setPageIndex(newIndex);
    fetchProducts({
      categoryId: categoryId === "all" ? undefined : categoryId,
      cursor: cursorHistory[newIndex],
    });
    scrollToTop();
  };

  const totalPages = meta ? Math.max(1, Math.ceil(meta.total / meta.limit)) : 1;

  const custTotal = useMemo(() => {
    if (!activeProduct) return 0;
    let total = activeProduct.price;
    activeProduct.optionGroups.forEach((g) => {
      const selectedIds = selections[g.id] ?? [];
      g.options.forEach((o) => {
        if (selectedIds.includes(o.id)) total += o.price;
      });
    });
    return total * activeQty;
  }, [activeProduct, selections, activeQty]);

  const toggleOption = (group: ProductOptionGroup, optionId: string) => {
    setSelections((prev) => {
      const current = prev[group.id] ?? [];
      if (group.multiple) {
        const next = current.includes(optionId)
          ? current.filter((id) => id !== optionId)
          : [...current, optionId];
        return { ...prev, [group.id]: next };
      }
      return { ...prev, [group.id]: [optionId] };
    });
  };

  const handleAddToCart = () => {
    if (!activeProduct) return;
    const optionParts: string[] = [];
    activeProduct.optionGroups.forEach((g) => {
      const selectedIds = selections[g.id] ?? [];
      const labels = g.options
        .filter((o) => selectedIds.includes(o.id))
        .map((o) => o.name);
      if (labels.length) optionParts.push(labels.join(", "));
    });

    addItem({
      productId: activeProduct.id,
      name: activeProduct.name,
      img: activeProduct.upload?.path ?? "",
      unitPrice: custTotal / activeQty,
      qty: activeQty,
      options: optionParts.join(" · "),
      selectionData: selections,
    });

    closeItem();
    openCartDrawer();
  };

  const activeGroup = activeProduct?.optionGroups.find(
    (g) => g.id === activeGroupId,
  );

  return (
    <>
      <section className="max-w-7xl mx-auto px-6 lg:px-10 pt-14 pb-8">
        <div className="flex items-center gap-2 text-xs text-[var(--ink)]/40 mb-4">
          <a href="/" className="hover:text-[var(--red)]">
            Home
          </a>
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
              Pick a category, tap anything to customize it, and send it to the
              kitchen.
            </p>
          </div>
          <div className="flex items-center gap-8 text-sm text-[var(--ink)]/50">
            <div className="flex items-center gap-2">
              <Timer className="w-4 h-4" /> Ready in 20 min
            </div>
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4" /> Fully customizable
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 lg:px-10 py-8 border-t border-[var(--line)]">
        {categoryError ? (
          <div className="text-sm text-[var(--red)] py-2">
            Error loading categories: {categoryError}
          </div>
        ) : (
          <div className="flex gap-3 overflow-x-auto pb-2">
            {categoryLoading ? (
              Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="shrink-0 h-10 rounded-full bg-[var(--ink)]/5 animate-pulse"
                  style={{ width: i === 0 ? 56 : 108 }}
                />
              ))
            ) : (
              <>
                <button
                  key="all"
                  onClick={() => setCategory("all")}
                  className={`shrink-0 px-5 py-2.5 rounded-full text-sm font-semibold transition-colors ${
                    categoryId === "all"
                      ? "bg-[var(--ink)] text-[var(--paper)]"
                      : "bg-white text-[var(--ink)]/70 hover:bg-[var(--ink)] hover:text-white"
                  }`}
                >
                  All
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setCategory(cat.id)}
                    className={`shrink-0 px-5 py-2.5 rounded-full text-sm font-semibold transition-colors flex items-center gap-2 ${
                      categoryId === cat.id
                        ? "bg-[var(--ink)] text-[var(--paper)]"
                        : "bg-white text-[var(--ink)]/70 hover:bg-[var(--ink)] hover:text-white"
                    }`}
                  >
                    {cat.coverImage && (
                      <img
                        src={cat.coverImage}
                        alt={cat.name}
                        className="w-5 h-5 rounded-full object-cover"
                      />
                    )}
                    {cat.name}
                  </button>
                ))}
              </>
            )}
          </div>
        )}
      </section>

      <section id="shop" className="max-w-7xl mx-auto px-6 lg:px-10 py-6 pb-20">
        {error ? (
          <div className="text-center py-16 text-[var(--red)] text-sm">
            {error}
          </div>
        ) : isLoading && products.length === 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="rounded-2xl bg-[var(--ink)]/5 aspect-square" />
                <div className="h-3 w-16 bg-[var(--ink)]/5 rounded mt-3" />
                <div className="h-4 w-32 bg-[var(--ink)]/10 rounded mt-2" />
                <div className="h-3 w-20 bg-[var(--ink)]/5 rounded mt-2" />
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-16 text-[var(--ink)]/40 text-sm">
            No items match your search.
          </div>
        ) : (
          <div
            className={`grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 transition-opacity ${
              isLoading ? "opacity-50 pointer-events-none" : "opacity-100"
            }`}
          >
            {products.map((p) => (
              <button
                key={p.id}
                onClick={() => openItem(p.id)}
                className="group text-left cursor-pointer"
              >
                <div className="relative rounded-2xl overflow-hidden bg-white aspect-square">
                  <img
                    src={p.upload?.path ?? ""}
                    alt={p.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <span className="absolute bottom-3 right-3 bg-white/90 text-[var(--ink)] text-xs font-semibold px-3 py-1.5 rounded-full flex items-center gap-1.5">
                    <SlidersHorizontal className="w-3 h-3" /> Customize
                  </span>
                </div>
                <div className="mt-3">
                  <span className="text-xs uppercase tracking-wide text-[var(--ink)]/40">
                    {p.category?.name}
                  </span>
                  <h3 className="font-medium text-[var(--ink)] mt-0.5">
                    {p.name}
                  </h3>
                  <p className="text-sm text-[var(--ink)]/50 mt-0.5 font-mono">
                    from {formatNaira(p.price)}
                  </p>
                </div>
              </button>
            ))}
          </div>
        )}

        <div className="flex items-center justify-center gap-4 mt-12">
          <button
            onClick={goPrev}
            disabled={pageIndex <= 0 || isLoading}
            className="w-11 h-11 rounded-full border border-[var(--line)] flex items-center justify-center hover:bg-[var(--ink)] hover:text-white transition-colors disabled:opacity-30 disabled:pointer-events-none"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-sm font-mono text-[var(--ink)]/50 flex items-center gap-2 min-w-[3.5rem] justify-center">
            {isLoading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
            {pageIndex + 1} / {totalPages}
          </span>
          <button
            onClick={goNext}
            disabled={!meta?.hasNextPage || isLoading}
            className="w-11 h-11 rounded-full border border-[var(--line)] flex items-center justify-center hover:bg-[var(--ink)] hover:text-white transition-colors disabled:opacity-30 disabled:pointer-events-none"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      <div
        onClick={closeItem}
        className={`fixed inset-0 bg-black/40 z-50 transition-opacity duration-200 ease-in-out ${
          activeProduct || itemLoading ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      />

      <aside
        className={`side-panel fixed top-0 right-0 h-full w-full sm:w-[460px] bg-[var(--paper)] z-50 flex flex-col shadow-2xl transition-transform duration-200 ease-out ${
          activeProduct || itemLoading ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {itemLoading && !activeProduct && (
          <div className="flex-1 flex items-center justify-center">
            <Loader2 className="w-6 h-6 animate-spin text-[var(--ink)]/30" />
          </div>
        )}

        {activeProduct && (
          <>
            <div className="relative shrink-0">
              <img
                src={activeProduct.upload?.path ?? ""}
                alt={activeProduct.name}
                className="w-full h-48 object-cover"
              />
              <button
                onClick={closeItem}
                className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/90 flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="px-6 pt-5 shrink-0">
              <span className="text-xs uppercase tracking-wide text-[var(--red)] font-semibold">
                {activeProduct.category?.name}
              </span>
              <h3 className="font-display text-2xl font-medium text-[var(--ink)] mt-1">
                {activeProduct.name}
              </h3>
              <p className="font-mono text-sm text-[var(--ink)]/50 mt-1">
                Base price {formatNaira(activeProduct.price)}
              </p>
            </div>

            <div className="flex flex-1 overflow-hidden mt-5">
              <div className="w-20 shrink-0 border-r border-[var(--line)] flex flex-col items-center gap-2 py-4">
                {activeProduct.optionGroups.map((g) => (
                  <button
                    key={g.id}
                    onClick={() => setActiveGroupId(g.id)}
                    className={`w-14 h-14 rounded-2xl flex flex-col items-center justify-center gap-1 text-[10px] font-semibold text-center px-1 transition-colors ${
                      activeGroupId === g.id
                        ? "bg-[var(--ink)] text-white"
                        : "text-[var(--ink)]/50"
                    }`}
                  >
                    <Layers className="w-4 h-4" />
                    {g.name}
                  </button>
                ))}
              </div>

              <div className="flex-1 overflow-y-auto px-6 py-4">
                {activeGroup && (
                  <>
                    <h4 className="text-sm font-semibold text-[var(--ink)] mb-4">
                      {activeGroup.name}
                      {activeGroup.required && (
                        <span className="text-[var(--red)]"> *</span>
                      )}
                    </h4>
                    <div className="space-y-2.5">
                      {activeGroup.options.map((o) => {
                        const selected = (
                          selections[activeGroup.id] ?? []
                        ).includes(o.id);
                        return (
                          <button
                            key={o.id}
                            onClick={() => toggleOption(activeGroup, o.id)}
                            className={`w-full flex items-center justify-between px-4 py-3.5 rounded-xl border text-sm font-medium transition-colors ${
                              selected
                                ? "bg-[var(--ink)] text-white border-[var(--ink)]"
                                : "bg-white text-[var(--ink)]/70 border-[var(--line)]"
                            }`}
                          >
                            <span className="flex items-center gap-2.5">
                              {activeGroup.multiple &&
                                (selected ? (
                                  <CheckCircle2 className="w-4 h-4" />
                                ) : (
                                  <Circle className="w-4 h-4" />
                                ))}
                              {o.name}
                            </span>
                            <span className="font-mono">
                              {o.price > 0
                                ? `+${formatNaira(o.price)}`
                                : "Included"}
                            </span>
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
                  <span className="w-6 text-center font-medium">
                    {activeQty}
                  </span>
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
                  <span className="font-mono">{formatNaira(custTotal)}</span>
                </button>
              </div>
            </div>
          </>
        )}
      </aside>

      {itemNotFound && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-[var(--ink)] text-white text-sm px-4 py-2.5 rounded-full shadow-lg">
          That item couldn't be found.
        </div>
      )}
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