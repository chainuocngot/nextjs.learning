import { NextResponse } from "next/server"
import { NextRequest } from "next/server"

const privatePaths = ["/manage"]
const unAuthPaths = ["/login"]

// This function can be marked `async` if using `await` inside
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  const accessToken = request.cookies.get("accessToken")?.value
  const refreshToken = request.cookies.get("refreshToken")?.value

  if (privatePaths.some((path) => pathname.startsWith(path)) && !refreshToken) {
    const url = new URL("/login", request.url)
    url.searchParams.set("clearTokens", "true")

    return NextResponse.redirect(url)
  }

  if (unAuthPaths.some((path) => pathname.startsWith(path)) && refreshToken) {
    return NextResponse.redirect(new URL("/", request.url))
  }

  if (
    privatePaths.some((path) => pathname.startsWith(path)) &&
    !accessToken &&
    refreshToken
  ) {
    const url = new URL("/refresh-token", request.url)
    url.searchParams.set("refreshToken", refreshToken)
    url.searchParams.set("redirect", pathname)

    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

// Alternatively, you can use a default export:
// export default function proxy(request: NextRequest) { ... }

// See "Matching Paths" below to learn more
export const config = {
  matcher: ["/manage/:path*", "/login"],
}
