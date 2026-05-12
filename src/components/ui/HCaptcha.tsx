"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import HCaptcha from "@hcaptcha/react-hcaptcha";

interface HCaptchaWidgetProps {
  /** Se llama con el token cuando el usuario completa el desafío */
  onVerify: (token: string | null) => void;
  /** Se llama si el widget falla al cargar */
  onLoadError?: () => void;
}

/**
 * Widget hCaptcha con manejo de errores de carga.
 *
 * Fallback operacional: si la variable NEXT_PUBLIC_HCAPTCHA_DISABLED está a 'true',
 * el componente no renderiza nada y el formulario puede enviarse sin token.
 * Esto permite desactivar hCaptcha en emergencias sin redeploy de código.
 */
export default function HCaptchaWidget({ onVerify, onLoadError }: HCaptchaWidgetProps) {
  const [loaded, setLoaded] = useState(false);
  const [loadError, setLoadError] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleVerify = useCallback(
    (token: string | null) => {
      onVerify(token);
    },
    [onVerify]
  );

  const handleError = useCallback(() => {
    setLoadError(true);
    onLoadError?.();
  }, [onLoadError]);

  const handleLoad = useCallback(() => {
    setLoaded(true);
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  useEffect(() => {
    // Timeout de seguridad: si el script no carga en 4s, considerar error
    timeoutRef.current = setTimeout(() => {
      if (!loaded) {
        handleError();
      }
    }, 4000);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [loaded, handleError]);

  // Bypass operacional de emergencia
  if (process.env.NEXT_PUBLIC_HCAPTCHA_DISABLED === "true") {
    return (
      <p className="text-xs text-yellow-600">
        ⚠️ Verificación de seguridad desactivada.
      </p>
    );
  }

  const sitekey = process.env.NEXT_PUBLIC_HCAPTCHA_SITE_KEY;
  if (!sitekey) {
    return (
      <p className="text-xs text-yellow-600">
        ⚠️ hCaptcha no configurado (NEXT_PUBLIC_HCAPTCHA_SITE_KEY).
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <HCaptcha
        sitekey={sitekey}
        onVerify={handleVerify}
        onError={handleError}
        onLoad={handleLoad}
      />
      {loadError && (
        <p className="text-xs text-red-500">
          Error al cargar la verificación de seguridad. Recarga la página o
          contacta con soporte si el problema persiste.
        </p>
      )}
    </div>
  );
}
