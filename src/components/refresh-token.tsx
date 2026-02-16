"use client"

import { useAppContext } from "@/components/app-provider"
import { checkAndRefreshToken } from "@/lib/utils"
import { usePathname, useRouter } from "next/navigation"
import { useEffect } from "react"

const UNAUTHENTICATED_PATH = ["/login", "/logout", "/refresh-token"]

export default function RefreshToken() {
  const { socket, disconnectSocket } = useAppContext()
  const pathname = usePathname()
  const router = useRouter()

  useEffect(() => {
    if (UNAUTHENTICATED_PATH.includes(pathname)) return

    let interval: string | number | NodeJS.Timeout | null | undefined = null

    const onRefreshToken = (force?: boolean) =>
      checkAndRefreshToken({
        onError: () => {
          clearInterval(interval!)
          disconnectSocket()
          router.push("/login")
        },
        force,
      })

    onRefreshToken()
    const TIMEOUT = 1000
    interval = setInterval(onRefreshToken, TIMEOUT)

    if (socket?.connected) {
      onConnect()
    }

    function onConnect() {
      console.log(`Connected to socket ${socket?.id}`)
    }

    function onDisconnect() {
      console.log("Disconnected from socket")
    }

    function onRefreshTokenSocket() {
      onRefreshToken(true)
    }

    socket?.on("connect", onConnect)
    socket?.on("disconnect", onDisconnect)
    socket?.on("refresh-token", onRefreshTokenSocket)

    return () => {
      clearInterval(interval)
      socket?.off("connect", onConnect)
      socket?.off("disconnect", onDisconnect)
      socket?.off("refresh-token", onRefreshTokenSocket)
    }
  }, [pathname, router, socket, disconnectSocket])

  return null
}
