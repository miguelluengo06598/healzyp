// Rate limiter en memoria — funciona para instancias únicas (desarrollo / single-server).
// En Vercel/Edge con múltiples instancias, sustituir por Upstash Redis:
// https://github.com/upstash/ratelimit

type Entry = { count: number; resetAt: number };

const store = new Map<string, Entry>();

/**
 * Comprueba si una clave (IP, userId, …) supera el límite de peticiones.
 *
 * @param key      Identificador único (IP, email, …)
 * @param limit    Número máximo de peticiones permitidas en la ventana
 * @param windowMs Tamaño de la ventana en milisegundos (default: 1 hora)
 * @returns        { allowed: boolean; remaining: number; resetAt: number }
 */
export function rateLimit(
  key: string,
  limit: number,
  windowMs = 60 * 60 * 1000 // 1 hora
): { allowed: boolean; remaining: number; resetAt: number } {
  const now = Date.now();
  const entry = store.get(key);

  if (!entry || now >= entry.resetAt) {
    // Primera petición o ventana expirada → reinicia
    store.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, remaining: limit - 1, resetAt: now + windowMs };
  }

  if (entry.count >= limit) {
    return { allowed: false, remaining: 0, resetAt: entry.resetAt };
  }

  entry.count += 1;
  return { allowed: true, remaining: limit - entry.count, resetAt: entry.resetAt };
}

/**
 * Extrae la IP del cliente desde los headers de Next.js.
 * Usa x-forwarded-for (Vercel/proxies) y cae a "unknown" si no está disponible.
 */
export function getClientIp(request: Request): string {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0].trim() ??
    request.headers.get("x-real-ip") ??
    "unknown"
  );
}
