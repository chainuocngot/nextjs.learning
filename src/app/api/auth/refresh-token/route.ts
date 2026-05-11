import authApiRequests from "@/api-requests/auth"
import { cookies } from "next/headers"
import jwt from "jsonwebtoken"
import { HttpError } from "@/lib/http"

export async function POST() {
  const cookieStore = await cookies()
  const refreshToken = cookieStore.get("refreshToken")?.value

  if (!refreshToken) {
    return Response.json(
      {
        message: "Không tìm thấy refresh token",
      },
      {
        status: 401,
      },
    )
  }

  try {
    const { payload } = await authApiRequests.sRefreshToken({
      refreshToken,
    })

    const decodedAccessToken = jwt.decode(payload.data.accessToken) as {
      exp: number
    }
    const decodedRefreshToken = jwt.decode(payload.data.refreshToken) as {
      exp: number
    }

    cookieStore.set("accessToken", payload.data.accessToken, {
      path: "/",
      secure: true,
      httpOnly: true,
      sameSite: "lax",
      expires: decodedAccessToken.exp * 1000,
    })
    cookieStore.set("refreshToken", payload.data.refreshToken, {
      path: "/",
      secure: true,
      httpOnly: true,
      sameSite: "lax",
      expires: decodedRefreshToken.exp * 1000,
    })

    return Response.json(payload)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    if (error instanceof HttpError) {
      return Response.json(error.payload, {
        status: error.status,
      })
    } else {
      return Response.json(
        {
          message: error.message ?? "Đã có lỗi xảy ra",
        },
        {
          status: 401,
        },
      )
    }
  }
}
