"use client";

import React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { integralCF } from "@/styles/fonts";
import { FaCheck } from "react-icons/fa";

// ─── Constants ────────────────────────────────────────────────────────────────

/** Single source of truth for the card-payment discount (in euro cents). */
export const CARD_DISCOUNT_CENTS = 500; // €5.00

// ─── Types ────────────────────────────────────────────────────────────────────

export type Bundle = {
  id: number;
  name: string;
  price: string;
  priceInCents: number;
  popular: boolean;
};

// Estos precios coinciden con la tabla `bundles` de Supabase (el pedido se valida en createOrder).
// TODO: para carga 100% dinámica, obtener bundles desde Supabase en el Server Component padre
//       y pasarlos como props. No se refactoriza aquí para no romper el flujo de checkout
//       que depende de getStoredBundle() + localStorage con los IDs de estos bundles.
export const BUNDLES: Bundle[] = [
  { id: 1, name: "1 Bote",  price: "29,99€", priceInCents: 2999, popular: false },
  { id: 2, name: "2 Botes", price: "44,99€", priceInCents: 4499, popular: true  },
  { id: 3, name: "3 Botes", price: "59,99€", priceInCents: 5999, popular: false },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Format euro cents to a localised price string, e.g. 2499 → "24,99€" */
export function formatPrice(cents: number): string {
  return (cents / 100).toFixed(2).replace(".", ",") + "€";
}

export function getStoredBundle(): Bundle {
  if (typeof window === "undefined") return BUNDLES[1];
  try {
    const raw = localStorage.getItem("selectedBundle");
    if (raw) {
      const parsed = JSON.parse(raw) as { id: number };
      const found = BUNDLES.find((b) => b.id === parsed.id);
      if (found) return found;
    }
  } catch {
    // ignore
  }
  return BUNDLES[1]; // default: 2 Botes
}

// ─── Component ────────────────────────────────────────────────────────────────

type OrderSummaryProps = {
  bundle: Bundle;
  /**
   * Optional discount in euro cents applied to this order.
   * When provided the total line reflects the reduced price and a discount
   * row is shown in the breakdown.
   */
  discountInCents?: number;
};

export default function OrderSummary({
  bundle,
  discountInCents = 0,
}: OrderSummaryProps) {
  const hasDiscount = discountInCents > 0;
  const totalCents = bundle.priceInCents - discountInCents;

  return (
    <aside className="bg-[#F7F8F5] rounded-[20px] p-5 md:p-6 flex flex-col gap-5">
      {/* Product row */}
      <div className="flex items-center gap-4">
        <div className="relative w-[72px] h-[72px] shrink-0 rounded-[13px] overflow-hidden bg-[#F0EEED]">
          <Image
            src="/images/FOTOPRODUCT1.png"
            alt="Gominolas de vinagre de manzana"
            fill
            className="object-cover"
            sizes="72px"
          />
        </div>
        <div className="flex flex-col">
          <span className={cn(integralCF.className, "text-sm leading-snug")}>
            Gominolas de vinagre de manzana
          </span>
          <span className="text-xs text-black/50 mt-0.5">{bundle.name}</span>
        </div>
      </div>

      <hr className="border-t-black/10" />

      {/* Pricing breakdown */}
      <dl className="flex flex-col gap-2 text-sm">
        <div className="flex justify-between text-black/70">
          <dt>Subtotal</dt>
          <dd className="font-medium">{bundle.price}</dd>
        </div>

        {/* Discount line — only shown when a discount is active */}
        {hasDiscount && (
          <div className="flex justify-between text-[#487D26]">
            <dt className="font-medium">Descuento tarjeta</dt>
            <dd className="font-semibold">-{formatPrice(discountInCents)}</dd>
          </div>
        )}

        <div className="flex justify-between text-black/70">
          <dt>Envío</dt>
          <dd className="flex items-center gap-1.5">
            <s className="text-black/40 text-xs">9,99€</s>
            <span className="text-[#487D26] font-semibold">GRATIS</span>
          </dd>
        </div>
      </dl>

      <hr className="border-t-black/10" />

      <div className="flex justify-between items-center">
        <span className="font-bold text-base">Total</span>
        <span className={cn(integralCF.className, "text-xl text-[#487D26]")}>
          {formatPrice(totalCents)}
        </span>
      </div>

      {/* Card discount confirmation badge */}
      {hasDiscount && (
        <div className="bg-[#F0F4EC] border border-[#487D26]/20 rounded-[12px] px-3 py-2.5 flex items-center gap-2">
          <FaCheck className="text-[#487D26] text-[10px] shrink-0" />
          <span className="text-xs text-[#487D26] font-medium">
            Descuento de {formatPrice(discountInCents)} aplicado por pago con
            tarjeta
          </span>
        </div>
      )}

      {/* Trust line */}
      <p className="text-[11px] text-black/40 text-center leading-relaxed">
        🔒 Pago seguro · 🚚 Envío gratis · ↩️ 30 días de devolución
      </p>
    </aside>
  );
}
