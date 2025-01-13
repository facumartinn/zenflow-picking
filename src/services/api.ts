import axios from 'axios'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { jwtDecode } from 'jwt-decode'
import { TokenPayload } from '../types/auth'

// Crear una instancia de axios
const api = axios.create({
  // baseURL: 'https://zenflow-api-daq3y.ondigitalocean.app', // Reemplaza con la URL base de tu API
  baseURL: 'http://192.168.68.56:4000', // Reemplaza con la URL base de tu API
  timeout: 100000 // Opcional: establecer un tiempo de espera
})

// Interceptor para agregar headers
api.interceptors.request.use(
  async config => {
    const token = await AsyncStorage.getItem('authToken')

    if (token) {
      config.headers.authorization = token

      // Decodificar el token para obtener tenant_id y warehouse_id
      const decoded: TokenPayload = jwtDecode(token)
      config.headers['x-tenant-id'] = decoded.tenant_id?.toString()
      config.headers['x-warehouse-id'] = decoded.warehouse_id?.toString()
    }
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

// Interceptor para manejar errores de respuesta
api.interceptors.response.use(
  response => response,
  async error => {
    if (error.response && error.response.status === 401) {
      // Manejo del error 401 - no autorizado
      console.error('No autorizado, redirigiendo al login...')

      // Eliminar el token y otros datos de autenticación de AsyncStorage
      await AsyncStorage.removeItem('authToken')
      await AsyncStorage.removeItem('tenantId')
      await AsyncStorage.removeItem('warehouseId')

      // Redirigir al usuario a la pantalla de login
      // Aquí debes usar la navegación de tu aplicación
      // Ejemplo: navigation.navigate('Login');
    }

    return Promise.reject(error)
  }
)

export default api
