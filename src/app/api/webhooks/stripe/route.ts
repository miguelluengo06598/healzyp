import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { updateOrderPaymentStatus } from "@/lib/db/orders";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-04-22.dahlia",
});

// Next.js necesita el body crudo (sin parsear) para verificar la firma de Stripe.
export const config = { api: { bodyParser: false } };

export async function POST(req: NextRequest) {
  const sig = req.headers.get("stripe-signature");
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!sig || !webhookSecret) {
    console.error("[stripe-webhook] Falta stripe-signature o STRIPE_WEBHOOK_SECRET");
    return NextResponse.json({ error: "Configuración incorrecta." }, { status: 400 });
  }

  // Leer el body como ArrayBuffer → Buffer para stripe.webhooks.constructEvent
  const buf = Buffer.from(await req.arrayBuffer());

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(buf, sig, webhookSecret);
  } catch (err) {
    // Firma inválida — posible request falsa
    console.error("[stripe-webhook] Firma inválida:", err instanceof Error ? err.message : err);
    return NextResponse.json({ error: "Firma no válida." }, { status: 400 });
  }

  // ── Procesar el evento ──────────────────────────────────────────────────────
  try {
    switch (event.type) {
      case "payment_intent.succeeded": {
        const pi = event.data.object as Stripe.PaymentIntent;
        await updateOrderPaymentStatus(pi.id, "PAID");
        console.log("[stripe-webhook] Pago confirmado:", pi.id);
        break;
      }

      case "payment_intent.payment_failed": {
        const pi = event.data.object as Stripe.PaymentIntent;
        await updateOrderPaymentStatus(pi.id, "FAILED");
        console.log("[stripe-webhook] Pago fallido:", pi.id);
        break;
      }

      default:
        // Ignorar eventos no relevantes
        break;
    }
  } catch (err) {
    console.error("[stripe-webhook] Error procesando evento:", err instanceof Error ? err.message : err);
    // Devolver 500 hace que Stripe reintente el webhook automáticamente
    return NextResponse.json({ error: "Error interno." }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
