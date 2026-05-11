import authApiRequests from "@/api-requests/auth"
import { cookies } from "next/headers"

export async function POST() {
  const cookieStore = await cookies()

  const accessToken = cookieStore.get("accessToken")?.value
  const refreshToken = cookieStore.get("refreshToken")?.value

  cookieStore.delete("accessToken")
  cookieStore.delete("refreshToken")

  if (!accessToken || !refreshToken) {
    return Response.json(
      {
        message: "Không nhận được token",
      },
      {
        status: 200,
      },
    )
  }

  try {
    const result = await authApiRequests.sLogout({
      accessToken,
      refreshToken,
    })

    return Response.json(result.payload)
  } catch {
    return Response.json(
      {
        message: "Lỗi khi gọi API đến server Backend",
      },
      {
        status: 200,
      },
    )
  }
}
