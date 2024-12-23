import React, { useEffect } from 'react'
import { Stack } from 'expo-router'
import { useAtom } from 'jotai'
import { isAdminLoggedInAtom } from '../store/authAtoms'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import {
  Inter_100Thin,
  Inter_200ExtraLight,
  Inter_300Light,
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  Inter_800ExtraBold,
  Inter_900Black,
  useFonts
} from '@expo-google-fonts/inter'
import * as SplashScreen from 'expo-splash-screen'
import { ToastProvider } from '../context/toast'

SplashScreen.preventAutoHideAsync()

const queryClient = new QueryClient()

const AppNavigator = () => {
  const [loaded, error] = useFonts({
    Inter_100Thin,
    Inter_200ExtraLight,
    Inter_300Light,
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
    Inter_800ExtraBold,
    Inter_900Black
  })
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useAtom(isAdminLoggedInAtom)

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync()
    }
  }, [loaded, error])

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
      <ToastProvider>
        <QueryClientProvider client={queryClient}>
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
              <Stack.Screen name="multi-picking/index" options={{ headerShown: false }} />
              <Stack.Screen name="picking/index" options={{ headerShown: false }} />
              <Stack.Screen name="picking-completed/index" options={{ headerShown: false }} />
              <Stack.Screen name="packing/index" options={{ headerShown: false }} />
              <Stack.Screen name="packing-orders/index" options={{ headerShown: false }} />
              <Stack.Screen name="packing-order-detail/index" options={{ headerShown: false }} />
              <Stack.Screen name="packing-order-overview/index" options={{ headerShown: false }} />
              <Stack.Screen name="packing-order-completed/index" options={{ headerShown: false }} />
              <Stack.Screen name="packing-delivery/index" options={{ headerShown: false }} />
              <Stack.Screen name="packing-delivery-detail/index" options={{ headerShown: false }} />
              <Stack.Screen name="flow-finished/index" options={{ headerShown: false }} />
            </Stack>
          ) : (
            <Stack
              initialRouteName={isAdminLoggedIn ? 'picker-login/index' : 'admin-login/index'}
              screenOptions={{
                headerShown: false
              }}
            >
              <Stack.Screen name="home/index" options={{ headerShown: false }} />
            </Stack>
          )}
        </QueryClientProvider>
      </ToastProvider>
    </>
  )
}

export default AppNavigator
