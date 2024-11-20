// src/types/order.ts
export interface Order {
  id: number
  state_id: number | null
  state_picking_id: number | null
  amount: number
  user_id: number | null
  assembly_date: Date | null
  tenant_id: number
  warehouse_id: number
  updated_at: string | null
  created_at: string | null
  OrderDetails?: OrderDetails[]
  OrderPositions: OrderPosition[]
}

export interface OrderDetails {
  id: number
  order_id: number
  product_id: number
  product_name: string
  product_photo: string | null
  product_barcode: string | null
  quantity: number
  quantity_picked: number | null
  weight: number | null
  weighable: number
  final_weight: number | null
  sales_unit: number | null
  warehouse_order: number | null
  tenant_id: number
  warehouse_id: number
  state_picking_details_id: null | number // Nuevo campo para el estado del producto
  picking_type: 'manual' | 'scan' | null // Nuevo campo para trackear el tipo de picking
  Orders: Order
}

export interface OrderPosition {
  id: number
  order_id: number
  position: string
  type: string
  barcode: string
  tenant_id: number
  warehouse_id: number
}

export interface OrderState {
  id: number
  order_id: number
  state_id: number
  creationDate: Date
  tenant_id: number
}

export interface FilterParamTypes {
  stateId?: number[]
  orderId?: number
  userId?: number
  shiftId?: number
  assemblyDate?: string
  startDate?: Date
  endDate?: Date
  includeDetails?: boolean
}

export enum OrderStateEnum {
  NEW = 1,
  READY_TO_PICK = 2,
  PROGRAMMED = 3,
  IN_PREPARATION = 4,
  COMPLETED = 5,
  DELETED = 6
}

export enum PickingStateEnum {
  COMPLETE = 1,
  INCOMPLETE = 2
}

export const ORDER_STATES = [
  { id: 1, description: 'Nuevo pedido' },
  { id: 2, description: 'Listo para preparar' },
  { id: 3, description: 'Programado' },
  { id: 4, description: 'En preparación' },
  { id: 5, description: 'Finalizado' },
  { id: 6, description: 'Eliminado' }
]

export enum PickingDetailEnum {
  PENDING = 1,
  IN_PROGRESS = 2,
  COMPLETED = 3,
  INCOMPLETE = 4
}

export interface PickingUpdate {
  order_id: number
  product_id: number
  quantity: number
  quantity_picked: number
  final_weight: number | null
  state_picking_details_id: number
}
