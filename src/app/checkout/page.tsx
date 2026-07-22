"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { AlertTriangle, Timer, Bike, ShoppingBag } from "lucide-react";
import api from "../(home)/lib/axios";
import { useCartStore } from "../(home)/store/store";
import { RESERVATION_ID_KEY } from "../(home)/hooks/useStartCheckout";

type PromoCode = {
  id: string;
  code: string;
  discountType: "FLAT" | "PERCENT" | "FREE_DELIVERY";
  value: number | null;
};

type ReservationItem = {
  id: string;
  quantity: number;
  price: number;
  options: string[];
  product: { id: string; name: string };
};

type ReservationData = {
  id: string;
  status: string;
  discount: number;
  deliveryFee: number;
  promoCode: PromoCode | null;
  items: ReservationItem[];
};

type DeliveryAreaOption = {
  id: string;
  name: string;
  description: string | null;
  deliveryArea: {
    id: string;
    deliveryFee: number;
    estimatedTime: number | null;
  };
};

type PickupAreaOption = {
  id: string;
  name: string;
  description: string | null;
  locationArea: { id: string; address: string; phone: string | null };
  pickupHours: {
    day: string;
    opensAt: string;
    closesAt: string;
    isClosed: boolean;
  } | null;
};

const INK = "#201A17";
const PAPER = "#FBF3E7";
const RED = "#C1401F";
const LINE = "rgba(32,26,23,0.12)";

const money = (n: number) => "₦" + Math.round(n).toLocaleString("en-NG");

