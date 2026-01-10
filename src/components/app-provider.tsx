"use client"

import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { PropsWithChildren } from "react"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"
import RefreshToken from "@/components/refresh-token"

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      refetchOnMount: false,
    },
  },
})

export default function AppProvider({ children }: PropsWithChildren) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools />
      <RefreshToken />
    </QueryClientProvider>
  )
}
