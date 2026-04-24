'use server'

import { z } from 'zod'
import { createOrder } from '@/lib/db/orders'
import type { CreateOrderResult } from '@/lib/db/orders'

const SPANISH_PHONE = /^(\+34|0034|34)?[6789]\d{8}$/
const POSTCODE_ES   = /^\d{5}$/

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const CreateOrderSchema = z.object({
  customerData: z.object({
    fullName:   z.string().min(2).max(150).trim(),
    phone:      z.string().transform(v => v.replace(/[\s\-]/g, '')).refine(v => SPANISH_PHONE.test(v), 'Teléfono español no válido'),
    email:      z.string().regex(EMAIL_RE, 'Email no válido').optional(),
    address:    z.string().min(5).max(200).trim(),
    postalCode: z.string().regex(POSTCODE_ES, 'Código postal no válido'),
    city:       z.string().min(2).max(100).trim(),
    province:   z.string().min(2).max(100).trim(),
  }),
  bundleId:               z.number().int().min(1).max(3),
  paymentMethod:          z.enum(['CARD', 'COD']),
  stripePaymentIntentId:  z.string().startsWith('pi_').optional(),
  stripeClientSecret:     z.string().optional(),
  customerNotes:          z.string().max(500).optional(),
})

export async function createOrderAction(
  input: unknown
): Promise<CreateOrderResult> {
  const parsed = CreateOrderSchema.safeParse(input)
  if (!parsed.success) {
    const first = parsed.error.issues[0]
    return { success: false, error: first?.message ?? 'Datos de pedido inválidos.' }
  }

  return createOrder(parsed.data)
}
