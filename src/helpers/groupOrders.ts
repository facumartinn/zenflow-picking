/* eslint-disable @typescript-eslint/no-explicit-any */
import { OrderDetails, OrderStateEnum, PickingDetailEnum, PickingStateEnum } from '../types/order'

export interface GroupedOrder {
  order_id: number
  order_tenant_id: number
  total_quantity: number
  picked_quantity: number
  details: OrderDetails[]
}

export const groupOrderDetailsByOrderId = (orderDetails: OrderDetails[]): GroupedOrder[] => {
  const groupedOrders = orderDetails.reduce((acc: { [key: number]: GroupedOrder }, detail) => {
    const { order_id, quantity, quantity_picked } = detail
    if (!acc[order_id]) {
      acc[order_id] = {
        order_id,
        order_tenant_id: detail?.Orders?.order_tenant_id,
        total_quantity: 0,
        picked_quantity: 0,
        details: []
      }
    }
    acc[order_id].total_quantity += quantity
    acc[order_id].picked_quantity += quantity_picked ?? 0
    acc[order_id].details.push(detail)
    return acc
  }, {})
  return Object.values(groupedOrders)
}

export const calculateOrdersPickingState = (groupedOrders: {
  [key: string]: OrderDetails[]
}): { id: number; data: { state_picking_id: PickingStateEnum } }[] => {
  return Object.entries(groupedOrders).map(([orderId, details]) => {
    // Verifica si algún producto está incompleto
    const hasIncompleteProducts = details.some(detail => detail.state_picking_details_id === PickingDetailEnum.INCOMPLETE)

    // Si hay productos incompletos, el estado es INCOMPLETE, sino es COMPLETE
    const pickingState = hasIncompleteProducts ? PickingStateEnum.INCOMPLETE : PickingStateEnum.COMPLETE

    return {
      id: parseInt(orderId),
      data: {
        state_picking_id: pickingState,
        state_id: OrderStateEnum.PACKING
      }
    }
  })
}
