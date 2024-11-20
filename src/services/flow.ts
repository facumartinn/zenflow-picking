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
  console.log(orderBarcodes, 'sksdjsdsk')
  try {
    await api.post('/picking/flow/assign-baskets', orderBarcodes)
  } catch (error) {
    console.error('Error assigning baskets to orders:', error)
    throw error
  }
}
