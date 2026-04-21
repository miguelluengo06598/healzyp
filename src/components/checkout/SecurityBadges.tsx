import React from "react";

const badges = [
  { icon: "🚚", label: "ENVÍO GRATIS" },
  { icon: "🔒", label: "COMPRA 100% SEGURA" },
  { icon: "↩️", label: "DEVOLUCIÓN GRATIS" },
  { icon: "✅", label: "PAGO VERIFICADO" },
];

export default function SecurityBadges({
  className = "",
}: {
  className?: string;
}) {
  return (
    <div className={`flex flex-wrap justify-center gap-3 sm:gap-4 ${className}`}>
      {badges.map((b) => (
        <div
          key={b.label}
          className="flex items-center gap-1.5 text-xs text-black/60 font-medium"
        >
          <span className="text-base leading-none">{b.icon}</span>
          <span>{b.label}</span>
        </div>
      ))}
    </div>
  );
}
