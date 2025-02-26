import React, { createContext, useContext, useState, useEffect } from 'react'
import { User } from '../types/auth'
import {
  saveAdminAuth,
  saveTenantData,
  savePickerAuth,
  getAdminAuth,
  getPickerAuth,
  clearAllSecureData,
  clearPickerData,
  saveWarehouseConfig
} from '../services/secureStorage'
import { loginAdmin as loginAdminService, loginPickingUser } from '../services/auth'
import { router } from 'expo-router'
import { useAtom } from 'jotai'
import { warehousesAtom } from '../store'

interface AuthContextType {
  // Estados
  isLoading: boolean
  isAdminAuthenticated: boolean
  isPickerAuthenticated: boolean
  tenantLogo: string | null
  error: string | null
  pickerUser: User | null

  // Acciones
  loginAdmin: (email: string, password: string) => Promise<void>
  loginPicker: (code: string) => Promise<void>
  logoutAdmin: () => Promise<void>
  logoutPicker: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | null>(null)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider')
  }
  return context
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true)
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false)
  const [isPickerAuthenticated, setIsPickerAuthenticated] = useState(false)
  const [tenantLogo, setTenantLogo] = useState<string | null>(null)
  const [, setWarehouseConfig] = useAtom(warehousesAtom)
  const [error, setError] = useState<string | null>(null)
  const [pickerUser, setPickerUser] = useState<User | null>(null)

  // Verificar autenticación al iniciar
  useEffect(() => {
    const checkAuth = async () => {
      try {
        setIsLoading(true)
        const adminAuth = await getAdminAuth()
        const pickerAuth = await getPickerAuth()

        // Verificar admin auth
        if (adminAuth?.accessToken) {
          setIsAdminAuthenticated(true)
          setTenantLogo(adminAuth.tenantLogo || null)
        }

        // Verificar picker auth
        if (pickerAuth?.token) {
          setIsPickerAuthenticated(true)
          router.push('/home')
        }
      } catch (error) {
        console.error('Error verificando autenticación:', error)
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [])

  const loginAdmin = async (email: string, password: string) => {
    try {
      setError(null)

      const { user, token } = await loginAdminService(email, password)

      if (!user || !token) {
        throw new Error('Datos de autenticación inválidos')
      }

      // Guardar datos de autenticación
      await saveAdminAuth({
        accessToken: token,
        tenantId: user.tenant_id.toString(),
        warehouseId: user.warehouse_id.toString(),
        tenantLogo: user.Tenants?.logo || null,
        expiresAt: Date.now() + 24 * 60 * 60 * 1000 // 24 horas
      })

      // Guardar datos del tenant si existen
      if (user.Tenants) {
        await saveTenantData({
          logo: user.Tenants.logo,
          name: user.Tenants.name
        })
        setTenantLogo(user.Tenants.logo)
      }

      setIsAdminAuthenticated(true)

      // Pequeño delay para asegurar que el estado se actualice
      setTimeout(() => {
        router.push('/picker-login')
      }, 100)
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error al iniciar sesión como administrador'
      setError(errorMessage)
      throw error
    }
  }

  const loginPicker = async (code: string) => {
    try {
      setError(null)

      const response = await loginPickingUser(Number(code))
      const user = response.user
      const parsedConfig = JSON.parse(user.Warehouses?.custom_attributes || '{}')

      // Guardar datos del picker
      await savePickerAuth({
        token: response.token,
        pickerId: user.id.toString(),
        lastCode: user.barcode.toString()
      })

      // Guardar configuración del warehouse
      await saveWarehouseConfig({
        custom_attributes: parsedConfig
      })

      setPickerUser(user)
      setIsPickerAuthenticated(true)
      setWarehouseConfig(parsedConfig)

      // Pequeño delay para asegurar que el estado se actualice
      setTimeout(() => {
        router.push('/home')
      }, 100)
    } catch (error) {
      setError('Error al iniciar sesión como picker')
      throw error
    }
  }

  const logoutPicker = async () => {
    try {
      setIsLoading(true)
      await clearPickerData()
      setIsPickerAuthenticated(false)
      setPickerUser(null)
      setError(null)
      setIsLoading(false)

      // Pequeño delay para asegurar que el estado se actualice antes de navegar
      setTimeout(() => {
        router.push('/picker-login')
      }, 100)
    } catch (error) {
      setError('Error al cerrar sesión de picker')
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const logoutAdmin = async () => {
    try {
      setIsLoading(true)
      await clearAllSecureData()
      setIsAdminAuthenticated(false)
      setIsPickerAuthenticated(false)
      setTenantLogo(null)
      setPickerUser(null)
      setError(null)
      setIsLoading(false)

      // Pequeño delay para asegurar que el estado se actualice antes de navegar
      setTimeout(() => {
        router.push('/admin-login')
      }, 100)
    } catch (error) {
      setError('Error al cerrar sesión de administrador')
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AuthContext.Provider
      value={{
        isLoading,
        isAdminAuthenticated,
        isPickerAuthenticated,
        tenantLogo,
        error,
        pickerUser,
        loginAdmin,
        loginPicker,
        logoutAdmin,
        logoutPicker
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
