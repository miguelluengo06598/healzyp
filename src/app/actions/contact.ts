'use server'

// ─────────────────────────────────────────────────────────────────────────────
// Server Action: submit contact form message
//
// Required Supabase table (run once in your Supabase SQL editor):
//
//   create table public.contact_messages (
//     id         bigint generated always as identity primary key,
//     name       text    not null,
//     email      text    not null,
//     message    text    not null,
//     created_at timestamptz not null default now()
//   );
//
//   -- Enable RLS and allow inserts from the service role only:
//   alter table public.contact_messages enable row level security;
// ─────────────────────────────────────────────────────────────────────────────

import { createServiceClient } from '@/lib/supabase'

export interface ContactInput {
  name: string
  email: string
  message: string
}

export interface ContactResult {
  success: boolean
  error?: string
}

export async function submitContactAction(
  input: ContactInput
): Promise<ContactResult> {
  let db: ReturnType<typeof createServiceClient>
  try {
    db = createServiceClient()
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e)
    console.error('[submitContact] createServiceClient falló:', msg)
    return { success: false, error: `Servicio no disponible: ${msg}` }
  }

  const { error } = await db.from('contact_messages').insert({
    name:    input.name.trim(),
    email:   input.email.trim().toLowerCase(),
    message: input.message.trim(),
  })

  if (error) {
    console.error('[submitContact] Error al insertar:', error)
    return {
      success: false,
      error: `No se pudo guardar el mensaje. Inténtalo más tarde.`,
    }
  }

  return { success: true }
}
