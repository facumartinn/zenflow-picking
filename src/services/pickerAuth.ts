import api from './api'
import { AuthResponse } from '../types/auth'
import axios from 'axios'
import { savePickerAuth, getPickerAuth, clearPickerData, getAdminAuth } from './secureStorage'

export const loginPickingUser = async (barcode: number): Promise<AuthResponse> => {
  try {
    const response = await api.post<AuthResponse>('/auth/picker/login', { barcode })

    const { token } = response.data.data

    // Guardar datos del picker en secure storage
    await savePickerAuth({
      token,
      pickerId: response.data.data.user.id.toString(),
      lastCode: barcode.toString()
    })

    return response.data
  } catch (error) {
    console.error('Error en loginPickingUser:', error)
    if (axios.isAxiosError(error)) {
      console.error('Detalles del error:', {
        status: error.response?.status,
        data: error.response?.data,
        headers: error.config?.headers
      })
    }
    throw error
  }
}

export const logoutPicker = async (): Promise<void> => {
  try {
    await clearPickerData()
  } catch (error) {
    console.error('Error en logoutPicker:', error)
    throw error
  }
}

export const verifyPickerAuth = async (): Promise<boolean> => {
  try {
    const pickerAuth = await getPickerAuth()
    return !!pickerAuth?.token
  } catch (error) {
    console.error('Error verificando autenticación del picker:', error)
    return false
  }
}

export const verifyAdminAuth = async (): Promise<boolean> => {
  try {
    const adminAuth = await getAdminAuth()
    return !!adminAuth && adminAuth.expiresAt > Date.now()
  } catch (error) {
    console.error('Error verificando autenticación del admin:', error)
    return false
  }
}
