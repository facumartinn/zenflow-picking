import * as SecureStore from 'expo-secure-store'

// Claves para el almacenamiento
const STORAGE_KEYS = {
  ADMIN_SESSION: 'admin_session',
  PICKER_SESSION: 'picker_session',
  TENANT_DATA: 'tenant_data',
  WAREHOUSE_CONFIG: 'warehouse_config'
} as const

// Tipos para los datos almacenados
interface AdminAuth {
  accessToken: string
  tenantId: string
  warehouseId: string
  expiresAt: number
  tenantLogo: string | null
}

interface PickerAuth {
  token: string
  pickerId: string
  lastCode: string
}

interface TenantData {
  logo: string | null
  name: string
}

interface WarehouseConfig {
  custom_attributes: Record<string, unknown>
}

// Función para guardar datos de autenticación del admin
export const saveAdminAuth = async (data: AdminAuth): Promise<void> => {
  try {
    await SecureStore.setItemAsync(STORAGE_KEYS.ADMIN_SESSION, JSON.stringify(data))
  } catch (error) {
    console.error('Error al guardar datos de autenticación:', error)
    throw new Error('No se pudo guardar la información de autenticación')
  }
}

// Función para obtener datos de autenticación del admin
export const getAdminAuth = async (): Promise<AdminAuth | null> => {
  try {
    const data = await SecureStore.getItemAsync(STORAGE_KEYS.ADMIN_SESSION)
    return data ? JSON.parse(data) : null
  } catch (error) {
    console.error('Error al obtener datos de autenticación:', error)
    return null
  }
}

// Función para guardar datos del tenant
export const saveTenantData = async (data: TenantData): Promise<void> => {
  try {
    await SecureStore.setItemAsync(STORAGE_KEYS.TENANT_DATA, JSON.stringify(data))
  } catch (error) {
    console.error('Error al guardar datos del tenant:', error)
    throw new Error('No se pudo guardar la información del tenant')
  }
}

// Función para obtener datos del tenant
export const getTenantData = async (): Promise<TenantData | null> => {
  try {
    const data = await SecureStore.getItemAsync(STORAGE_KEYS.TENANT_DATA)
    return data ? JSON.parse(data) : null
  } catch (error) {
    console.error('Error al obtener datos del tenant:', error)
    return null
  }
}

// Función para guardar datos de autenticación del picker
export const savePickerAuth = async (data: PickerAuth): Promise<void> => {
  try {
    await SecureStore.setItemAsync(STORAGE_KEYS.PICKER_SESSION, JSON.stringify(data))
  } catch (error) {
    console.error('Error al guardar datos de autenticación del picker:', error)
    throw new Error('No se pudo guardar la información de autenticación del picker')
  }
}

// Función para obtener datos de autenticación del picker
export const getPickerAuth = async (): Promise<PickerAuth | null> => {
  try {
    const data = await SecureStore.getItemAsync(STORAGE_KEYS.PICKER_SESSION)
    return data ? JSON.parse(data) : null
  } catch (error) {
    console.error('Error al obtener datos de autenticación del picker:', error)
    return null
  }
}

// Función para guardar configuración del warehouse
export const saveWarehouseConfig = async (config: WarehouseConfig): Promise<void> => {
  try {
    await SecureStore.setItemAsync(STORAGE_KEYS.WAREHOUSE_CONFIG, JSON.stringify(config))
  } catch (error) {
    console.error('Error al guardar configuración del warehouse:', error)
    throw new Error('No se pudo guardar la configuración del warehouse')
  }
}

// Función para obtener configuración del warehouse
export const getWarehouseConfig = async (): Promise<WarehouseConfig | null> => {
  try {
    const data = await SecureStore.getItemAsync(STORAGE_KEYS.WAREHOUSE_CONFIG)
    return data ? JSON.parse(data) : null
  } catch (error) {
    console.error('Error al obtener configuración del warehouse:', error)
    return null
  }
}

// Función para limpiar todos los datos almacenados
export const clearAllSecureData = async (): Promise<void> => {
  try {
    await SecureStore.deleteItemAsync(STORAGE_KEYS.ADMIN_SESSION)
    await SecureStore.deleteItemAsync(STORAGE_KEYS.PICKER_SESSION)
    await SecureStore.deleteItemAsync(STORAGE_KEYS.TENANT_DATA)
    await SecureStore.deleteItemAsync(STORAGE_KEYS.WAREHOUSE_CONFIG)
  } catch (error) {
    console.error('Error al limpiar datos seguros:', error)
    throw new Error('No se pudieron limpiar los datos almacenados')
  }
}

// Función para limpiar solo los datos del picker
export const clearPickerData = async (): Promise<void> => {
  try {
    await SecureStore.deleteItemAsync(STORAGE_KEYS.PICKER_SESSION)
  } catch (error) {
    console.error('Error al limpiar datos del picker:', error)
    throw new Error('No se pudieron limpiar los datos del picker')
  }
}

// Función para verificar si hay una sesión de admin válida
export const hasValidAdminSession = async (): Promise<boolean> => {
  try {
    const auth = await getAdminAuth()
    if (!auth) return false

    // Verificar si el token ha expirado
    return auth.expiresAt > Date.now()
  } catch {
    return false
  }
}
