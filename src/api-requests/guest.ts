import http from "@/lib/http"
import {
  LogoutBodyType,
  RefreshTokenBodyType,
  RefreshTokenResType,
} from "@/schemaValidations/auth.schema"
import { MessageResType } from "@/schemaValidations/common.schema"
import {
  GuestGetOrdersResType,
  GuestLoginBodyType,
  GuestLoginResType,
} from "@/schemaValidations/guest.schema"
import {
  CreateOrdersBodyType,
  CreateOrdersResType,
} from "@/schemaValidations/order.schema"

const guestApiRequests = {
  refreshTokenRequest: null as Promise<{
    status: number
    payload: RefreshTokenResType
  }> | null,

  //Login
  sLogin: (body: GuestLoginBodyType) =>
    http.post<GuestLoginResType>("/guest/auth/login", body),
  cLogin: (body: GuestLoginBodyType) =>
    http.post<GuestLoginResType>("/api/guest/auth/login", body, {
      baseUrl: "",
    }),

  //Logout
  sLogout: (
    body: LogoutBodyType & {
      accessToken: string
    },
  ) =>
    http.post<MessageResType>(
      "/guest/auth/logout",
      {
        refreshToken: body.refreshToken,
      },
      {
        headers: {
          Authorization: `Bearer ${body.accessToken}`,
        },
      },
    ),
  cLogout: () =>
    http.post<MessageResType>("/api/guest/auth/logout", null, {
      baseUrl: "",
    }),

  //Refresh token
  async cRefreshToken() {
    if (this.refreshTokenRequest) {
      return this.refreshTokenRequest
    }

    this.refreshTokenRequest = http.post<RefreshTokenResType>(
      "/api/guest/auth/refresh-token",
      null,
      {
        baseUrl: "",
      },
    )

    const result = await this.refreshTokenRequest
    this.refreshTokenRequest = null
    return result
  },
  sRefreshToken: (body: RefreshTokenBodyType) =>
    http.post<RefreshTokenResType>("/guest/auth/refresh-token", body),

  createOrder: (body: CreateOrdersBodyType) =>
    http.post<CreateOrdersResType>("/guest/orders", body),

  getOrderList: () => http.get<GuestGetOrdersResType>("/guest/orders"),
}

export default guestApiRequests
