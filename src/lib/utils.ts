/* eslint-disable @typescript-eslint/no-explicit-any */
import { EntityError } from "@/lib/http"
import { clsx, type ClassValue } from "clsx"
import { UseFormSetError } from "react-hook-form"
import { toast } from "sonner"
import { twMerge } from "tailwind-merge"
import jwt from "jsonwebtoken"
import authApiRequests from "@/api-requests/auth"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function normalizePath(path: string) {
  return path.startsWith("/") ? path.slice(1) : path
}

export function handleErrorApi({
  error,
  setError,
  duration,
}: {
  error: any
  setError?: UseFormSetError<any>
  duration?: number
}) {
  if (error instanceof EntityError && setError) {
    for (const errorEntity of error.payload.errors) {
      setError(errorEntity.field, {
        type: "server",
        message: errorEntity.message,
      })
    }
  } else {
    toast.error(error.payload.message, {
      duration,
    })
  }
}

const isBrowser = typeof window !== "undefined"

const getFromLocalStorage = (key: string) =>
  isBrowser ? localStorage.getItem(key) : null

const setToLocalStorage = (key: string, value: string) => {
  if (isBrowser) localStorage.setItem(key, value)
}
const removeFromLocalStorage = (key: string) => {
  if (isBrowser) localStorage.removeItem(key)
}

export const getAccessTokenFromLocalStorage = () =>
  getFromLocalStorage("accessToken")

export const getRefreshTokenFromLocalStorage = () =>
  getFromLocalStorage("refreshToken")

export const setAccessTokenToLocalStorage = (value: string) =>
  setToLocalStorage("accessToken", value)

export const setRefreshTokenToLocalStorage = (value: string) =>
  setToLocalStorage("refreshToken", value)

export const removeAccessTokenFromLocalStorage = () =>
  removeFromLocalStorage("accessToken")

export const removeRefreshTokenFromLocalStorage = () =>
  removeFromLocalStorage("refreshToken")

export const removeTokensFromLocalStorage = () => {
  removeAccessTokenFromLocalStorage()
  removeRefreshTokenFromLocalStorage()
}

export const checkAndRefreshToken = async (params?: {
  onError?: () => void
  onSuccess?: () => void
}) => {
  const accessToken = getAccessTokenFromLocalStorage()
  const refreshToken = getRefreshTokenFromLocalStorage()

  if (!accessToken || !refreshToken) return
  const decodedAccessToken = jwt.decode(accessToken) as {
    exp: number
    iat: number
  }
  const decodedRefreshToken = jwt.decode(refreshToken) as {
    exp: number
    iat: number
  }

  const now = new Date().getTime() / 1000 - 1

  if (decodedRefreshToken.exp <= now) {
    removeAccessTokenFromLocalStorage()
    removeRefreshTokenFromLocalStorage()

    params?.onError?.()
    return
  }

  const accessTokenSecondsRemain = decodedAccessToken.exp - now
  const accessTokenLiveTime = decodedAccessToken.exp - decodedAccessToken.iat
  if (accessTokenSecondsRemain < accessTokenLiveTime / 3) {
    try {
      const res = await authApiRequests.cRefreshToken()

      if (res) {
        setAccessTokenToLocalStorage(res.payload.data.accessToken)
        setRefreshTokenToLocalStorage(res.payload.data.refreshToken)

        params?.onSuccess?.()
      }
    } catch {
      params?.onError?.()
    }
  }
}
