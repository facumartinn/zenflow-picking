import React, { useEffect } from 'react'
import { Stack } from 'expo-router'
import { useAtom } from 'jotai'
import { isAdminLoggedInAtom } from '../store/authAtoms'
import AsyncStorage from '@react-native-async-storage/async-storage'

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
    <>
      {isAdminLoggedIn ? (
        <Stack
          initialRouteName={isAdminLoggedIn ? 'picker-login/index' : 'admin-login/index'}
          screenOptions={{
            headerShown: false
          }}
        >
          <Stack.Screen name="home/index" options={{ headerShown: false }} />
          <Stack.Screen name="picker-login/index" options={{ headerShown: false }} />
          <Stack.Screen name="profile/index" options={{ headerShown: false }} />
          <Stack.Screen name="order-detail/index" options={{ headerShown: false }} />
          <Stack.Screen name="completed-order-detail/index" options={{ headerShown: false }} />
          <Stack.Screen name="picking-selection/index" options={{ headerShown: false }} />
          <Stack.Screen name="picking/index" options={{ headerShown: false }} />
          <Stack.Screen name="packing/index" options={{ headerShown: false }} />
        </Stack>
      ) : (
        <Stack
          initialRouteName={isAdminLoggedIn ? 'picker-login/index' : 'admin-login/index'}
          screenOptions={{
            headerShown: false
          }}
        >
          <Stack.Screen name="home" options={{ headerShown: false }} />
        </Stack>
      )}
    </>
  )
}

export default AppNavigator
