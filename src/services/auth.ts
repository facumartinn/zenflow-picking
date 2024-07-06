import api from './api'
import { User } from '../types/auth'

// Interfaz para la solicitud de registro
export interface UserRequest {
  userEmail: string
  userName: string
  password: string
  roleId: number
  barcode: number
  tenant_id: number
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

export const loginAdmin = async (userEmail: string, password: string): Promise<{ user: User; token: string; metadata: { code: number; message: string } }> => {
  try {
    const response = await api.post('/auth/admin/login', { userEmail, password })
    return response.data.data
  } catch (error) {
    console.error('Error logging in:', error)
    throw error
  }
}

export const loginPickingUser = async (barcode: number): Promise<{ data: { user: User; token: string; metadata: { code: number; message: string } } }> => {
  try {
    const response = await api.post('/auth/picker/login', { barcode })
    return response.data
  } catch (error) {
    console.error('Error logging in:', error)
    throw error
  }
}
