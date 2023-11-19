'use client'

import { CacheProvider } from '@chakra-ui/next-js'
import ReduxProvider from '../lib/store/ReduxProvider'
import ConnectorProvider from './ConnectorProvider'
import AppProvider from './appContext'
import { ChakraProvider } from '@chakra-ui/react'
import { theme } from '@/lib'
import { QueryClient, QueryClientProvider } from 'react-query'

const queryClient = new QueryClient()

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ReduxProvider>
      <QueryClientProvider client={queryClient}>
        <ConnectorProvider>
          <AppProvider>
            {/* STYLE PROVIDERS AND CHILDREN */}
            <CacheProvider>
              <ChakraProvider theme={theme}>{children}</ChakraProvider>
            </CacheProvider>
          </AppProvider>
        </ConnectorProvider>
      </QueryClientProvider>
    </ReduxProvider>
  )
}

export * from './appContext'
