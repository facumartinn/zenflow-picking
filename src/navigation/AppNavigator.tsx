import React, { useEffect } from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import { useAtom } from 'jotai'
import ProfileScreen from '../screens/ProfileScreen'
import OrderDetailScreen from '../screens/OrderDetailScreen'
import PickingSelectionScreen from '../screens/PickingSelectionScreen'
import PickingScreen from '../screens/PickingScreen'
import PackingScreen from '../screens/PackingScreen'
import PickerLoginScreen from '../screens/PickerLoginScreen'
import { RootStackParamList } from './types'
import {
  defaultHeaderOptions,
  pickingSelectionHeaderOptions,
  pickingHeaderOptions,
  packingHeaderOptions,
  pickerLoginHeaderOptions,
  loginHeaderOptions
} from './headerOptions'
import { isAdminLoggedInAtom } from '../store/authAtoms'
import AsyncStorage from '@react-native-async-storage/async-storage'
import AdminLoginScreen from '../screens/AdminLoginScreen'
import HomeScreen from '../screens/HomeScreen'
import { CompletedOrderDetailScreen } from '../screens/CompletedOrderDetailScreen'

const Stack = createStackNavigator<RootStackParamList>()

const AppNavigator = () => {
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useAtom(isAdminLoggedInAtom)

  useEffect(() => {
    const checkSession = async () => {
      const token = await AsyncStorage.getItem('authToken')
      if (token) {
        setIsAdminLoggedIn(true)
      }
    }

    checkSession()
  }, [setIsAdminLoggedIn])

  return (
    <Stack.Navigator initialRouteName={isAdminLoggedIn ? 'PickerLogin' : 'AdminLogin'} screenOptions={defaultHeaderOptions}>
      {isAdminLoggedIn ? (
        <>
          <Stack.Screen name="PickerLogin" component={PickerLoginScreen} options={pickerLoginHeaderOptions} />
          <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
          <Stack.Screen name="Profile" component={ProfileScreen} options={{ headerShown: false }} />
          <Stack.Screen name="OrderDetail" component={OrderDetailScreen} options={{ headerShown: false }} />
          <Stack.Screen name="CompletedOrderDetail" component={CompletedOrderDetailScreen} options={{ headerShown: false }} />
          <Stack.Screen name="PickingSelection" component={PickingSelectionScreen} options={pickingSelectionHeaderOptions} />
          <Stack.Screen name="Picking" component={PickingScreen} options={pickingHeaderOptions} />
          <Stack.Screen name="Packing" component={PackingScreen} options={packingHeaderOptions} />
        </>
      ) : (
        <>
          <Stack.Screen name="AdminLogin" component={AdminLoginScreen} options={loginHeaderOptions} />
        </>
      )}
    </Stack.Navigator>
  )
}

export default AppNavigator
