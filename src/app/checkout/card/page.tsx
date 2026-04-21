"use client";

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { integralCF } from "@/styles/fonts";
import OrderSummary, {
  Bundle,
  getStoredBundle,
} from "@/components/checkout/OrderSummary";
import SecurityBadges from "@/components/checkout/SecurityBadges";
import { stripePromise } from "@/lib/stripe";
import { FaCheckCircle, FaLock } from "react-icons/fa";
import { FaCircleXmark } from "react-icons/fa6";

// Stripe imports — loaded client-side only
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";

// ─── Types ────────────────────────────────────────────────────────────────────

type FormValues = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  province: string;
  postcode: string;
  // honeypot
  _hp: string;
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

const PHONE_RE = /^(\+34|0034|34)?[6789]\d{8}$/;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function InputWrapper({
  label,
  error,
  success,
  children,
}: {
  label: string;
  error?: string;
  success?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-medium text-black/70">{label}</label>
      <div className="relative">
        {children}
        {success && !error && (
          <FaCheckCircle className="absolute right-4 top-1/2 -translate-y-1/2 text-[#487D26] text-sm pointer-events-none" />
        )}
        {error && (
          <FaCircleXmark className="absolute right-4 top-1/2 -translate-y-1/2 text-red-400 text-sm pointer-events-none" />
        )}
      </div>
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}

const inputCls = (error?: string, success?: boolean) =>
  cn(
    "w-full rounded-full px-5 py-3 border text-sm outline-none transition-all pr-10",
    error
      ? "border-red-400 focus:ring-1 focus:ring-red-400/30"
      : success
      ? "border-[#487D26] focus:ring-1 focus:ring-[#487D26]/30"
      : "border-black/20 focus:border-[#487D26] focus:ring-1 focus:ring-[#487D26]/30"
  );

// ─── Inner form (needs Stripe context) ───────────────────────────────────────

function CheckoutForm({ bundle }: { bundle: Bundle }) {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();

  const [submitting, setSubmitting] = useState(false);
  const [stripeError, setStripeError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, touchedFields },
  } = useForm<FormValues>({ mode: "onTouched" });

  const watched = watch();

  // Mapbox AddressAutofill — dynamic import to avoid SSR issues
  const [AddressAutofill, setAddressAutofill] =
    useState<React.ComponentType<any> | null>(null);

  useEffect(() => {
    import("@mapbox/search-js-react").then((mod) => {
      setAddressAutofill(() => mod.AddressAutofill);
    });
  }, []);

  const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN ?? "";

  const onSubmit = async (data: FormValues) => {
    if (data._hp) return; // honeypot

    if (!stripe || !elements) {
      setStripeError("El sistema de pago no está listo. Recarga la página.");
      return;
    }

    setSubmitting(true);
    setStripeError(null);

    // Submit the PaymentElement (collects card details)
    const { error: submitError } = await elements.submit();
    if (submitError) {
      setStripeError(submitError.message ?? "Error al procesar el pago.");
      setSubmitting(false);
      return;
    }

    // TODO: call your backend to create a PaymentIntent and get clientSecret
    // const res = await fetch("/api/create-payment-intent", {
    //   method: "POST",
    //   body: JSON.stringify({ bundleId: bundle.id }),
    // });
    // const { clientSecret } = await res.json();

    // TODO: confirm payment with Stripe
    // const { error: confirmError } = await stripe.confirmPayment({
    //   elements,
    //   clientSecret,
    //   confirmParams: { return_url: `${window.location.origin}/checkout/success` },
    // });
    // if (confirmError) { setStripeError(confirmError.message); setSubmitting(false); return; }

    // ── Demo: simulate successful payment ──
    await new Promise((r) => setTimeout(r, 1500));
    setSubmitting(false);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <FaCheckCircle className="text-[#487D26] text-6xl mb-6" />
        <h2 className={cn(integralCF.className, "text-3xl md:text-4xl mb-4")}>
          ¡Pago completado!
        </h2>
        <p className="text-black/60 max-w-md mb-8">
          Tu pedido ha sido procesado correctamente. Recibirás un email de
          confirmación en breve.
        </p>
        <button
          onClick={() => router.push("/")}
          className="bg-[#487D26] hover:bg-[#3a6620] transition-all text-white rounded-full px-8 py-3 font-medium"
        >
          Volver al inicio
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      {/* Honeypot */}
      <input
        type="text"
        tabIndex={-1}
        aria-hidden="true"
        className="absolute opacity-0 pointer-events-none h-0 w-0"
        {...register("_hp")}
      />

      {/* Personal info */}
      <section className="mb-8">
        <h3 className="font-bold text-base mb-4">Datos personales</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <InputWrapper
            label="Nombre *"
            error={errors.firstName?.message}
            success={
              touchedFields.firstName && !errors.firstName && !!watched.firstName
            }
          >
            <input
              type="text"
              autoComplete="given-name"
              placeholder="María"
              className={inputCls(
                errors.firstName?.message,
                touchedFields.firstName && !errors.firstName && !!watched.firstName
              )}
              {...register("firstName", {
                required: "El nombre es obligatorio",
                minLength: { value: 2, message: "Mínimo 2 caracteres" },
              })}
            />
          </InputWrapper>

          <InputWrapper
            label="Apellidos *"
            error={errors.lastName?.message}
            success={
              touchedFields.lastName && !errors.lastName && !!watched.lastName
            }
          >
            <input
              type="text"
              autoComplete="family-name"
              placeholder="García López"
              className={inputCls(
                errors.lastName?.message,
                touchedFields.lastName && !errors.lastName && !!watched.lastName
              )}
              {...register("lastName", {
                required: "Los apellidos son obligatorios",
                minLength: { value: 2, message: "Mínimo 2 caracteres" },
              })}
            />
          </InputWrapper>

          <InputWrapper
            label="Correo electrónico *"
            error={errors.email?.message}
            success={touchedFields.email && !errors.email && !!watched.email}
          >
            <input
              type="email"
              autoComplete="email"
              placeholder="maria@ejemplo.com"
              className={inputCls(
                errors.email?.message,
                touchedFields.email && !errors.email && !!watched.email
              )}
              {...register("email", {
                required: "El email es obligatorio",
                pattern: { value: EMAIL_RE, message: "Email no válido" },
              })}
            />
          </InputWrapper>

          <InputWrapper
            label="Teléfono *"
            error={errors.phone?.message}
            success={touchedFields.phone && !errors.phone && !!watched.phone}
          >
            <input
              type="tel"
              autoComplete="tel"
              placeholder="612 345 678"
              className={inputCls(
                errors.phone?.message,
                touchedFields.phone && !errors.phone && !!watched.phone
              )}
              {...register("phone", {
                required: "El teléfono es obligatorio",
                pattern: {
                  value: PHONE_RE,
                  message: "Teléfono español no válido",
                },
              })}
            />
          </InputWrapper>
        </div>
      </section>

      {/* Shipping address */}
      <section className="mb-8">
        <h3 className="font-bold text-base mb-4">Dirección de envío</h3>
        <div className="flex flex-col gap-4">
          <InputWrapper
            label="Dirección *"
            error={errors.address?.message}
            success={
              touchedFields.address && !errors.address && !!watched.address
            }
          >
            {AddressAutofill && mapboxToken ? (
              <AddressAutofill
                accessToken={mapboxToken}
                options={{ country: "es", language: "es" }}
                onRetrieve={(res: any) => {
                  const f = res.features?.[0]?.properties;
                  if (!f) return;
                  if (f.address_line1)
                    setValue("address", f.address_line1, {
                      shouldValidate: true,
                    });
                  if (f.place)
                    setValue("city", f.place, { shouldValidate: true });
                  if (f.postcode)
                    setValue("postcode", f.postcode, { shouldValidate: true });
                  if (f.region)
                    setValue("province", f.region, { shouldValidate: true });
                }}
              >
                <input
                  type="text"
                  autoComplete="address-line1"
                  placeholder="Calle Mayor 12, 3º B"
                  className={inputCls(
                    errors.address?.message,
                    touchedFields.address && !errors.address && !!watched.address
                  )}
                  {...register("address", {
                    required: "La dirección es obligatoria",
                    minLength: { value: 5, message: "Dirección muy corta" },
                  })}
                />
              </AddressAutofill>
            ) : (
              <input
                type="text"
                autoComplete="address-line1"
                placeholder="Calle Mayor 12, 3º B"
                className={inputCls(
                  errors.address?.message,
                  touchedFields.address && !errors.address && !!watched.address
                )}
                {...register("address", {
                  required: "La dirección es obligatoria",
                  minLength: { value: 5, message: "Dirección muy corta" },
                })}
              />
            )}
          </InputWrapper>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <InputWrapper
              label="Código postal *"
              error={errors.postcode?.message}
              success={
                touchedFields.postcode && !errors.postcode && !!watched.postcode
              }
            >
              <input
                type="text"
                autoComplete="postal-code"
                placeholder="28001"
                maxLength={5}
                className={inputCls(
                  errors.postcode?.message,
                  touchedFields.postcode && !errors.postcode && !!watched.postcode
                )}
                {...register("postcode", {
                  required: "Obligatorio",
                  pattern: { value: /^\d{5}$/, message: "5 dígitos" },
                })}
              />
            </InputWrapper>

            <InputWrapper
              label="Ciudad *"
              error={errors.city?.message}
              success={touchedFields.city && !errors.city && !!watched.city}
            >
              <input
                type="text"
                autoComplete="address-level2"
                placeholder="Madrid"
                className={inputCls(
                  errors.city?.message,
                  touchedFields.city && !errors.city && !!watched.city
                )}
                {...register("city", { required: "Obligatorio" })}
              />
            </InputWrapper>

            <InputWrapper
              label="Provincia *"
              error={errors.province?.message}
              success={
                touchedFields.province && !errors.province && !!watched.province
              }
            >
              <input
                type="text"
                autoComplete="address-level1"
                placeholder="Madrid"
                className={inputCls(
                  errors.province?.message,
                  touchedFields.province && !errors.province && !!watched.province
                )}
                {...register("province", { required: "Obligatorio" })}
              />
            </InputWrapper>
          </div>
        </div>
      </section>

      {/* Stripe PaymentElement */}
      <section className="mb-8">
        <h3 className="font-bold text-base mb-4 flex items-center gap-2">
          <FaLock className="text-[#487D26] text-sm" />
          Datos de pago
        </h3>

        <div className="border border-black/10 rounded-[16px] p-4">
          <PaymentElement
            options={{
              layout: "tabs",
              fields: { billingDetails: { address: "never" } },
            }}
          />
        </div>

        {stripeError && (
          <p className="text-xs text-red-500 mt-2">{stripeError}</p>
        )}

        {/* PCI badge */}
        <div className="flex items-center gap-2 mt-3 text-xs text-black/40">
          <FaLock className="text-xs" />
          <span>
            Pago seguro procesado por Stripe. Cumple con PCI DSS nivel 1.
          </span>
        </div>
      </section>

      {/* Submit */}
      <button
        type="submit"
        disabled={submitting || !stripe}
        className={cn(
          "w-full rounded-full h-[52px] text-base font-bold text-white transition-all flex items-center justify-center gap-2",
          submitting || !stripe
            ? "bg-[#487D26]/60 cursor-not-allowed"
            : "bg-[#487D26] hover:bg-[#3a6620]"
        )}
      >
        <FaLock className="text-sm" />
        {submitting ? "Procesando pago…" : `Pagar ${bundle.price}`}
      </button>

      <SecurityBadges className="mt-6" />
    </form>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function CardCheckoutPage() {
  const router = useRouter();
  const [bundle, setBundle] = useState<Bundle | null>(null);

  useEffect(() => {
    setBundle(getStoredBundle());
  }, []);

  if (!bundle) return null; // avoid SSR mismatch

  const stripeOptions = {
    mode: "payment" as const,
    amount: bundle.priceInCents,
    currency: "eur",
    appearance: {
      theme: "stripe" as const,
      variables: {
        colorPrimary: "#487D26",
        borderRadius: "9999px",
        fontFamily: "inherit",
      },
    },
  };

  return (
    <main className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-black/10 px-4 py-4">
        <div className="max-w-frame mx-auto flex items-center justify-between">
          <button
            onClick={() => router.back()}
            className="text-sm text-black/50 hover:text-black transition-colors"
          >
            ← Volver
          </button>
          <h1 className={cn(integralCF.className, "text-xl md:text-2xl")}>
            SHOP.CO
          </h1>
          <SecurityBadges className="hidden sm:flex" />
        </div>
      </header>

      <div className="max-w-frame mx-auto px-4 xl:px-0 py-8 md:py-12">
        <h2
          className={cn(
            integralCF.className,
            "text-[28px] md:text-[36px] mb-2"
          )}
        >
          Pago con Tarjeta
        </h2>
        <p className="text-black/60 text-sm mb-8 flex items-center gap-1.5">
          <FaLock className="text-[#487D26] text-xs" />
          Conexión segura · Cifrado SSL · Stripe
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-8 items-start">
          {/* Mobile: summary at top */}
          <div className="lg:hidden">
            <OrderSummary bundle={bundle} />
          </div>

          {/* Form wrapped in Stripe Elements */}
          {stripePromise ? (
            <Elements stripe={stripePromise} options={stripeOptions}>
              <CheckoutForm bundle={bundle} />
            </Elements>
          ) : (
            <div className="bg-yellow-50 border border-yellow-200 rounded-[16px] p-5 text-sm text-yellow-800">
              <strong>Configuración pendiente:</strong> añade{" "}
              <code>NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY</code> a tu{" "}
              <code>.env.local</code> para activar el pago con tarjeta.
            </div>
          )}

          {/* Desktop: sticky summary */}
          <div className="hidden lg:block sticky top-8">
            <OrderSummary bundle={bundle} />
          </div>
        </div>
      </div>
    </main>
  );
}
