import { PackingOrder } from '../types/flow'

export const transformPackingOrdersToPayload = (packingOrders: { [orderId: number]: PackingOrder }) => {
  const orderResources = Object.entries(packingOrders).map(([orderId, orderData]) => {
    const resources = orderData.resources.map(res => ({
      resource_id: res.resource_id,
      quantity: 1,
      barcode: res.barcode.toString(), // Convertimos a string
      position: res.position || ''
    }))

    return {
      order_id: Number(orderId),
      resources
    }
  })

  return { orderResources }
}
