import { Role } from "@/constants/type"
import { decodeToken } from "@/lib/utils"
import { NextResponse } from "next/server"
import { NextRequest } from "next/server"

const managePaths = ["/manage"]
const guestPaths = ["/guest"]
const privatePaths = [...managePaths, ...guestPaths]
const unAuthPaths = ["/login"]

// This function can be marked `async` if using `await` inside
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  const accessToken = request.cookies.get("accessToken")?.value
  const refreshToken = request.cookies.get("refreshToken")?.value

  // Chưa đăng nhập thì không có vào private paths
  if (privatePaths.some((path) => pathname.startsWith(path)) && !refreshToken) {
    const url = new URL("/login", request.url)
    url.searchParams.set("clearTokens", "true")

    return NextResponse.redirect(url)
  }

  if (refreshToken) {
    // Đăng nhập rồi thì sẽ không cho vào login page
    if (unAuthPaths.some((path) => pathname.startsWith(path))) {
      return NextResponse.redirect(new URL("/", request.url))
    }

    // Đăng nhập rồi nhưng access token hết hạn thì redirect sang refresh token
    if (
      privatePaths.some((path) => pathname.startsWith(path)) &&
      !accessToken
    ) {
      const url = new URL("/refresh-token", request.url)
      url.searchParams.set("refreshToken", refreshToken)
      url.searchParams.set("redirect", pathname)

      return NextResponse.redirect(url)
    }

    // Vào không đúng role thì redirect về trang chủ
    const role = decodeToken(refreshToken).role
    const isTryingToAccessManagePath = managePaths.some((path) =>
      pathname.startsWith(path),
    )
    const isTryingToAccessGuestPath = guestPaths.some((path) =>
      pathname.startsWith(path),
    )
    if (role === Role.Guest && isTryingToAccessManagePath) {
      return NextResponse.redirect(new URL("/", request.url))
    }
    if (role !== Role.Guest && isTryingToAccessGuestPath) {
      return NextResponse.redirect(new URL("/", request.url))
    }
  }

  return NextResponse.next()
}

// Alternatively, you can use a default export:
// export default function proxy(request: NextRequest) { ... }

// See "Matching Paths" below to learn more
export const config = {
  matcher: ["/manage/:path*", "/login", "/guest/:path*"],
}
