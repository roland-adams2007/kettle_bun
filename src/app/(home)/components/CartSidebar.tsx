"use client";

import { X, ShoppingBag } from "lucide-react";
import { useCartStore } from "../store/store";

export default function CartSidebar() {
  const isCartOpen = useCartStore((s) => s.isCartOpen);
  const closeCart = useCartStore((s) => s.closeCart);
  const items = useCartStore((s) => s.items);
  const removeItem = useCartStore((s) => s.removeItem);
  const changeQty = useCartStore((s) => s.changeQty);
  const subtotal = useCartStore((s) => s.subtotal());

  return (
    <>
      <div
        onClick={closeCart}
        className={`fixed inset-0 bg-black/40 z-50 transition-opacity duration-300 ease-in-out ${
          isCartOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      />
      <aside
        className={`side-panel fixed top-0 right-0 h-full w-full sm:w-[440px] bg-[var(--paper)] z-50 flex flex-col shadow-2xl ${
          isCartOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between px-6 h-20 border-b border-[var(--line)] shrink-0">
          <h3 className="font-display text-xl font-medium text-[var(--ink)]">
            Your order
          </h3>
          <button
            onClick={closeCart}
            className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-black/5 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-5">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center text-[var(--ink)]/35 gap-3 py-16 fade-up">
              <ShoppingBag className="w-10 h-10" />
              <p className="text-sm">Your order is empty</p>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.cartId} className="flex items-start gap-4 fade-up">
                <img
                  src={item.img}
                  className="w-16 h-16 rounded-xl object-cover"
                  alt={item.name}
                />
                <div className="flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="text-sm font-medium text-[var(--ink)]">
                      {item.name}
                    </h4>
                    <button
                      onClick={() => removeItem(item.cartId)}
                      className="text-[var(--ink)]/30 hover:text-[var(--red)] transition-colors"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  {item.options && (
                    <p className="text-xs text-[var(--ink)]/45 mt-0.5">
                      {item.options}
                    </p>
                  )}
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => changeQty(item.cartId, -1)}
                        className="w-6 h-6 rounded-full border border-[var(--line)] flex items-center justify-center text-xs hover:bg-black/5 transition-colors"
                      >
                        −
                      </button>
                      <span className="text-sm">{item.qty}</span>
                      <button
                        onClick={() => changeQty(item.cartId, 1)}
                        className="w-6 h-6 rounded-full border border-[var(--line)] flex items-center justify-center text-xs hover:bg-black/5 transition-colors"
                      >
                        +
                      </button>
                    </div>
                    <span className="text-sm font-mono font-medium">
                      ${(item.unitPrice * item.qty).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="px-6 py-6 border-t border-dashed border-[var(--ink)]/25 shrink-0">
          <div className="flex items-center justify-between text-sm text-[var(--ink)]/50 mb-1">
            <span>Subtotal</span>
            <span className="font-mono">${subtotal.toFixed(2)}</span>
          </div>
          <div className="flex items-center justify-between font-display text-xl font-medium text-[var(--ink)] mb-5">
            <span>Total</span>
            <span className="font-mono">${subtotal.toFixed(2)}</span>
          </div>
          <button className="w-full bg-[var(--ink)] text-[var(--paper)] py-3.5 rounded-full text-sm font-semibold hover:bg-black transition-colors">
            Checkout
          </button>
        </div>
      </aside>
    </>
  );
}