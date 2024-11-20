import { ExpoRoot } from 'expo-router'
import React from 'react'
import { Provider as JotaiProvider } from 'jotai'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { requireContext } from '../utils/requireContext'
import { ToastProvider } from '../context/toast'

const queryClient = new QueryClient()

const App = () => {
  return (
    <JotaiProvider>
      <ToastProvider>
        <QueryClientProvider client={queryClient}>
          <ExpoRoot context={requireContext} />
        </QueryClientProvider>
      </ToastProvider>
    </JotaiProvider>
  )
}

export default App
