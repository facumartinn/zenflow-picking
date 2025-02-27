/* eslint-disable @typescript-eslint/no-explicit-any */
import api from './api'
import { FilterParamTypes, Order, OrderDetails, OrderResourcesPayload, OrderResourceResponse, FilteredOrdersResponse } from '../types/order'
import { QueryParams, objectToQueryString } from '../utils/queryParams'

// Obtener todos los pedidos
export const getAllOrders = async (): Promise<Order[]> => {
  try {
    const response = await api.get('/orders')
    return response.data
  } catch (error) {
    console.error('Error fetching orders:', error)
    throw error
  }
}

// Obtener pedidos con filtros
export const getFilteredOrders = async (filters: FilterParamTypes): Promise<FilteredOrdersResponse> => {
  try {
    const response = await api.get(`/orders/filtered?${objectToQueryString(filters as QueryParams)}`)
    return response.data.data
  } catch (error) {
    console.error('Error fetching filtered orders:', error)
    throw error
  }
}

// Obtener estadísticas de pedidos de hoy
export const getOrderStats = async (): Promise<any> => {
  try {
    const response = await api.get('/orders/order-stats')
    return response.data
  } catch (error) {
    console.error('Error fetching order stats:', error)
    throw error
  }
}

// Obtener un pedido específico por ID
export const getOrder = async (id: number): Promise<Order> => {
  try {
    const response = await api.get(`/orders/${id}`)
    return response.data
  } catch (error) {
    console.error(`Error fetching order with ID ${id}:`, error)
    throw error
  }
}

// Crear un nuevo pedido
export const createOrder = async (orderData: OrderDetails[]): Promise<Order> => {
  try {
    const response = await api.post('/orders/create', orderData)
    return response.data
  } catch (error) {
    console.error('Error creating order:', error)
    throw error
  }
}

// Eliminar un pedido
export const deleteOrder = async (id: number): Promise<void> => {
  try {
    await api.delete(`/orders/${id}`)
  } catch (error) {
    console.error(`Error deleting order with ID ${id}:`, error)
    throw error
  }
}

// Asignar uno o más pedidos
export const assignOrders = async (ordersData: any, newStateId: number): Promise<void> => {
  try {
    await api.put('/orders/assign', { orders: ordersData, newStateId })
  } catch (error) {
    console.error('Error assigning orders:', error)
    throw error
  }
}

// Actualizar el estado de un pedido
export const updateOrderStatus = async (stateId: number, statusData: any): Promise<void> => {
  try {
    await api.post(`/orders/update-status/${stateId}`, statusData)
  } catch (error) {
    console.error(`Error updating order status with state ID ${stateId}:`, error)
    throw error
  }
}

// Actualizar los detalles de un pedido
export const updateOrders = async (data: { orders: Array<{ id: number; data: Partial<Order> }> }): Promise<void> => {
  try {
    await api.put('/orders/batch-update', data)
  } catch (error) {
    console.error('Error updating order details:', error)
    throw error
  }
}

// Registrar recursos utilizados en los pedidos
export const registerOrderResources = async (payload: OrderResourcesPayload): Promise<void> => {
  try {
    await api.post('/orders/resources', payload)
  } catch (error) {
    console.error('Error registering order resources:', error)
    throw error
  }
}

export const getResources = async (orderId: number): Promise<OrderResourceResponse> => {
  try {
    const response = await api.get(`/orders/resources/${orderId}`)
    return response.data.data
  } catch (error) {
    console.error('Error fetching resources:', error)
    throw error
  }
}
