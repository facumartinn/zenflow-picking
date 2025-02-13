// src/types/tenant.ts
export interface Tenant {
  id: number
  name: string
  logo: string | null
}

export interface TenantConfig {
  [key: string]: unknown
}

export interface TenantData {
  logo: string | null
  name: string
}

export interface SubstitutionPreference {
  id: number
  description: string
  tenant_id: number
}
