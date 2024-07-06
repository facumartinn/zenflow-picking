import { StackNavigationProp } from '@react-navigation/stack'

// Root stack param list
export type RootStackParamList = {
  Auth: undefined
  AdminLogin: undefined
  PickerLogin: undefined
  Home: undefined
  Profile: undefined
  OrderDetail: { orderId: number }
  PickingSelection: undefined
  Picking: undefined
  Packing: undefined
}

// Home tab param list
export type HomeTabParamList = {
  Pendientes: undefined
  Finalizados: undefined
}

// Navigation prop types
export type CompletedOrdersScreenNavigationProp = StackNavigationProp<RootStackParamList, 'OrderDetail'>
export type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'OrderDetail'>
