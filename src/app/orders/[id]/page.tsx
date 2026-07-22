"use client";

import { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  CheckCircle2,
  ChefHat,
  Bike,
  ShoppingBag,
  PackageCheck,
  XCircle,
  Clock,
  MapPin,
} from "lucide-react";
import api from "../../(home)/lib/axios";

type ReservationStatus =
  | "PENDING"
  | "CONFIRMED"
  | "PREPARING"
  | "OUT_FOR_DELIVERY"
  | "READY_FOR_PICKUP"
  | "COMPLETED"
  | "CANCELLED";

type ReservationItem = {
  id: string;
  quantity: number;
  price: number;
  options: string[];
  product: { id: string; name: string };
};

type ReservationData = {
  id: string;
  status: ReservationStatus;
  type: "DELIVERY" | "PICKUP" | null;
  scheduledFor: string | null;
  deliveryAddress: string | null;
  deliveryFee: number;
  discount: number;
  notes: string | null;
  buyer: { name: string; phone: string; email: string | null } | null;
  area: { area: { name: string } } | null;
  locationArea: { address: string; phone: string | null; area: { name: string } } | null;
  items: ReservationItem[];
};

const INK = "#201A17";
const PAPER = "#FBF3E7";
const RED = "#C1401F";
const LINE = "rgba(32,26,23,0.12)";

const POLL_INTERVAL_MS = 10000;

const money = (n: number) => "₦" + Math.round(n).toLocaleString("en-NG");

const DELIVERY_STEPS: { key: ReservationStatus; label: string; icon: typeof CheckCircle2 }[] = [
  { key: "CONFIRMED", label: "Order confirmed", icon: CheckCircle2 },
  { key: "PREPARING", label: "Preparing your order", icon: ChefHat },
  { key: "OUT_FOR_DELIVERY", label: "Out for delivery", icon: Bike },
  { key: "COMPLETED", label: "Delivered", icon: PackageCheck },
];

const PICKUP_STEPS: { key: ReservationStatus; label: string; icon: typeof CheckCircle2 }[] = [
  { key: "CONFIRMED", label: "Order confirmed", icon: CheckCircle2 },
  { key: "PREPARING", label: "Preparing your order", icon: ChefHat },
  { key: "READY_FOR_PICKUP", label: "Ready for pickup", icon: ShoppingBag },
  { key: "COMPLETED", label: "Picked up", icon: PackageCheck },
];

