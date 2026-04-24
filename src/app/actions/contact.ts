'use server'

import { z } from 'zod'
import { createServiceClient } from '@/lib/supabase'

const ContactSchema = z.object({
  name:    z.string().min(2, 'Nombre muy corto').max(100, 'Nombre demasiado largo').trim(),
  email:   z.string().email('Email no válido').max(254).trim().toLowerCase(),
  message: z.string().min(10, 'Mensaje muy corto').max(2000, 'Mensaje demasiado largo').trim(),
})

export interface ContactResult {
  success: boolean
  error?: string
}

export async function submitContactAction(
  input: unknown
): Promise<ContactResult> {
  // Validar antes de tocar la base de datos
  const parsed = ContactSchema.safeParse(input)
  if (!parsed.success) {
    const first = parsed.error.issues[0]
    return { success: false, error: first?.message ?? 'Datos inválidos.' }
  }

  const { name, email, message } = parsed.data

  let db: ReturnType<typeof createServiceClient>
  try {
    db = createServiceClient()
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e)
    console.error('[submitContact] createServiceClient falló:', msg)
    return { success: false, error: 'Servicio no disponible.' }
  }

  const { error } = await db.from('contact_messages').insert({ name, email, message })

  if (error) {
    console.error('[submitContact] Error al insertar:', error.message)
    return { success: false, error: 'No se pudo guardar el mensaje. Inténtalo más tarde.' }
  }

  return { success: true }
}
