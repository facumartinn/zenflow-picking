import { FlowData, FlowResponse } from '../types/flow'
import api from './api'

export const createFlow = async (flowData: FlowData): Promise<FlowResponse> => {
  try {
    const response = await api.post('/picking/flow/create', flowData)
    return response.data.data
  } catch (error) {
    console.error('Error creating flow:', error)
    throw error
  }
}

export const assignBasketsToOrders = async (orderBarcodes: { [orderId: number]: number[] }): Promise<void> => {
  try {
    await api.post('/picking/flow/assign-baskets', orderBarcodes)
  } catch (error) {
    console.error('Error assigning baskets to orders:', error)
    throw error
  }
}

interface OrderResourcesPayload {
  orderResources: {
    order_id: number
    resources: {
      resource_id: number
      quantity: number
      barcode: string
      position: string
    }[]
  }[]
}

export const registerOrderResources = async (payload: OrderResourcesPayload): Promise<void> => {
  try {
    await api.post('/orders/resources', payload)
  } catch (error) {
    console.error('Error registering order resources:', error)
    throw error
  }
}

export const updateFlowStatus = async (flowId: number, flowStatusId: number, orderStateId?: number): Promise<void> => {
  try {
    await api.post('/picking/flow/update-status', {
      flowId,
      flowStatusId,
      orderStateId
    })
  } catch (error) {
    console.error('Error updating flow status:', error)
    throw error
  }
}

export const cancelFlow = async (flowId: number): Promise<void> => {
  try {
    await api.post('/picking/flow/cancel', { flowId })
  } catch (error) {
    console.error('Error canceling flow:', error)
    throw error
  }
}
