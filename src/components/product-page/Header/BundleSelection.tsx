"use client";

import { cn } from "@/lib/utils";
import React, { useEffect, useState } from "react";

// ─── Datos de los bundles ────────────────────────────────────────────────────
// Estos precios coinciden con la tabla `bundles` de Supabase (validado en createOrder).
// TODO: para carga 100% dinámica, pasar los bundles como props desde un Server Component
//       padre que los obtenga con: supabase.from('bundles').select('*').eq('active', true)
//       No se hace aquí porque este componente es "use client" y no puede hacer fetch async
//       sin añadir un servidor intermedio, lo que aumenta la complejidad y el riesgo de rotura.
const bundles = [
  { id: 1, name: "1 Bote",  price: "29,99€", popular: false },
  { id: 2, name: "2 Botes", price: "44,99€", popular: true  },
  { id: 3, name: "3 Botes", price: "59,99€", popular: false },
] as const;

type BundleId = (typeof bundles)[number]["id"];

const BundleSelection = () => {
  // Bundle 2 pre-seleccionado por ser el más popular
  const [selected, setSelected] = useState<BundleId>(2);

  // Sincronizar el bundle seleccionado con localStorage al montar y al cambiar.
  // Esto garantiza que el checkout siempre muestra el mismo bundle que ve el usuario
  // aunque no haya interactuado con los botones.
  useEffect(() => {
    localStorage.setItem("selectedBundle", JSON.stringify({ id: selected }));
  }, [selected]);

  return (
    <div className="flex flex-col">
      {/* Etiqueta igual que "Choose Size" / "Select Colors" del diseño original */}
      <span className="text-sm sm:text-base text-black/60 mb-4">
        Elige tu pack
      </span>

      <div className="flex flex-col gap-3">
        {bundles.map((bundle) => {
          const isSelected = selected === bundle.id;

          return (
            <button
              key={bundle.id}
              type="button"
              onClick={() => setSelected(bundle.id)}
              className={cn(
                "flex items-center justify-between px-5 py-3.5 rounded-[14px] transition-all border-2",
                isSelected
                  ? "bg-[#487D26] text-white border-[#487D26] shadow-[0_4px_14px_rgba(72,125,38,0.25)]"
                  : "bg-[#F7F8F5] text-black border-transparent hover:border-[#487D26]/30 hover:bg-[#F0F4EC]"
              )}
            >
              {/* Nombre del pack */}
              <span className="font-semibold text-sm sm:text-base">
                {bundle.name}
              </span>

              <div className="flex items-center gap-2.5">
                {/* Badge "MÁS POPULAR" */}
                {bundle.popular && (
                  <span
                    className={cn(
                      "font-bold text-[10px] sm:text-[11px] py-1 px-3 rounded-full tracking-wide",
                      isSelected
                        ? "bg-white/25 text-white"
                        : "bg-[#487D26] text-white"
                    )}
                  >
                    MÁS POPULAR
                  </span>
                )}

                {/* Precio */}
                <span className="font-extrabold text-base sm:text-lg">
                  {bundle.price}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default BundleSelection;
