import React, { createContext, useContext, useState, useEffect } from 'react'
import { saveWarehouseConfig, getWarehouseConfig, getPickerAuth } from '../services/secureStorage'
import { User } from '../types/auth'
import { logoutPicker as logoutPickerService } from '../services/pickerAuth'
import { useAtom } from 'jotai'
import { warehousesAtom } from '../store'
import { WarehouseConfig } from '../types/warehouse'
import { useRouter } from 'expo-router/build/hooks'

interface PickerContextType {
  isLoading: boolean
  isPickerAuthenticated: boolean
  pickerUser: User | null
  error: string | null
  loginPicker: (user: User, config: WarehouseConfig) => Promise<void>
  logoutPicker: () => Promise<void>
  unlockScreen: (code: string) => Promise<boolean>
}

const PickerContext = createContext<PickerContextType | null>(null)

export const usePicker = () => {
  const context = useContext(PickerContext)
  if (!context) {
    throw new Error('usePicker debe ser usado dentro de un PickerProvider')
  }
  return context
}

const defaultWarehouseConfig: WarehouseConfig = {
  automatic_picking: { status: false },
  use_picking_baskets: { status: false, volume: 0 },
  use_shifts: { status: false },
  use_resources: { status: false },
  use_weight: {
    status: false,
    productCodeStart: 0,
    productCodeEnd: 0,
    weightStart: 0,
    weightEnd: 0
  }
}

const parseWarehouseConfig = (config: unknown): WarehouseConfig => {
  if (typeof config === 'string') {
    return JSON.parse(config) as WarehouseConfig
  }
  return config as WarehouseConfig
}

export const PickerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false)
  const [isPickerAuthenticated, setIsPickerAuthenticated] = useState(false)
  const [pickerUser, setPickerUser] = useState<User | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [lastCode, setLastCode] = useState<string | null>(null)
  const [, setWarehouseConfig] = useAtom(warehousesAtom)
  const router = useRouter()

  // Verificar autenticación al montar el componente
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const pickerAuth = await getPickerAuth()
        if (pickerAuth?.token) {
          setLastCode(pickerAuth.lastCode)
          setIsPickerAuthenticated(true)
          // Recuperar la configuración del warehouse
          const config = await getWarehouseConfig()
          if (config?.custom_attributes) {
            const parsedConfig = parseWarehouseConfig(config.custom_attributes)
            setWarehouseConfig(parsedConfig)
          }
        }
        router.replace('/home')
      } catch (error) {
        console.error('Error al verificar autenticación del picker:', error)
      }
    }
    checkAuth()
  }, [])

  const loginPicker = async (user: User, config: WarehouseConfig) => {
    try {
      setIsLoading(true)
      // Guardar la configuración del warehouse
      await saveWarehouseConfig({
        custom_attributes: {
          ...config,
          _raw: JSON.stringify(config)
        }
      })

      // Guardar el código del picker para el desbloqueo
      setLastCode(user.id.toString())

      // Actualizar el estado
      setPickerUser(user)
      setWarehouseConfig(config)
      setIsPickerAuthenticated(true)
      setError(null)
    } catch (error) {
      setError('Error al iniciar sesión del picker')
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const logoutPicker = async () => {
    try {
      setIsLoading(true)
      // Limpiar datos de secure storage
      await logoutPickerService()

      // Limpiar estado
      setIsPickerAuthenticated(false)
      setPickerUser(null)
      setWarehouseConfig(defaultWarehouseConfig)
      setLastCode(null)
      setError(null)

      // Esperar un momento antes de redirigir para asegurar que todo se limpió
      await new Promise(resolve => setTimeout(resolve, 100))
    } catch (error) {
      setError('Error al cerrar sesión del picker')
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const unlockScreen = async (code: string): Promise<boolean> => {
    try {
      setIsLoading(true)

      // Verificar si el código coincide
      if (code !== lastCode) {
        setError('Código incorrecto')
        return false
      }

      // Recuperar la configuración del warehouse
      const config = await getWarehouseConfig()
      if (config?.custom_attributes) {
        const parsedConfig = parseWarehouseConfig(config.custom_attributes)
        setWarehouseConfig(parsedConfig)
      }

      setIsPickerAuthenticated(true)
      setError(null)
      return true
    } catch (error) {
      setError('Error al desbloquear la pantalla')
      return false
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <PickerContext.Provider
      value={{
        isLoading,
        isPickerAuthenticated,
        pickerUser,
        error,
        loginPicker,
        logoutPicker,
        unlockScreen
      }}
    >
      {children}
    </PickerContext.Provider>
  )
}
