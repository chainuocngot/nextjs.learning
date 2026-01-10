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
  cRefreshToken: () =>
    http.post("/api/auth/refresh-token", null, {
      baseUrl: "",
    }),
  sRefreshToken: (body: RefreshTokenBodyType) =>
    http.post<RefreshTokenResType>("/auth/refresh-token", body),
}

export default authApiRequests
