import api from './api'
import { OrderDetails, PickingUpdate } from '../types/order'

// Obtener todos los detalles de pedidos
export const getAllOrderDetails = async (): Promise<OrderDetails[]> => {
  try {
    const response = await api.get('/order-details')
    return response.data
  } catch (error) {
    console.error('Error fetching order details:', error)
    throw error
  }
}

// Obtener detalles de pedidos por IDs de pedidos
export const getOrderDetailsByIds = async (ids: number[]): Promise<OrderDetails[]> => {
  try {
    const response = await api.post('/order-details/by-ids', { ids })
    return response.data
  } catch (error) {
    console.error('Error fetching order details by IDs:', error)
    throw error
  }
}

// Obtener un detalle de pedido específico por ID de pedido
export const getOrderDetail = async (id: number): Promise<OrderDetails[]> => {
  try {
    const response = await api.get(`/order-details/${id}`)
    return response.data.data.details
  } catch (error) {
    console.error(`Error fetching order detail with ID ${id}:`, error)
    throw error
  }
}

// Crear un nuevo detalle de pedido
export const createOrderDetail = async (orderDetails: OrderDetails[]): Promise<OrderDetails[]> => {
  try {
    const response = await api.post('/order-details', orderDetails)
    return response.data
  } catch (error) {
    console.error('Error creating order detail:', error)
    throw error
  }
}

// Actualizar uno o más pedidos
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const updateOrderDetails = async (updates: any[]): Promise<void> => {
  try {
    await api.put('/order-details/update-multiple', updates)
  } catch (error) {
    console.error('Error updating order details:', error)
    throw error
  }
}

// Eliminar un detalle de pedido
export const deleteOrderDetail = async (id: number): Promise<void> => {
  try {
    await api.delete(`/order-details/${id}`)
  } catch (error) {
    console.error(`Error deleting order detail with ID ${id}:`, error)
    throw error
  }
}

export const updateIncompleteProducts = async (products: OrderDetails[], orderId: number, statePickingId: number) => {
  try {
    // Transformar los productos al formato esperado por el endpoint
    const transformedProducts: PickingUpdate[] = products.map(detail => ({
      order_id: detail.order_id,
      product_id: detail.product_id,
      quantity: detail.quantity,
      quantity_picked: detail.quantity_picked!,
      final_weight: detail.final_weight,
      state_picking_details_id: detail.state_picking_details_id!
    }))

    // Actualizar los detalles de los productos
    await updateOrderDetails(transformedProducts)

    // Actualizar el estado del pedido
    const orderUpdate = {
      orders: [
        {
          id: orderId,
          data: {
            state_picking_id: statePickingId // Estado de picking completado
          }
        }
      ]
    }

    await api.put('/orders/batch-update', orderUpdate)
    return { success: true }
  } catch (error) {
    console.error('Error al actualizar productos:', error)
    throw error
  }
}
