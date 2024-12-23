// src/types/warehouse.ts
export interface Warehouse {
  id: number
  custom_attributes: string | null
  tenant_id: number
  name: string
  location: string | null
}

export interface WarehouseConfig {
  automatic_picking: {
    status: boolean
  }
  use_picking_baskets: {
    status: boolean
    volume: number
  }
  use_shifts: {
    status: boolean
    shifts?: {
      id: number
      name: string
      start_time: string
      end_time: string
    }[]
  }
  use_resources: {
    status: boolean
    resources?: Resources[]
  }
  use_weight: {
    status: boolean
    productCodeStart: number
    productCodeEnd: number
    weightStart: number
    weightEnd: number
    productDecimals?: number
    weightDecimals?: number
    priceDecimals?: number
    isWeightBased?: boolean
  }
}

export interface Resources {
  id: number
  name: string
}
