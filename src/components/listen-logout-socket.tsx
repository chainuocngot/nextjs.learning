import { useAppContext } from "@/components/app-provider"
import { handleErrorApi } from "@/lib/utils"
import { useLogoutMutation } from "@/queries/useAuth"
import { usePathname, useRouter } from "next/navigation"
import { useEffect } from "react"

const UNAUTHENTICATED_PATH = ["/login", "/logout", "/refresh-token"]

export default function ListenLogoutSocket() {
  const router = useRouter()
  const { socket, setRole, disconnectSocket } = useAppContext()
  const pathname = usePathname()
  const { isPending, mutateAsync } = useLogoutMutation()

  useEffect(() => {
    if (UNAUTHENTICATED_PATH.includes(pathname)) return

    const onLogout = async () => {
      if (isPending) return

      try {
        await mutateAsync()

        setRole(undefined)
        disconnectSocket()

        router.push("/login")
      } catch (error) {
        handleErrorApi({
          error,
        })
      }
    }

    socket?.on("logout", onLogout)

    return () => {
      socket?.off("logout", onLogout)
    }
  }, [
    disconnectSocket,
    isPending,
    mutateAsync,
    pathname,
    router,
    setRole,
    socket,
  ])

  return null
}
