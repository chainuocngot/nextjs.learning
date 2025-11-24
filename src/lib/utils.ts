/* eslint-disable @typescript-eslint/no-explicit-any */
import { EntityError } from "@/lib/http"
import { clsx, type ClassValue } from "clsx"
import { UseFormSetError } from "react-hook-form"
import { toast } from "sonner"
import { twMerge } from "tailwind-merge"

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

export const getAccessTokenFromLocalStorage = () =>
  getFromLocalStorage("accessToken")

export const getRefreshTokenFromLocalStorage = () =>
  getFromLocalStorage("refreshToken")
