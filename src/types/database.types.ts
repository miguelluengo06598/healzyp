// ─────────────────────────────────────────────────────────────────────────────
// Tipos TypeScript para la base de datos Supabase
// Generados manualmente — para regenerarlos automáticamente ejecuta:
//   npx supabase gen types typescript --project-id <TU_PROJECT_ID> > src/types/database.types.ts
// ─────────────────────────────────────────────────────────────────────────────

// ─── Enums ───────────────────────────────────────────────────────────────────

export type PaymentMethod = 'COD' | 'CARD'
export type PaymentStatus = 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED'
export type OrderStatus =
  | 'PENDING'
  | 'CONFIRMED'
  | 'PROCESSING'
  | 'SHIPPED'
  | 'DELIVERED'
  | 'CANCELLED'

// ─── Row types (lo que devuelve Supabase en un SELECT) ───────────────────────

export interface ProductRow {
  id: number
  title: string
  description: string | null
  price: number
  discount: number
  rating: number
  stock: number
  active: boolean
  image_url: string
  gallery_urls: string[] | null
  slug: string
  meta_title: string | null
  meta_description: string | null
  created_at: string
  updated_at: string
}

export interface BundleRow {
  id: number
  product_id: number | null
  name: string
  quantity: number
  price: number
  discount: number
  popular: boolean
  active: boolean
  created_at: string
  updated_at: string
}

export interface CustomerRow {
  id: number
  full_name: string
  phone: string
  email: string | null
  address: string
  postal_code: string
  city: string
  province: string
  country: string
  total_orders: number
  total_spent: number
  created_at: string
  updated_at: string
}

export interface OrderRow {
  id: string                          // UUID
  order_number: string
  customer_id: number | null
  shipping_name: string
  shipping_phone: string
  shipping_address: string
  shipping_postal: string
  shipping_city: string
  shipping_province: string
  shipping_country: string
  subtotal: number
  shipping_cost: number
  total: number
  payment_method: PaymentMethod
  payment_status: PaymentStatus
  paid_at: string | null
  stripe_payment_intent_id: string | null
  stripe_client_secret: string | null
  status: OrderStatus
  customer_notes: string | null
  admin_notes: string | null
  created_at: string
  updated_at: string
  completed_at: string | null
  cancelled_at: string | null
}

export interface OrderItemRow {
  id: number
  order_id: string                    // UUID
  product_id: number | null
  product_title: string
  bundle_id: number | null
  bundle_name: string
  quantity: number
  unit_price: number
  discount: number
  subtotal: number
  created_at: string
}

export interface ReviewRow {
  id: number
  product_id: number | null
  order_id: string | null             // UUID
  customer_name: string
  rating: number
  comment: string | null
  verified: boolean
  visible: boolean
  created_at: string
  updated_at: string
}

// ─── Insert types (lo que envías en un INSERT) ───────────────────────────────

export type CustomerInsert = Omit<CustomerRow, 'id' | 'total_orders' | 'total_spent' | 'created_at' | 'updated_at'>

export type OrderInsert = Omit<OrderRow, 'id' | 'created_at' | 'updated_at' | 'completed_at' | 'cancelled_at'>

export type OrderItemInsert = Omit<OrderItemRow, 'id' | 'created_at'>

export type ReviewInsert = Omit<ReviewRow, 'id' | 'created_at' | 'updated_at'>

// ─── Tipo genérico de la base de datos (compatible con createClient<Database>) ──

// Supabase v2 requiere el campo `Relationships` en cada tabla
type NoRelationships = { Relationships: [] }

export interface Database {
  public: {
    Tables: {
      products: {
        Row: ProductRow
        Insert: Omit<ProductRow, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<ProductRow, 'id' | 'created_at' | 'updated_at'>>
      } & NoRelationships
      bundles: {
        Row: BundleRow
        Insert: Omit<BundleRow, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<BundleRow, 'id' | 'created_at' | 'updated_at'>>
      } & NoRelationships
      customers: {
        Row: CustomerRow
        Insert: CustomerInsert
        Update: Partial<CustomerInsert>
      } & NoRelationships
      orders: {
        Row: OrderRow
        Insert: OrderInsert
        Update: Partial<OrderInsert>
      } & NoRelationships
      order_items: {
        Row: OrderItemRow
        Insert: OrderItemInsert
        Update: Partial<OrderItemInsert>
      } & NoRelationships
      reviews: {
        Row: ReviewRow
        Insert: ReviewInsert
        Update: Partial<ReviewInsert>
      } & NoRelationships
    }
    Views: Record<string, never>
    Functions: {
      generate_order_number: {
        Args: Record<string, never>
        Returns: string
      }
    }
    Enums: {
      payment_method_enum: PaymentMethod
      payment_status_enum: PaymentStatus
      order_status_enum: OrderStatus
    }
    CompositeTypes: Record<string, never>
  }
}
