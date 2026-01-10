"use client"

import { checkAndRefreshToken } from "@/lib/utils"
import { usePathname } from "next/navigation"
import { useEffect } from "react"

const UNAUTHENTICATED_PATH = ["/login", "/logout", "/refresh-token"]
export default function RefreshToken() {
  const pathname = usePathname()

  useEffect(() => {
    if (UNAUTHENTICATED_PATH.includes(pathname)) return

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let interval: any = null

    checkAndRefreshToken({
      onError: () => {
        clearInterval(interval)
      },
    })

    const TIMEOUT = 1000
    interval = setInterval(checkAndRefreshToken, TIMEOUT)

    return () => {
      clearInterval(interval)
    }
  }, [pathname])

  return <div>RefreshToken</div>
}
