"use client"

import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from "react"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"
import RefreshToken from "@/components/refresh-token"
import {
  getAccessTokenFromLocalStorage,
  removeTokensFromLocalStorage,
} from "@/lib/utils"

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      refetchOnMount: false,
    },
  },
})

const AppContext = createContext<{
  isAuth: boolean
  setIsAuth: (isAuth: boolean) => void
}>({
  isAuth: false,
  setIsAuth: () => {},
})

export const useAppContext = () => {
  return useContext(AppContext)
}

export default function AppProvider({ children }: PropsWithChildren) {
  const [isAuth, setIsAuthState] = useState(false)

  useEffect(() => {
    const accessToken = getAccessTokenFromLocalStorage()

    if (accessToken) {
      setIsAuthState(true)
    }
  }, [])

  const setIsAuth = (isAuth: boolean) => {
    if (isAuth) {
      setIsAuthState(true)
    } else {
      setIsAuthState(false)
      removeTokensFromLocalStorage()
    }
  }

  return (
    <AppContext
      value={{
        isAuth,
        setIsAuth,
      }}
    >
      <QueryClientProvider client={queryClient}>
        {children}
        <ReactQueryDevtools />
        <RefreshToken />
      </QueryClientProvider>
    </AppContext>
  )
}
