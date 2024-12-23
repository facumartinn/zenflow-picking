// src/types/tenant.ts
export interface Tenant {
  id: number
  name: string
  logo: string
}

export interface SubstitutionPreference {
  id: number
  description: string
  tenant_id: number
}
