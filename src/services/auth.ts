import api from './api'
import { User } from '../types/auth'
import * as SecureStore from 'expo-secure-store'

// Interfaz para la solicitud de registro
export interface UserRequest {
  userEmail: string
  userName: string
  password: string
  roleId: number
  barcode: number
  tenant_id: number
}

interface AdminLoginResponse {
  data: {
    user: User
    token: string
    metadata: {
      code: number
      message: string
    }
  }
}

export const registerUser = async (userData: UserRequest): Promise<User> => {
  try {
    const response = await api.post('/auth/register', userData)
    return response.data
  } catch (error) {
    console.error('Error registering user:', error)
    throw error
  }
}

export const loginAdmin = async (userEmail: string, password: string): Promise<{ user: User; token: string }> => {
  try {
    const response = await api.post<AdminLoginResponse>('/auth/admin/login', { userEmail, password })
    if (!response.data?.data) {
      throw new Error('Respuesta inválida del servidor')
    }

    const { user, token } = response.data.data

    await SecureStore.setItemAsync('authToken', token)

    return { user, token }
  } catch (error) {
    console.error('Error logging in:', error)
    throw error
  }
}

export const loginPickingUser = async (barcode: number): Promise<{ user: User; token: string; metadata: { code: number; message: string } }> => {
  try {
    console.log('barcode', barcode)
    const response = await api.post('/auth/picker/login', { barcode })

    console.log('response', response)

    console.log('response.data.data', response.data.data)
    const { token } = response.data.data

    await SecureStore.setItemAsync('authToken', token)

    return response.data.data
  } catch (error) {
    console.error('Error logging in:', error)
    throw error
  }
}
