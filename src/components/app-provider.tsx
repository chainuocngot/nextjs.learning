"use client"

import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"
import RefreshToken from "@/components/refresh-token"
import {
  decodeToken,
  generateSocketInstance,
  getAccessTokenFromLocalStorage,
  removeTokensFromLocalStorage,
} from "@/lib/utils"
import { RoleType } from "@/types/jwt.types"
import { Socket } from "socket.io-client"

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
})

const AppContext = createContext<{
  isAuth: boolean
  role: RoleType | undefined
  setRole: (role: RoleType | undefined) => void
  socket: Socket | undefined
  setSocket: (socket: Socket | undefined) => void
  disconnectSocket: () => void
}>({
  isAuth: false,
  role: undefined,
  setRole: () => {},
  socket: undefined,
  setSocket: () => {},
  disconnectSocket: () => {},
})

export const useAppContext = () => {
  return useContext(AppContext)
}

export default function AppProvider({ children }: PropsWithChildren) {
  const [role, setRoleState] = useState<RoleType | undefined>(undefined)
  const [socket, setSocket] = useState<Socket | undefined>(undefined)
  const count = useRef(0)

  useEffect(() => {
    if (count.current === 0) {
      const accessToken = getAccessTokenFromLocalStorage()

      if (accessToken) {
        const role = decodeToken(accessToken).role
        setRoleState(role)
        setSocket(generateSocketInstance(accessToken))
      }
      count.current += 1
    }
  }, [])

  const setRole = (role: RoleType | undefined) => {
    setRoleState(role)

    if (!role) {
      removeTokensFromLocalStorage()
    }
  }

  const disconnectSocket = () => {
    socket?.disconnect()
    setSocket(undefined)
  }

  const isAuth = Boolean(role)

  return (
    <AppContext
      value={{
        isAuth,
        role,
        setRole,
        socket,
        setSocket,
        disconnectSocket,
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