export default function CheckoutPage() {
  const router = useRouter();
  const clearCart = useCartStore((s) => s.clearCart);

  const [reservationId, setReservationId] = useState<string | null>(null);
  const [reservation, setReservation] = useState<ReservationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [note, setNote] = useState("");

  const [mode, setMode] = useState<"DELIVERY" | "PICKUP">("DELIVERY");
  const [deliveryAreas, setDeliveryAreas] = useState<DeliveryAreaOption[]>([]);
  const [pickupAreas, setPickupAreas] = useState<PickupAreaOption[]>([]);
  const [selectedZone, setSelectedZone] = useState<DeliveryAreaOption | null>(
    null,
  );
  const [selectedPickup, setSelectedPickup] = useState<PickupAreaOption | null>(
    null,
  );
  const [address, setAddress] = useState("");

  const [discountInput, setDiscountInput] = useState("");
  const [discountError, setDiscountError] = useState<string | null>(null);
  const [applyingPromo, setApplyingPromo] = useState(false);

  const [placing, setPlacing] = useState(false);
  const [placeError, setPlaceError] = useState<string | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem(RESERVATION_ID_KEY);
    if (!stored) {
      setLoading(false);
      setLoadError("No order in progress");
      return;
    }
    setReservationId(stored);
    (async () => {
      try {
        const res = await api.get(`/reservations/${stored}`);
        setReservation(res.data.data);
      } catch (err: any) {
        setLoadError(
          err?.response?.data?.message ?? "Couldn't load your order",
        );
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const [deliveryRes, pickupRes] = await Promise.all([
          api.get("/areas/all", { params: { type: "delivery" } }),
          api.get("/areas/all", { params: { type: "pickup" } }),
        ]);
        setDeliveryAreas(deliveryRes.data.data);
        setPickupAreas(pickupRes.data.data);
      } catch {
        setDeliveryAreas([]);
        setPickupAreas([]);
      }
    })();
  }, []);

  const subtotal = useMemo(
    () =>
      reservation?.items.reduce((sum, i) => sum + i.price * i.quantity, 0) ?? 0,
    [reservation],
  );

  const fee = useMemo(() => {
    if (mode !== "DELIVERY" || !selectedZone) return 0;
    if (reservation?.promoCode?.discountType === "FREE_DELIVERY") return 0;
    return selectedZone.deliveryArea.deliveryFee;
  }, [mode, selectedZone, reservation]);

  const discount = reservation?.discount ?? 0;
  const total = Math.max(subtotal - discount, 0) + fee;
  const canOrder = mode === "DELIVERY" ? !!selectedZone : !!selectedPickup;

  async function handleApplyPromo() {
    if (!reservationId) return;
    const code = discountInput.trim().toUpperCase();
    if (!code) return;
    setDiscountError(null);
    setApplyingPromo(true);
    try {
      await api.post("/promo/apply", { reservationId, promocode: code });
      const res = await api.get(`/reservations/${reservationId}`);
      setReservation(res.data.data);
      setDiscountInput("");
    } catch (err: any) {
      setDiscountError(err?.response?.data?.message ?? "Couldn't apply code");
    } finally {
      setApplyingPromo(false);
    }
  }

  async function handlePlaceOrder() {
    if (!reservationId || !canOrder) return;
    if (!name.trim()) {
      setPlaceError("Enter your name.");
      return;
    }
    if (!email.trim() || !email.includes("@")) {
      setPlaceError("Enter a valid email so we can send your receipt.");
      return;
    }
    if (!phone.trim()) {
      setPlaceError("Enter a phone number.");
      return;
    }
    if (mode === "DELIVERY" && !address.trim()) {
      setPlaceError("Enter a delivery address.");
      return;
    }

    setPlaceError(null);
    setPlacing(true);
    try {
      const res = await api.patch(`/reservations/${reservationId}/complete`, {
        buyerDetails: { name, email, phone },
        type: mode,
        scheduledFor: new Date(Date.now() + 5 * 60 * 1000).toISOString(),
        deliveryAddress: mode === "DELIVERY" ? address : undefined,
        areaId: mode === "DELIVERY" ? selectedZone?.deliveryArea.id : undefined,
        locationAreaId:
          mode === "PICKUP" ? selectedPickup?.locationArea.id : undefined,
        note: note.trim() || undefined,
      });
      clearCart();
      localStorage.removeItem(RESERVATION_ID_KEY);
      router.push(`/orders/${res.data.data.id}`);
    } catch (err: any) {
      setPlaceError(
        err?.response?.data?.message ?? "Couldn't place your order",
      );
    } finally {
      setPlacing(false);
    }
  }

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

  return (
    <main className="max-w-6xl mx-auto px-6 lg:px-10 py-10 grid lg:grid-cols-[1fr_380px] gap-10 items-start">
      <div className="space-y-8">
        <div>
          <h1
            className="text-2xl font-medium mb-1"
            style={{ fontFamily: "'Fraunces', serif" }}
          >
            How would you like it?
          </h1>
          <p className="text-sm opacity-50">
            Pick delivery or pickup, this decides what shows up next.
          </p>
        </div>

        <div>
          <h2 className="text-sm font-semibold uppercase tracking-wide opacity-40 mb-3">
            Contact details
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="text-sm font-medium">Full name</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                className="mt-2 w-full bg-white rounded-xl px-4 py-2.5 text-sm outline-none transition-colors border"
                style={{ borderColor: LINE }}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Email</label>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                placeholder="you@email.com"
                className="mt-2 w-full bg-white rounded-xl px-4 py-2.5 text-sm outline-none transition-colors border"
                style={{ borderColor: LINE }}
              />
              <p className="text-xs opacity-40 mt-1.5">
                We'll send your receipt and order updates here.
              </p>
            </div>
            <div>
              <label className="text-sm font-medium">Phone number</label>
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                type="tel"
                placeholder="+234 800 000 0000"
                className="mt-2 w-full bg-white rounded-xl px-4 py-2.5 text-sm outline-none transition-colors border"
                style={{ borderColor: LINE }}
              />
            </div>
          </div>
        </div>

        <div
          className="flex items-center gap-1 bg-white rounded-full p-1 w-full sm:w-auto border"
          style={{ borderColor: LINE }}
        >
          <button
            onClick={() => setMode("DELIVERY")}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-colors"
            style={mode === "DELIVERY" ? { background: INK, color: PAPER } : {}}
          >
            <Bike className="w-4 h-4" />
            Delivery
          </button>
          <button
            onClick={() => setMode("PICKUP")}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-colors"
            style={mode === "PICKUP" ? { background: INK, color: PAPER } : {}}
          >
            <ShoppingBag className="w-4 h-4" />
            Pickup
          </button>
        </div>

        {mode === "DELIVERY" && (
          <section className="space-y-5">
            <div>
              <h2 className="text-sm font-semibold uppercase tracking-wide opacity-40 mb-3">
                Choose your area
              </h2>
              {deliveryAreas.length === 0 ? (
                <p
                  className="text-sm opacity-50 py-6 text-center rounded-2xl border border-dashed"
                  style={{ borderColor: LINE }}
                >
                  We're not delivering to any areas right now, try pickup
                  instead.
                </p>
              ) : (
                <div className="grid sm:grid-cols-2 gap-4">
                  {deliveryAreas.map((z) => (
                    <div
                      key={z.id}
                      onClick={() => setSelectedZone(z)}
                      className="cursor-pointer transition-colors bg-white rounded-2xl p-4 border"
                      style={{
                        borderColor: selectedZone?.id === z.id ? RED : LINE,
                        boxShadow:
                          selectedZone?.id === z.id
                            ? `0 0 0 1px ${RED}`
                            : "none",
                      }}
                    >
                      <div className="flex items-start gap-3">
                        <span
                          className="mt-0.5 rounded-full flex-shrink-0 relative"
                          style={{
                            width: 18,
                            height: 18,
                            border: `2px solid ${selectedZone?.id === z.id ? RED : LINE}`,
                          }}
                        >
                          {selectedZone?.id === z.id && (
                            <span
                              className="absolute rounded-full"
                              style={{ inset: 3, background: RED }}
                            />
                          )}
                        </span>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between gap-2">
                            <h3 className="font-medium text-sm">{z.name}</h3>
                            <span
                              className="text-xs opacity-50 shrink-0"
                              style={{ fontFamily: "'Space Mono', monospace" }}
                            >
                              {money(z.deliveryArea.deliveryFee)}
                            </span>
                          </div>
                          {z.description && (
                            <p className="text-xs opacity-40 mt-0.5">
                              {z.description}
                            </p>
                          )}
                          {z.deliveryArea.estimatedTime && (
                            <p className="text-xs opacity-40 mt-1">
                              Est. {z.deliveryArea.estimatedTime} min
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {selectedZone && (
              <div>
                <label className="text-sm font-medium">Delivery address</label>
                <input
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Street, building, apartment / floor"
                  className="mt-2 w-full bg-white rounded-xl px-4 py-2.5 text-sm outline-none transition-colors border"
                  style={{ borderColor: LINE }}
                />
              </div>
            )}
          </section>
        )}

        {mode === "PICKUP" && (
          <section className="space-y-5">
            <div>
              <h2 className="text-sm font-semibold uppercase tracking-wide opacity-40 mb-3">
                Choose a branch
              </h2>
              <div className="grid sm:grid-cols-2 gap-4">
                {pickupAreas.map((p) => (
                  <div
                    key={p.id}
                    onClick={() => setSelectedPickup(p)}
                    className="cursor-pointer transition-colors bg-white rounded-2xl p-4 border"
                    style={{
                      borderColor: selectedPickup?.id === p.id ? RED : LINE,
                      boxShadow:
                        selectedPickup?.id === p.id
                          ? `0 0 0 1px ${RED}`
                          : "none",
                    }}
                  >
                    <div className="flex items-start gap-3">
                      <span
                        className="mt-0.5 rounded-full flex-shrink-0 relative"
                        style={{
                          width: 18,
                          height: 18,
                          border: `2px solid ${selectedPickup?.id === p.id ? RED : LINE}`,
                        }}
                      >
                        {selectedPickup?.id === p.id && (
                          <span
                            className="absolute rounded-full"
                            style={{ inset: 3, background: RED }}
                          />
                        )}
                      </span>
                      <div className="min-w-0 flex-1">
                        <h3 className="font-medium text-sm">{p.name}</h3>
                        <p className="text-xs opacity-40 mt-0.5">
                          {p.locationArea.address}
                        </p>
                        {p.pickupHours && (
                          <p className="text-xs opacity-40 mt-1">
                            {p.pickupHours.isClosed
                              ? "Closed today"
                              : `Today ${p.pickupHours.opensAt} – ${p.pickupHours.closesAt}`}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        <div>
          <label className="text-sm font-medium">Order note (optional)</label>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Anything we should know?"
            rows={3}
            className="mt-2 w-full bg-white rounded-xl px-4 py-2.5 text-sm outline-none transition-colors border resize-none"
            style={{ borderColor: LINE }}
          />
        </div>
      </div>

      <aside
        className="lg:sticky lg:top-28 bg-white rounded-3xl p-6 border"
        style={{ borderColor: LINE }}
      >
        <h2
          className="text-xl font-medium mb-4"
          style={{ fontFamily: "'Fraunces', serif" }}
        >
          Your order
        </h2>
        <div className="h-3 -mx-6 mb-4" style={{ background: PAPER }} />

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
          className="mt-4 pt-4 border-t border-dashed"
          style={{ borderColor: LINE }}
        >
          {reservation.promoCode ? (
            <div
              className="flex items-center justify-between gap-2 rounded-xl px-3 py-2.5 mb-3"
              style={{ background: `${RED}1A` }}
            >
              <div className="min-w-0">
                <p
                  className="text-xs font-semibold"
                  style={{ color: RED, fontFamily: "'Space Mono', monospace" }}
                >
                  {reservation.promoCode.code}
                </p>
                <p className="text-xs opacity-50">
                  {reservation.promoCode.discountType === "FREE_DELIVERY"
                    ? "Free delivery"
                    : reservation.promoCode.discountType === "PERCENT"
                      ? `${reservation.promoCode.value}% off`
                      : `${money(reservation.promoCode.value ?? 0)} off`}
                </p>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <input
                value={discountInput}
                onChange={(e) => setDiscountInput(e.target.value)}
                placeholder="Discount code"
                className="flex-1 min-w-0 bg-white rounded-full px-4 py-2 text-sm outline-none transition-colors uppercase placeholder:normal-case border"
                style={{ borderColor: LINE }}
              />
              <button
                onClick={handleApplyPromo}
                disabled={applyingPromo}
                className="shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors disabled:opacity-40"
                style={{ background: INK, color: PAPER }}
              >
                Apply
              </button>
            </div>
          )}
          {discountError && (
            <p className="text-xs mt-2" style={{ color: RED }}>
              {discountError}
            </p>
          )}
        </div>

        <div
          className="mt-4 pt-4 border-t border-dashed space-y-2 text-sm"
          style={{ borderColor: LINE }}
        >
          <div className="flex justify-between opacity-60">
            <span>Subtotal</span>
            <span style={{ fontFamily: "'Space Mono', monospace" }}>
              {money(subtotal)}
            </span>
          </div>
          {discount > 0 && (
            <div className="flex justify-between" style={{ color: RED }}>
              <span>Discount</span>
              <span style={{ fontFamily: "'Space Mono', monospace" }}>
                -{money(discount)}
              </span>
            </div>
          )}
          <div className="flex justify-between opacity-60">
            <span>{mode === "DELIVERY" ? "Delivery fee" : "Pickup"}</span>
            <span style={{ fontFamily: "'Space Mono', monospace" }}>
              {mode === "PICKUP"
                ? "Free"
                : selectedZone
                  ? fee === 0
                    ? "Free"
                    : money(fee)
                  : "—"}
            </span>
          </div>
        </div>

        <div
          className="mt-4 pt-4 border-t flex justify-between font-semibold"
          style={{ borderColor: LINE }}
        >
          <span>Total</span>
          <span style={{ fontFamily: "'Space Mono', monospace" }}>
            {money(total)}
          </span>
        </div>

        {(selectedZone || selectedPickup) && (
          <p className="text-xs opacity-40 mt-3 flex items-center gap-1.5">
            <Timer className="w-3.5 h-3.5" />
            {mode === "DELIVERY" && selectedZone
              ? `Delivered in ${selectedZone.deliveryArea.estimatedTime ? `${selectedZone.deliveryArea.estimatedTime} min` : "a while"}`
              : selectedPickup
                ? `Ready for pickup at ${selectedPickup.name}`
                : ""}
          </p>
        )}

        {placeError && (
          <p
            className="text-xs mt-3 flex items-center gap-1.5"
            style={{ color: RED }}
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            {placeError}
          </p>
        )}

        <button
          onClick={handlePlaceOrder}
          disabled={!canOrder || placing}
          className="w-full mt-6 text-white px-6 py-3.5 rounded-full text-sm font-semibold transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          style={{ background: RED }}
        >
          {placing
            ? "Placing order…"
            : !canOrder
              ? mode === "DELIVERY"
                ? "Select a delivery area"
                : "Select a pickup branch"
              : `Place order · ${money(total)}`}
        </button>
      </aside>
    </main>
  );
}