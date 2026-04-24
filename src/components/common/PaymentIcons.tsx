import Image from "next/image";

const ICONS = [
  { src: "/icons/Visa.svg",       alt: "Visa",        w: 38 },
  { src: "/icons/mastercard.svg", alt: "Mastercard",  w: 30 },
  { src: "/icons/paypal.svg",     alt: "PayPal",      w: 56 },
  { src: "/icons/applePay.svg",   alt: "Apple Pay",   w: 40 },
  { src: "/icons/googlePay.svg",  alt: "Google Pay",  w: 46 },
];

/**
 * Subtle row of payment method logos.
 * Drop below any CTA button to add trust signals without visual noise.
 */
export default function PaymentIcons({ className = "" }: { className?: string }) {
  return (
    <div
      className={`flex items-center justify-center gap-3 flex-wrap ${className}`}
    >
      {ICONS.map(({ src, alt, w }) => (
        <Image
          key={alt}
          src={src}
          alt={alt}
          width={w}
          height={20}
          style={{ height: "20px", width: "auto" }}
          className="opacity-60 object-contain"
        />
      ))}
    </div>
  );
}
