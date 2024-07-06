// src/types/auth.ts
export interface User {
  id: number
  name: string
  user_email: string
  role_id: number
  tenant_id: number
  warehouse_id: number
}

export interface Role {
  id: number
  description: string
  tenant_id: number
}
