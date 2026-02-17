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
import ListenLogoutSocket from "@/components/listen-logout-socket"
import { create } from "zustand"

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
})

interface AppStoreType {
  isAuth: boolean

  role?: RoleType
  setRole: (role?: RoleType) => void

  socket?: Socket
  setSocket: (socket?: Socket) => void
  disconnectSocket: () => void
}

export const useAppStore = create<AppStoreType>((set) => ({
  isAuth: false,

  role: undefined,
  setRole: (role?: RoleType) => {
    set({ role, isAuth: Boolean(role) })
    if (!role) {
      removeTokensFromLocalStorage()
    }
  },

  socket: undefined,
  setSocket: (socket?: Socket) => set({ socket }),
  disconnectSocket: () =>
    set((state) => {
      state.socket?.disconnect()
      return { socket: undefined }
    }),
}))

export default function AppProvider({ children }: PropsWithChildren) {
  const setRole = useAppStore((state) => state.setRole)
  const setSocket = useAppStore((state) => state.setSocket)
  const count = useRef(0)

  useEffect(() => {
    if (count.current === 0) {
      const accessToken = getAccessTokenFromLocalStorage()

      if (accessToken) {
        const role = decodeToken(accessToken).role
        setRole(role)
        setSocket(generateSocketInstance(accessToken))
      }
      count.current += 1
    }
  }, [setRole, setSocket])

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools />
      <RefreshToken />
      <ListenLogoutSocket />
    </QueryClientProvider>
  )
}
