import { ExpoRoot } from 'expo-router'
import React from 'react'
import { Provider as JotaiProvider } from 'jotai'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { requireContext } from '../utils/requireContext'

const queryClient = new QueryClient()

const App = () => {
  return (
    <JotaiProvider>
      <QueryClientProvider client={queryClient}>
        <ExpoRoot context={requireContext} />
      </QueryClientProvider>
    </JotaiProvider>
  )
}

export default App
