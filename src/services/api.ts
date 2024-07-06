import axios from 'axios'
import AsyncStorage from '@react-native-async-storage/async-storage'

// Crear una instancia de axios
const api = axios.create({
  baseURL: 'http://10.0.2.2:4000', // Reemplaza con la URL base de tu API
  timeout: 100000 // Opcional: establecer un tiempo de espera
})

// Interceptor para agregar headers
api.interceptors.request.use(
  async config => {
    const token = await AsyncStorage.getItem('authToken')
    const tenantId = await AsyncStorage.getItem('tenantId')
    const warehouseId = await AsyncStorage.getItem('warehouseId')

    if (token) {
      config.headers.authorization = token
    }
    if (tenantId) {
      config.headers['x-tenant-id'] = tenantId
    }
    if (warehouseId) {
      config.headers['x-warehouse-id'] = warehouseId
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

      // Si estás usando react-navigation, puedes hacer algo como esto:
      // const navigation = useNavigation();
      // navigation.navigate('Login');
    }

    return Promise.reject(error)
  }
)

export default api
