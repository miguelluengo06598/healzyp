// ─────────────────────────────────────────────────────────────────────────────
// Verificación server-side de hCaptcha
// ─────────────────────────────────────────────────────────────────────────────

interface HCaptchaVerifyResponse {
  success: boolean;
  challenge_ts?: string;
  hostname?: string;
  "error-codes"?: string[];
}

/**
 * Verifica un token de hCaptcha contra la API oficial.
 * En desarrollo, si no hay secret configurado, devuelve true con warning.
 */
export async function verifyHCaptcha(token: string): Promise<boolean> {
  const secret = process.env.HCAPTCHA_SECRET_KEY;

  // Fallback de desarrollo: permitir si no hay secret configurado
  if (!secret) {
    console.warn("[hcaptcha] HCAPTCHA_SECRET_KEY no configurado. Permitir en desarrollo.");
    return process.env.NODE_ENV === "development";
  }

  try {
    const res = await fetch("https://hcaptcha.com/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ response: token, secret }),
    });

    if (!res.ok) {
      console.error("[hcaptcha] Error HTTP al verificar:", res.status);
      return false;
    }

    const data = (await res.json()) as HCaptchaVerifyResponse;

    if (!data.success && data["error-codes"]) {
      console.error("[hcaptcha] Errores:", data["error-codes"]);
    }

    return data.success === true;
  } catch (err) {
    console.error("[hcaptcha] Excepción en verifyHCaptcha:", err instanceof Error ? err.message : err);
    return false;
  }
}
