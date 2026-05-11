"use client"

import { useAppStore } from "@/components/app-provider"
import {
  getAccessTokenFromLocalStorage,
  getRefreshTokenFromLocalStorage,
} from "@/lib/utils"
import { useLogoutMutation } from "@/queries/useAuth"
import { UseMutateAsyncFunction } from "@tanstack/react-query"
import { useRouter, useSearchParams } from "next/navigation"
import { Suspense, useEffect, useRef } from "react"

function Logout() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const ref = useRef<UseMutateAsyncFunction>(null)
  const { mutateAsync } = useLogoutMutation()
  const setRole = useAppStore((state) => state.setRole)
  const disconnectSocket = useAppStore((state) => state.disconnectSocket)

  const refreshTokenFromUrl = searchParams.get("refreshToken")
  const accessTokenFromUrl = searchParams.get("accessToken")

  useEffect(() => {
    const isAlreadyMutateOrTokensNotMatch =
      ref.current ||
      !refreshTokenFromUrl ||
      !accessTokenFromUrl ||
      (refreshTokenFromUrl &&
        refreshTokenFromUrl !== getRefreshTokenFromLocalStorage()) ||
      (accessTokenFromUrl &&
        accessTokenFromUrl !== getAccessTokenFromLocalStorage())

    if (isAlreadyMutateOrTokensNotMatch) {
      router.push("/")
    } else {
      ref.current = mutateAsync

      mutateAsync().then(() => {
        setTimeout(() => {
          ref.current = null
        }, 1000)

        setRole(undefined)
        disconnectSocket()
        router.push("/login")
      })
    }
  }, [
    accessTokenFromUrl,
    mutateAsync,
    refreshTokenFromUrl,
    router,
    setRole,
    disconnectSocket,
  ])
  return null
}

export default function LogoutPage() {
  return (
    <Suspense>
      <Logout />
    </Suspense>
  )
}
