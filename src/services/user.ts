import api from './api'
import { User } from '../types/auth'

// Obtener todos los usuarios
export const getAllUsers = async (): Promise<User[]> => {
  try {
    const response = await api.get('/users')
    return response.data
  } catch (error) {
    console.error('Error fetching users:', error)
    throw error
  }
}

// Obtener todos los usuarios por rol
export const getAllUsersByRole = async (roleId: number): Promise<User[]> => {
  try {
    const response = await api.get(`/users/by-role/${roleId}`)
    return response.data
  } catch (error) {
    console.error('Error fetching users by role:', error)
    throw error
  }
}

// Obtener un usuario específico por ID
export const getUser = async (id: number): Promise<User> => {
  try {
    const response = await api.get(`/users/${id}`)
    return response.data
  } catch (error) {
    console.error(`Error fetching user with ID ${id}:`, error)
    throw error
  }
}

// Crear un nuevo usuario
export const createUser = async (userData: Omit<User, 'id'>): Promise<User> => {
  try {
    const response = await api.post('/users', userData)
    return response.data
  } catch (error) {
    console.error('Error creating user:', error)
    throw error
  }
}

// Actualizar un usuario existente
export const updateUser = async (id: number, userData: Partial<User>): Promise<User> => {
  try {
    const response = await api.put(`/users/${id}`, userData)
    return response.data
  } catch (error) {
    console.error(`Error updating user with ID ${id}:`, error)
    throw error
  }
}

// Eliminar un usuario
export const deleteUser = async (id: number): Promise<void> => {
  try {
    await api.delete(`/users/${id}`)
  } catch (error) {
    console.error(`Error deleting user with ID ${id}:`, error)
    throw error
  }
}
