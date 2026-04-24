// ─────────────────────────────────────────────────────────────────────────────
// Telegram notifications — pedidos y pagos
// Silencioso en producción: nunca lanza excepciones ni bloquea el flujo.
// ─────────────────────────────────────────────────────────────────────────────

const TELEGRAM_API_BASE = "https://api.telegram.org";

// ─── Tipos ───────────────────────────────────────────────────────────────────

export type NotificationType =
  | "NEW_ORDER_COD"
  | "PAYMENT_CONFIRMED"
  | "PAYMENT_FAILED";

export type OrderNotificationData = {
  orderNumber?: string;
  customerName?: string;
  customerPhone?: string;
  customerEmail?: string;
  address?: string;
  city?: string;
  province?: string;
  /** Nombre del bundle, ej: "2 Botes" */
  bundleName?: string;
  /** Precio total en euros (número), ej: 44.99 */
  totalEuros?: number;
  /** Stripe PaymentIntent ID para referencia */
  paymentIntentId?: string;
  /** Motivo del fallo (solo en PAYMENT_FAILED) */
  failureReason?: string;
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

/** Formatea un número de euros al estilo europeo: 44.99 → "44,99 €" */
function formatEuros(amount: number): string {
  return (
    amount
      .toFixed(2)
      .replace(".", ",") + " €"
  );
}

/** Fecha/hora en zona Madrid (CET/CEST) */
function nowMadrid(): string {
  return new Intl.DateTimeFormat("es-ES", {
    timeZone: "Europe/Madrid",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date());
}

/** Escapa caracteres HTML para el modo parse_mode HTML de Telegram */
function escHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

// ─── Formatear mensajes ───────────────────────────────────────────────────────

export function formatOrderMessage(
  type: NotificationType,
  data: OrderNotificationData
): string {
  const hora = nowMadrid();

  switch (type) {
    case "NEW_ORDER_COD": {
      const lineas = [
        "📦 <b>NUEVO PEDIDO — CONTRA REEMBOLSO</b>",
        "━━━━━━━━━━━━━━━━━━━━━━",
        `🔖 <b>Orden:</b> #${escHtml(data.orderNumber ?? "—")}`,
        `👤 <b>Cliente:</b> ${escHtml(data.customerName ?? "—")}`,
        `📞 <b>Teléfono:</b> ${escHtml(data.customerPhone ?? "—")}`,
      ];
      if (data.customerEmail) {
        lineas.push(`📧 <b>Email:</b> ${escHtml(data.customerEmail)}`);
      }
      lineas.push("");
      lineas.push("🛒 <b>PEDIDO:</b>");
      lineas.push(`  • ${escHtml(data.bundleName ?? "—")} — ${data.totalEuros != null ? formatEuros(data.totalEuros) : "—"}`);
      lineas.push("");
      lineas.push(`💰 <b>Total:</b> ${data.totalEuros != null ? formatEuros(data.totalEuros) : "—"}`);
      lineas.push(`🏠 <b>Dirección:</b> ${escHtml([data.address, data.city, data.province].filter(Boolean).join(", ") || "—")}`);
      lineas.push(`🕐 <b>Hora:</b> ${hora}`);
      return lineas.join("\n");
    }

    case "PAYMENT_CONFIRMED": {
      const lineas = [
        "✅ <b>PAGO CONFIRMADO — TARJETA</b>",
        "━━━━━━━━━━━━━━━━━━━━━━",
        `🔖 <b>Orden:</b> #${escHtml(data.orderNumber ?? "—")}`,
        `👤 <b>Cliente:</b> ${escHtml(data.customerName ?? "—")}`,
        `📞 <b>Teléfono:</b> ${escHtml(data.customerPhone ?? "—")}`,
      ];
      if (data.customerEmail) {
        lineas.push(`📧 <b>Email:</b> ${escHtml(data.customerEmail)}`);
      }
      lineas.push("");
      lineas.push("🛒 <b>PEDIDO:</b>");
      lineas.push(`  • ${escHtml(data.bundleName ?? "—")} — ${data.totalEuros != null ? formatEuros(data.totalEuros) : "—"}`);
      lineas.push("");
      lineas.push(`💰 <b>Total cobrado:</b> ${data.totalEuros != null ? formatEuros(data.totalEuros) : "—"}`);
      lineas.push(`🏠 <b>Dirección:</b> ${escHtml([data.address, data.city, data.province].filter(Boolean).join(", ") || "—")}`);
      if (data.paymentIntentId) {
        lineas.push(`🔗 <b>Stripe PI:</b> <code>${escHtml(data.paymentIntentId)}</code>`);
      }
      lineas.push(`🕐 <b>Hora:</b> ${hora}`);
      return lineas.join("\n");
    }

    case "PAYMENT_FAILED": {
      const lineas = [
        "❌ <b>PAGO FALLIDO — TARJETA</b>",
        "━━━━━━━━━━━━━━━━━━━━━━",
      ];
      if (data.orderNumber) {
        lineas.push(`🔖 <b>Orden:</b> #${escHtml(data.orderNumber)}`);
      }
      if (data.customerName) {
        lineas.push(`👤 <b>Cliente:</b> ${escHtml(data.customerName)}`);
      }
      if (data.bundleName) {
        lineas.push(`🛒 <b>Paquete:</b> ${escHtml(data.bundleName)}`);
      }
      if (data.totalEuros != null) {
        lineas.push(`💰 <b>Importe:</b> ${formatEuros(data.totalEuros)}`);
      }
      if (data.failureReason) {
        lineas.push(`⚠️ <b>Motivo:</b> ${escHtml(data.failureReason)}`);
      }
      if (data.paymentIntentId) {
        lineas.push(`🔗 <b>Stripe PI:</b> <code>${escHtml(data.paymentIntentId)}</code>`);
      }
      lineas.push(`🕐 <b>Hora:</b> ${hora}`);
      return lineas.join("\n");
    }
  }
}

// ─── Enviar notificación ──────────────────────────────────────────────────────

/**
 * Envía una notificación a Telegram.
 * Nunca lanza excepciones — los errores se registran con console.error
 * pero no interrumpen el flujo del pedido.
 */
export async function sendTelegramNotification(
  type: NotificationType,
  data: OrderNotificationData
): Promise<void> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) {
    console.warn("[telegram] TELEGRAM_BOT_TOKEN o TELEGRAM_CHAT_ID no configurados. Notificación omitida.");
    return;
  }

  const text = formatOrderMessage(type, data);

  try {
    const res = await fetch(`${TELEGRAM_API_BASE}/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        parse_mode: "HTML",
        // Deshabilita la vista previa de links para mensajes más limpios
        disable_web_page_preview: true,
      }),
    });

    if (!res.ok) {
      const err = await res.text().catch(() => "respuesta ilegible");
      console.error(`[telegram] Error HTTP ${res.status}: ${err}`);
    }
  } catch (err) {
    // Error de red — no interrumpe el flujo
    console.error("[telegram] Error de red al enviar notificación:", err instanceof Error ? err.message : err);
  }
}

// ─── Test ─────────────────────────────────────────────────────────────────────

/**
 * Envía los tres tipos de notificación con datos ficticios.
 * Llamar desde una API route de desarrollo: GET /api/test-telegram
 */
export async function testTelegramNotifications(): Promise<void> {
  const sample: OrderNotificationData = {
    orderNumber: "HZP-00042",
    customerName: "María García López",
    customerPhone: "+34 612 345 678",
    customerEmail: "maria@ejemplo.com",
    address: "Calle Mayor 12, 3º B",
    city: "Madrid",
    province: "Madrid",
    bundleName: "2 Botes",
    totalEuros: 44.99,
    paymentIntentId: "pi_test_1234567890",
  };

  await sendTelegramNotification("NEW_ORDER_COD", sample);
  await sendTelegramNotification("PAYMENT_CONFIRMED", sample);
  await sendTelegramNotification("PAYMENT_FAILED", {
    ...sample,
    failureReason: "Fondos insuficientes",
  });
}
