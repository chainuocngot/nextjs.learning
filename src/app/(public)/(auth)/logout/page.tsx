"use client"

import { getRefreshTokenFromLocalStorage } from "@/lib/utils"
import { useLogoutMutation } from "@/queries/useAuth"
import { UseMutateAsyncFunction } from "@tanstack/react-query"
import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, useRef } from "react"

export default function LogoutPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const ref = useRef<UseMutateAsyncFunction>(null)
  const { mutateAsync } = useLogoutMutation()

  const refreshTokenFromUrl = searchParams.get("refreshToken")

  useEffect(() => {
    if (
      ref.current ||
      refreshTokenFromUrl !== getRefreshTokenFromLocalStorage()
    ) {
      return
    }

    ref.current = mutateAsync

    mutateAsync().then(() => {
      setTimeout(() => {
        ref.current = null
      }, 1000)

      router.push("/login")
    })
  }, [mutateAsync, refreshTokenFromUrl, router])

  return null
}
