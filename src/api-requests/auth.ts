import http from "@/lib/http"
import {
  LoginBodyType,
  LoginResType,
  LogoutBodyType,
  RefreshTokenBodyType,
  RefreshTokenResType,
} from "@/schemaValidations/auth.schema"
import { MessageResType } from "@/schemaValidations/common.schema"

const authApiRequests = {
  refreshTokenRequest: null as Promise<{
    status: number
    payload: RefreshTokenResType
  }> | null,

  //Login
  sLogin: (body: LoginBodyType) => http.post<LoginResType>("/auth/login", body),
  cLogin: (body: LoginBodyType) =>
    http.post<LoginResType>("/api/auth/login", body, {
      baseUrl: "",
    }),

  //Logout
  sLogout: (
    body: LogoutBodyType & {
      accessToken: string
    },
  ) =>
    http.post<MessageResType>(
      "/auth/logout",
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
    http.post<MessageResType>("/api/auth/logout", null, {
      baseUrl: "",
    }),

  //Refresh token
  async cRefreshToken() {
    if (this.refreshTokenRequest) {
      return this.refreshTokenRequest
    }

    this.refreshTokenRequest = http.post<RefreshTokenResType>(
      "/api/auth/refresh-token",
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
    http.post<RefreshTokenResType>("/auth/refresh-token", body),
}

export default authApiRequests
