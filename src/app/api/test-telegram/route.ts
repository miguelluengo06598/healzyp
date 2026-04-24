// ─────────────────────────────────────────────────────────────────────────────
// GET /api/test-telegram
// Solo disponible en desarrollo (NODE_ENV !== 'production').
// Envía los tres tipos de notificación con datos ficticios para verificar
// que el bot de Telegram está configurado correctamente.
// ─────────────────────────────────────────────────────────────────────────────

import { NextResponse } from "next/server";
import { testTelegramNotifications } from "@/lib/telegram";

export async function GET() {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json(
      { error: "Endpoint deshabilitado en producción." },
      { status: 403 }
    );
  }

  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) {
    return NextResponse.json(
      {
        error: "Variables de entorno no configuradas.",
        missing: [
          !token  && "TELEGRAM_BOT_TOKEN",
          !chatId && "TELEGRAM_CHAT_ID",
        ].filter(Boolean),
      },
      { status: 500 }
    );
  }

  await testTelegramNotifications();

  return NextResponse.json({
    ok: true,
    message: "Se enviaron 3 notificaciones de prueba a Telegram.",
    chatId,
  });
}