export default function OrderStatusPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const reservationId = params.id;

  const [reservation, setReservation] = useState<ReservationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!reservationId) return;

    let cancelled = false;

    async function load(isInitial: boolean) {
      if (isInitial) setLoading(true);
      try {
        const res = await api.get(`/reservations/${reservationId}`);
        if (cancelled) return;
        setReservation(res.data.data);
        setLoadError(null);
      } catch (err: any) {
        if (cancelled) return;
        setLoadError(
          err?.response?.data?.message ?? "Couldn't load this order",
        );
      } finally {
        if (isInitial && !cancelled) setLoading(false);
      }
    }

    load(true);

    pollRef.current = setInterval(() => load(false), POLL_INTERVAL_MS);

    return () => {
      cancelled = true;
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, [reservationId]);

  // Stop polling once the order reaches a final state
  useEffect(() => {
    if (!reservation) return;
    if (
      (reservation.status === "COMPLETED" || reservation.status === "CANCELLED") &&
      pollRef.current
    ) {
      clearInterval(pollRef.current);
      pollRef.current = null;
    }
  }, [reservation?.status]);

  if (loading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: PAPER, color: INK }}
      >
        <p className="text-sm opacity-50">Loading your order…</p>
      </div>
    );
  }

  if (loadError || !reservation) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: PAPER, color: INK }}
      >
        <div className="text-center">
          <p className="font-medium mb-2">{loadError ?? "Order not found"}</p>
          <button
            onClick={() => router.push("/")}
            className="text-sm underline underline-offset-4"
          >
            Go back to the menu
          </button>
        </div>
      </div>
    );
  }

  const steps = reservation.type === "PICKUP" ? PICKUP_STEPS : DELIVERY_STEPS;
  const currentStepIndex = steps.findIndex((s) => s.key === reservation.status);
  const isCancelled = reservation.status === "CANCELLED";

  const subtotal = reservation.items.reduce(
    (sum, i) => sum + i.price * i.quantity,
    0,
  );
  const total = Math.max(subtotal - reservation.discount, 0) + reservation.deliveryFee;

  return (
    <div className="min-h-screen w-full" style={{ background: PAPER, color: INK }}>
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-10 py-8 sm:py-12">
        <div className="flex items-center justify-between mb-6 sm:mb-8">
          <div>
            <p className="text-xs uppercase tracking-wide opacity-40">Order</p>
            <p
              className="text-sm font-medium"
              style={{ fontFamily: "'Space Mono', monospace" }}
            >
              #{reservation.id.slice(-8).toUpperCase()}
            </p>
          </div>
          <button
            onClick={() => router.push("/")}
            className="text-sm underline underline-offset-4 opacity-60 hover:opacity-100"
          >
            Back to menu
          </button>
        </div>

        {isCancelled ? (
          <div
            className="bg-white rounded-3xl p-6 sm:p-8 border text-center mb-6 sm:mb-8"
            style={{ borderColor: LINE }}
          >
            <XCircle className="w-10 h-10 mx-auto mb-3" style={{ color: RED }} />
            <h1
              className="text-xl font-medium mb-1"
              style={{ fontFamily: "'Fraunces', serif" }}
            >
              Order cancelled
            </h1>
            <p className="text-sm opacity-60">
              This order was cancelled. If you think this is a mistake, reach
              out to us.
            </p>
          </div>
        ) : (
          <div
            className="bg-white rounded-3xl p-5 sm:p-8 border mb-6 sm:mb-8"
            style={{ borderColor: LINE }}
          >
            <h1
              className="text-lg sm:text-xl font-medium mb-5 sm:mb-6"
              style={{ fontFamily: "'Fraunces', serif" }}
            >
              {currentStepIndex >= steps.length - 1
                ? "Your order is complete"
                : "Tracking your order"}
            </h1>

            <div className="flex items-start">
              {steps.map((step, i) => {
                const Icon = step.icon;
                const done = i <= currentStepIndex;
                const isLast = i === steps.length - 1;
                return (
                  <div key={step.key} className="flex-1 flex items-start last:flex-none">
                    <div className="flex flex-col items-center" style={{ width: isLast ? "auto" : "100%" }}>
                      <div
                        className="w-9 h-9 sm:w-11 sm:h-11 rounded-full flex items-center justify-center shrink-0 transition-colors"
                        style={{
                          background: done ? RED : "white",
                          border: `2px solid ${done ? RED : LINE}`,
                          color: done ? "white" : INK,
                          opacity: done ? 1 : 0.4,
                        }}
                      >
                        <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                      </div>
                      <p
                        className="text-[10px] sm:text-xs mt-2 text-center max-w-[64px] sm:max-w-[80px] leading-tight"
                        style={{ opacity: done ? 0.9 : 0.4 }}
                      >
                        {step.label}
                      </p>
                    </div>
                    {!isLast && (
                      <div
                        className="flex-1 h-0.5 mt-[18px] sm:mt-[22px] mx-1 transition-colors"
                        style={{ background: i < currentStepIndex ? RED : LINE }}
                      />
                    )}
                  </div>
                );
              })}
            </div>

            {reservation.status !== "COMPLETED" && (
              <p className="text-xs opacity-40 mt-6 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                This page updates automatically.
              </p>
            )}
          </div>
        )}

        <div
          className="bg-white rounded-3xl p-5 sm:p-6 border mb-6"
          style={{ borderColor: LINE }}
        >
          <h2 className="text-sm font-semibold uppercase tracking-wide opacity-40 mb-3">
            {reservation.type === "PICKUP" ? "Pickup details" : "Delivery details"}
          </h2>
          <div className="flex items-start gap-2 text-sm">
            <MapPin className="w-4 h-4 mt-0.5 shrink-0 opacity-50" />
            <div>
              {reservation.type === "PICKUP" && reservation.locationArea ? (
                <>
                  <p className="font-medium">{reservation.locationArea.area.name}</p>
                  <p className="opacity-60">{reservation.locationArea.address}</p>
                </>
              ) : reservation.type === "DELIVERY" ? (
                <>
                  <p className="font-medium">{reservation.area?.area.name}</p>
                  <p className="opacity-60">{reservation.deliveryAddress}</p>
                </>
              ) : (
                <p className="opacity-60">Not set</p>
              )}
            </div>
          </div>
          {reservation.notes && (
            <p className="text-xs opacity-50 mt-3 pt-3 border-t border-dashed" style={{ borderColor: LINE }}>
              Note: {reservation.notes}
            </p>
          )}
        </div>

        <div
          className="bg-white rounded-3xl p-5 sm:p-6 border"
          style={{ borderColor: LINE }}
        >
          <h2 className="text-sm font-semibold uppercase tracking-wide opacity-40 mb-3">
            Order summary
          </h2>
          <ul
            className="text-xs opacity-70 space-y-2"
            style={{ fontFamily: "'Space Mono', monospace" }}
          >
            {reservation.items.map((item) => (
              <li key={item.id} className="flex justify-between gap-3">
                <span>
                  <div>
                    {item.quantity}x {item.product.name}
                  </div>
                  {item.options.length > 0 && (
                    <div className="opacity-50 mt-0.5">
                      {item.options.join(", ")}
                    </div>
                  )}
                </span>
                <span className="shrink-0">{money(item.price * item.quantity)}</span>
              </li>
            ))}
          </ul>
          <div
            className="mt-4 pt-4 border-t flex justify-between font-semibold text-sm"
            style={{ borderColor: LINE }}
          >
            <span>Total</span>
            <span style={{ fontFamily: "'Space Mono', monospace" }}>
              {money(total)}
            </span>
          </div>
        </div>
      </main>
    </div>
  );
}