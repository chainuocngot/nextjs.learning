/* eslint-disable @typescript-eslint/no-explicit-any */
import { EntityError } from "@/lib/http"
import { clsx, type ClassValue } from "clsx"
import { UseFormSetError } from "react-hook-form"
import { toast } from "sonner"
import { twMerge } from "tailwind-merge"
import jwt from "jsonwebtoken"
import authApiRequests from "@/api-requests/auth"
import { DishStatus, OrderStatus, Role, TableStatus } from "@/constants/type"
import envConfig from "@/config"
import { TokenPayload } from "@/types/jwt.types"
import guestApiRequests from "@/api-requests/guest"
import { BookX, CookingPot, HandCoins, Loader, Truck } from "lucide-react"
import { format } from "date-fns"

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
  force?: boolean
}) => {
  const accessToken = getAccessTokenFromLocalStorage()
  const refreshToken = getRefreshTokenFromLocalStorage()

  if (!accessToken || !refreshToken) return
  const decodedAccessToken = decodeToken(accessToken)
  const decodedRefreshToken = decodeToken(refreshToken)

  const now = new Date().getTime() / 1000 - 1

  if (decodedRefreshToken.exp <= now) {
    removeAccessTokenFromLocalStorage()
    removeRefreshTokenFromLocalStorage()

    params?.onError?.()
    return
  }

  const accessTokenSecondsRemain = decodedAccessToken.exp - now
  const accessTokenLiveTime = decodedAccessToken.exp - decodedAccessToken.iat
  if (accessTokenSecondsRemain < accessTokenLiveTime / 3 || params?.force) {
    try {
      const role = decodedRefreshToken.role
      const res =
        role === Role.Guest
          ? await guestApiRequests.cRefreshToken()
          : await authApiRequests.cRefreshToken()

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

export const formatCurrency = (number: number) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(number)
}

export const getVietnameseDishStatus = (
  status: (typeof DishStatus)[keyof typeof DishStatus],
) => {
  switch (status) {
    case DishStatus.Available:
      return "Có sẵn"
    case DishStatus.Unavailable:
      return "Không có sẵn"
    default:
      return "Ẩn"
  }
}

export const getVietnameseOrderStatus = (
  status: (typeof OrderStatus)[keyof typeof OrderStatus],
) => {
  switch (status) {
    case OrderStatus.Delivered:
      return "Đã phục vụ"
    case OrderStatus.Paid:
      return "Đã thanh toán"
    case OrderStatus.Pending:
      return "Chờ xử lý"
    case OrderStatus.Processing:
      return "Đang nấu"
    default:
      return "Từ chối"
  }
}

export const getVietnameseTableStatus = (
  status: (typeof TableStatus)[keyof typeof TableStatus],
) => {
  switch (status) {
    case TableStatus.Available:
      return "Có sẵn"
    case TableStatus.Reserved:
      return "Đã đặt"
    default:
      return "Ẩn"
  }
}

export const getTableLink = ({
  token,
  tableNumber,
}: {
  token: string
  tableNumber: number
}) => {
  return (
    envConfig.NEXT_PUBLIC_URL + "/tables/" + tableNumber + "?token=" + token
  )
}

export const decodeToken = (token: string) => {
  return jwt.decode(token) as TokenPayload
}

export function removeAccents(str: string) {
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
}

export const simpleMatchText = (fullText: string, matchText: string) => {
  return removeAccents(fullText.toLowerCase()).includes(
    removeAccents(matchText.trim().toLowerCase()),
  )
}

export const formatDateTimeToLocaleString = (date: string | Date) => {
  return format(
    date instanceof Date ? date : new Date(date),
    "HH:mm:ss dd/MM/yyyy",
  )
}

export const formatDateTimeToTimeString = (date: string | Date) => {
  return format(date instanceof Date ? date : new Date(date), "HH:mm:ss")
}

export const OrderStatusIcon = {
  [OrderStatus.Pending]: Loader,
  [OrderStatus.Processing]: CookingPot,
  [OrderStatus.Rejected]: BookX,
  [OrderStatus.Delivered]: Truck,
  [OrderStatus.Paid]: HandCoins,
}
