import 'react-native-gesture-handler'
import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { Provider as JotaiProvider } from 'jotai'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { navigationRef } from '../navigation/NavigationService'
import AppNavigator from '../navigation/AppNavigator'

const queryClient = new QueryClient()

const App = () => {
  return (
    <NavigationContainer ref={navigationRef} independent={true}>
      <JotaiProvider>
        <QueryClientProvider client={queryClient}>
          <AppNavigator />
        </QueryClientProvider>
      </JotaiProvider>
    </NavigationContainer>
  )
}

export default App
