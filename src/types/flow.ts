import { OrderDetails } from './order'

// Tipado para los datos del flujo
export interface FlowData {
  flowTypeId: number
  userId: number
  orderIds: number[]
}

// Tipado para la respuesta del flujo
export interface FlowResponse {
  flow: Flow
  orderDetails: OrderDetails[]
}

export interface Flow {
  id: number
  flow_type: number
  user_id: number
  tenant_id: number
  warehouse_id: number
  start_date: string
  end_date: string | null
}

export enum FlowTypeEnum {
  SINGLE_PICKING = 1,
  MULTI_PICKING = 2
}

export enum FlowStateEnum {
  IN_PROGRESS = 1,
  COMPLETED = 2,
  CANCELLED = 3
}

export interface PackingOrder {
  print_status: PrintStatusEnum
  resources: {
    resource_id: number
    resource_name: string
    barcodes: number[]
  }[]
}

export enum PrintStatusEnum {
  NOT_PRINTED = 1,
  PRINTED = 2
}
