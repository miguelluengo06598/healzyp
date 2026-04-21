"use client";

// Cambio: se eliminaron CartCounter y AddToCartBtn.
// El botón de pago ocupa todo el ancho, sin contador de cantidad.
import React from "react";
import { useRouter } from "next/navigation";
import { Product } from "@/types/product.types";

// La prop data se mantiene para no romper la firma que usa Header/index.tsx
const AddToCardSection = ({ data: _data }: { data: Product }) => {
  const router = useRouter();
  return (
    <div className="fixed md:relative w-full bg-white border-t md:border-none border-black/5 bottom-0 left-0 p-4 md:p-0 z-10 flex flex-col gap-2.5">
      {/* Botón principal — Pagar Al Recibir */}
      <button
        type="button"
        className="bg-[#487D26] w-full rounded-full h-11 md:h-[52px] text-sm sm:text-base text-white hover:bg-[#3a6620] transition-all font-bold shadow-[0_4px_14px_rgba(72,125,38,0.3)]"
        onClick={() => router.push("/checkout/cod")}
      >
        Pagar Al Recibir
      </button>

      {/* Botón secundario — Pagar con tarjeta */}
      <button
        type="button"
        className="w-full rounded-full h-11 md:h-[52px] text-sm sm:text-base font-medium border-2 border-[#487D26] bg-white text-[#487D26] hover:bg-[#F0F4EC] transition-all flex items-center justify-center gap-2"
        onClick={() => router.push("/checkout/card")}
      >
        <span>Pagar con tarjeta</span>
        <span className="bg-[#487D26] text-white text-[11px] font-bold px-2 py-0.5 rounded-full leading-tight">
          5€ dto.
        </span>
      </button>
    </div>
  );
};

export default AddToCardSection;
