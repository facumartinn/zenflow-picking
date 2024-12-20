/* eslint-disable @typescript-eslint/no-explicit-any */
import { OrderDetails } from '../types/order'

export interface GroupedOrder {
  order_id: number
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
