"use client";

import React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { integralCF } from "@/styles/fonts";

export type Bundle = {
  id: number;
  name: string;
  price: string;
  priceInCents: number;
  popular: boolean;
};

export const BUNDLES: Bundle[] = [
  { id: 1, name: "1 Bote",  price: "29,99€", priceInCents: 2999, popular: false },
  { id: 2, name: "2 Botes", price: "44,99€", priceInCents: 4499, popular: true  },
  { id: 3, name: "3 Botes", price: "59,99€", priceInCents: 5999, popular: false },
];

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

export default function OrderSummary({ bundle }: { bundle: Bundle }) {
  return (
    <aside className="bg-[#F7F8F5] rounded-[20px] p-5 md:p-6 flex flex-col gap-5">
      {/* Product row */}
      <div className="flex items-center gap-4">
        <div className="relative w-[72px] h-[72px] shrink-0 rounded-[13px] overflow-hidden bg-[#F0EEED]">
          <Image
            src="/images/pic1.png"
            alt="Gominolas de vinagre de manzana"
            fill
            className="object-cover"
            sizes="72px"
          />
        </div>
        <div className="flex flex-col">
          <span
            className={cn(integralCF.className, "text-sm leading-snug")}
          >
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
        <span
          className={cn(
            integralCF.className,
            "text-xl text-[#487D26]"
          )}
        >
          {bundle.price}
        </span>
      </div>

      {/* Trust line */}
      <p className="text-[11px] text-black/40 text-center leading-relaxed">
        🔒 Pago seguro · 🚚 Envío gratis · ↩️ 30 días de devolución
      </p>
    </aside>
  );
}
