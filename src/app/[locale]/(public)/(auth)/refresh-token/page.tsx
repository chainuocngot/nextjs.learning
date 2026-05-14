"use client"

import { useRouter } from "@/i18n/navigation"
import {
  checkAndRefreshToken,
  getRefreshTokenFromLocalStorage,
} from "@/lib/utils"
import { useSearchParams } from "next/navigation"
import { Suspense, useEffect } from "react"

function RefreshToken() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const refreshTokenFromUrl = searchParams.get("refreshToken")
  const redirectPathname = searchParams.get("redirect")

  useEffect(() => {
    if (
      refreshTokenFromUrl &&
      refreshTokenFromUrl === getRefreshTokenFromLocalStorage()
    ) {
      checkAndRefreshToken({
        onSuccess: () => {
          router.push(redirectPathname || "/")
        },
      })
    } else {
      router.push("/")
    }
  }, [redirectPathname, refreshTokenFromUrl, router])

  return null
}

export default function RefreshTokenPage() {
  return (
    <Suspense>
      <RefreshToken />
    </Suspense>
  )
}
