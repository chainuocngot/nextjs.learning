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
  decodeToken,
  getAccessTokenFromLocalStorage,
  removeTokensFromLocalStorage,
} from "@/lib/utils"
import { RoleType } from "@/types/jwt.types"

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
  role: RoleType | undefined
  setRole: (role: RoleType | undefined) => void
}>({
  isAuth: false,
  role: undefined,
  setRole: () => {},
})

export const useAppContext = () => {
  return useContext(AppContext)
}

export default function AppProvider({ children }: PropsWithChildren) {
  const [role, setRoleState] = useState<RoleType | undefined>(undefined)

  useEffect(() => {
    const accessToken = getAccessTokenFromLocalStorage()

    if (accessToken) {
      const role = decodeToken(accessToken).role
      setRoleState(role)
    }
  }, [])

  const setRole = (role: RoleType | undefined) => {
    setRoleState(role)

    if (!role) {
      removeTokensFromLocalStorage()
    }
  }

  const isAuth = Boolean(role)

  return (
    <AppContext
      value={{
        isAuth,
        role,
        setRole,
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
