import { Warehouse } from './warehouse'
import { Tenant } from './tenant'
// src/types/auth.ts
export interface User {
  id: number
  name: string
  user_email: string
  role_id: number
  tenant_id: number
  warehouse_id: number
  Warehouses: Warehouse
  Tenants: Tenant
}

export interface Role {
  id: number
  description: string
  tenant_id: number
}

export interface TokenPayload {
  userId: number
  tenant_id: number
  warehouse_id: number
  aud?: string
  exp?: number
}
