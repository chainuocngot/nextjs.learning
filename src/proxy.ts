import { NextResponse } from "next/server"
import { NextRequest } from "next/server"

const privatePaths = ["/manage"]
const unAuthPaths = ["/login"]

// This function can be marked `async` if using `await` inside
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  const isAuth = Boolean(request.cookies.get("accessToken")?.value)

  if (privatePaths.some((path) => pathname.startsWith(path)) && !isAuth) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  if (unAuthPaths.some((path) => pathname.startsWith(path)) && isAuth) {
    return NextResponse.redirect(new URL("/", request.url))
  }

  return NextResponse.next()
}

// Alternatively, you can use a default export:
// export default function proxy(request: NextRequest) { ... }

// See "Matching Paths" below to learn more
export const config = {
  matcher: ["/manage/:path*", "/login"],
}
