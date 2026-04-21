'use server'

import { createOrder } from '@/lib/db/orders'
import type { CreateOrderInput, CreateOrderResult } from '@/lib/db/orders'

export async function createOrderAction(
  input: CreateOrderInput
): Promise<CreateOrderResult> {
  return createOrder(input)
}
