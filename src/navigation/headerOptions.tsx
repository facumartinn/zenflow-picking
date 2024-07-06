import { StackNavigationOptions } from '@react-navigation/stack'

export const defaultHeaderOptions = (): StackNavigationOptions => ({
  headerStyle: {
    // backgroundColor: Colors.grey1, // Color de fondo del encabezado
    // height: 50,
    // shadowColor: 'transparent' // Quitar la sombra del encabezado
  },
  headerTintColor: '#fff', // Color del texto del encabezado
  headerTitleStyle: {
    fontWeight: 'bold' // Estilo del título del encabezado
  }
})

export const loginHeaderOptions = (): StackNavigationOptions => ({
  headerShown: false // Ocultar el encabezado
})

export const adminLoginHeaderOptions = (): StackNavigationOptions => ({
  title: 'Inicio de Sesión',
  ...defaultHeaderOptions()
})

export const pickerLoginHeaderOptions = (): StackNavigationOptions => ({
  headerShown: false // Ocultar el encabezado
})

export const homeHeaderOptions = (): StackNavigationOptions => ({
  title: 'Inicio',
  headerShown: false, // Puedes cambiar esto según sea necesario
  ...defaultHeaderOptions()
})

export const profileHeaderOptions = (): StackNavigationOptions => ({
  title: 'Perfil del Usuario',
  ...defaultHeaderOptions()
})

export const orderDetailHeaderOptions = (): StackNavigationOptions => ({
  title: 'Detalle del Pedido',
  ...defaultHeaderOptions()
})

export const pickingSelectionHeaderOptions = (): StackNavigationOptions => ({
  title: 'Seleccionar Pedidos',
  ...defaultHeaderOptions()
})

export const pickingHeaderOptions = (): StackNavigationOptions => ({
  title: 'Picking',
  ...defaultHeaderOptions()
})

export const packingHeaderOptions = (): StackNavigationOptions => ({
  title: 'Packing',
  ...defaultHeaderOptions()
})
