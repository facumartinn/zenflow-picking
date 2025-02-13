import React, { useEffect, useState } from 'react'
import { Stack } from 'expo-router'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Inter_400Regular, Inter_500Medium, Inter_700Bold, useFonts } from '@expo-google-fonts/inter'
import * as SplashScreen from 'expo-splash-screen'
import { ToastProvider } from '../context/toast'
import { View, ActivityIndicator } from 'react-native'
import Colors from '../constants/Colors'
import { AuthProvider, useAuth } from '../context/auth'

SplashScreen.preventAutoHideAsync()

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutos
      retry: 2,
      refetchOnWindowFocus: false
    }
  }
})

const NavigationContent = () => {
  const { isAdminAuthenticated, isPickerAuthenticated, isLoading } = useAuth()
  const [isReady, setIsReady] = useState(false)

  const [loaded, error] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_700Bold
  })

  useEffect(() => {
    if (loaded || error) {
      setIsReady(true)
      SplashScreen.hideAsync()
    }
  }, [loaded, error])

  if (!isReady || isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color={Colors.mainBlue} />
      </View>
    )
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: 'none'
      }}
    >
      {!isAdminAuthenticated ? (
        <Stack.Screen name="admin-login/index" />
      ) : isPickerAuthenticated ? (
        <>
          <Stack.Screen name="home/index" />
          <Stack.Screen name="profile/index" />
          <Stack.Screen name="order-detail/index" />
          <Stack.Screen name="completed-order-detail/index" />
          <Stack.Screen name="multi-picking/index" />
          <Stack.Screen name="picking/index" />
          <Stack.Screen name="picking-completed/index" />
          <Stack.Screen name="packing/index" />
          <Stack.Screen name="packing-orders/index" />
          <Stack.Screen name="packing-order-detail/index" />
          <Stack.Screen name="packing-order-overview/index" />
          <Stack.Screen name="packing-order-completed/index" />
          <Stack.Screen name="packing-delivery/index" />
          <Stack.Screen name="packing-delivery-detail/index" />
          <Stack.Screen name="flow-finished/index" />
          <Stack.Screen name="incomplete-order-detail/index" />
        </>
      ) : (
        <Stack.Screen name="picker-login/index" />
      )}
    </Stack>
  )
}

const AppNavigator = () => {
  return (
    <AuthProvider>
      <ToastProvider>
        <QueryClientProvider client={queryClient}>
          <NavigationContent />
        </QueryClientProvider>
      </ToastProvider>
    </AuthProvider>
  )
}

export default AppNavigator
