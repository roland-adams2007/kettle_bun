"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "../lib/axios";
import { useCartStore } from "../store/store";

export const RESERVATION_ID_KEY = "kettle-bun-reservation-id";

export function useStartCheckout() {
  const router = useRouter();
  const items = useCartStore((s) => s.items);
  const [starting, setStarting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function startCheckout() {
    if (items.length === 0) {
      setError("Your cart is empty");
      return;
    }
    setError(null);
    setStarting(true);
    try {
      const checkoutToken = crypto.randomUUID();
      const res = await api.post(
        "/reservations",
        {
          items: items.map((i) => ({
            productId: i.productId,
            quantity: i.qty,
            selectedOptions: i.selectionData,
          })),
        },
        { headers: { "x-checkout-token": checkoutToken } },
      );
      localStorage.setItem(RESERVATION_ID_KEY, res.data.data.id);
      router.push("/checkout");
    } catch (err: any) {
      setError(err?.response?.data?.message ?? "Couldn't start checkout");
    } finally {
      setStarting(false);
    }
  }

  return { startCheckout, starting, error };
}