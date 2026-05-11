import { Role } from "@/constants/type"
import { routing } from "@/i18n/routing"
import { decodeToken } from "@/lib/utils"
import { NextRequest } from "next/server"
import createMiddleware from "next-intl/middleware"

const managePaths = ["/vi/manage", "/en/manage"]
const guestPaths = ["/vi/guest", "/en/guest"]
const onlyOwnerPaths = ["/vi/manage/accounts", "/en/manage/accounts"]
const privatePaths = [...managePaths, ...guestPaths]
const unAuthPaths = ["/vi/login", "/en/login"]

const handleI18nRouting = createMiddleware(routing)

// This function can be marked `async` if using `await` inside
export function proxy(request: NextRequest) {
  const response = handleI18nRouting(request)

  const { pathname } = request.nextUrl
  const accessToken = request.cookies.get("accessToken")?.value
  const refreshToken = request.cookies.get("refreshToken")?.value

  // Chưa đăng nhập thì không có vào private paths
  if (privatePaths.some((path) => pathname.startsWith(path)) && !refreshToken) {
    const url = new URL("/login", request.url)
    url.searchParams.set("clearTokens", "true")

    response.headers.set("x-middleware-rewrite", url.toString())
    return response
  }

  if (refreshToken) {
    // Đăng nhập rồi thì sẽ không cho vào login page
    if (unAuthPaths.some((path) => pathname.startsWith(path))) {
      response.headers.set(
        "x-middleware-rewrite",
        new URL("/", request.url).toString(),
      )
      return response
    }

    // Đăng nhập rồi nhưng access token hết hạn thì redirect sang refresh token
    if (
      privatePaths.some((path) => pathname.startsWith(path)) &&
      !accessToken
    ) {
      const url = new URL("/refresh-token", request.url)
      url.searchParams.set("refreshToken", refreshToken)
      url.searchParams.set("redirect", pathname)

      response.headers.set("x-middleware-rewrite", url.toString())
      return response
    }

    // Vào không đúng role thì redirect về trang chủ
    const role = decodeToken(refreshToken).role
    const isTryingToAccessManagePath = managePaths.some((path) =>
      pathname.startsWith(path),
    )
    const isTryingToAccessGuestPath = guestPaths.some((path) =>
      pathname.startsWith(path),
    )
    if (
      role !== Role.Owner &&
      onlyOwnerPaths.some((path) => pathname.startsWith(path))
    ) {
      response.headers.set(
        "x-middleware-rewrite",
        new URL("/", request.url).toString(),
      )
      return response
    }
    if (role === Role.Guest && isTryingToAccessManagePath) {
      response.headers.set(
        "x-middleware-rewrite",
        new URL("/", request.url).toString(),
      )
      return response
    }
    if (role !== Role.Guest && isTryingToAccessGuestPath) {
      response.headers.set(
        "x-middleware-rewrite",
        new URL("/", request.url).toString(),
      )
      return response
    }
  }

  return response
}

// Alternatively, you can use a default export:
// export default function proxy(request: NextRequest) { ... }

// See "Matching Paths" below to learn more
export const config = {
  // Match all pathnames except for
  // - … if they start with `/api`, `/trpc`, `/_next` or `/_vercel`
  // - … the ones containing a dot (e.g. `favicon.ico`)
  matcher: "/((?!api|trpc|_next|_vercel|.*\\..*).*)",
}
