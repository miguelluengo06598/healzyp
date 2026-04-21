import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ''

// Cliente para componentes cliente y Server Components (respeta RLS con clave anon)
// Nota: las variables se validan en runtime, no en build time, para evitar errores en CI
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// ─────────────────────────────────────────────────────────────────────────────
// Cliente de servicio — solo para Server Actions y API Routes
// Bypasa RLS → NUNCA lo importes en componentes cliente
// ─────────────────────────────────────────────────────────────────────────────

export function createServiceClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!url || !key) {
    throw new Error(
      'Faltan variables de entorno de Supabase. ' +
      'Comprueba NEXT_PUBLIC_SUPABASE_URL y SUPABASE_SERVICE_ROLE_KEY en .env.local'
    )
  }

  return createClient(url, key, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })
}
