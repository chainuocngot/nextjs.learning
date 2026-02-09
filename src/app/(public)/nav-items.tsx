"use client"

import { useAppContext } from "@/components/app-provider"
import { Role } from "@/constants/type"
import { cn, handleErrorApi } from "@/lib/utils"
import { useLogoutMutation } from "@/queries/useAuth"
import { RoleType } from "@/types/jwt.types"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

const menuItems: {
  title: string
  href: string
  hideWhenLogin?: boolean
  roles?: RoleType[]
}[] = [
  {
    title: "Trang chủ",
    href: "/",
  },
  {
    title: "Menu",
    href: "/guest/menu",
    roles: [Role.Guest],
  },
  {
    title: "Đơn hàng",
    href: "/guest/order",
    roles: [Role.Guest],
  },
  {
    title: "Đăng nhập",
    href: "/login",
    hideWhenLogin: true,
  },
  {
    title: "Quản lý",
    href: "/manage/dashboard",
    roles: [Role.Owner, Role.Employee],
  },
]

export default function NavItems({ className }: { className?: string }) {
  const { isAuth, role, setRole } = useAppContext()
  const router = useRouter()
  const logoutMutation = useLogoutMutation()

  const logout = async () => {
    if (logoutMutation.isPending) return

    try {
      const result = await logoutMutation.mutateAsync()

      toast.success(result.payload.message)
      setRole(undefined)
      router.push("/login")
    } catch (error) {
      handleErrorApi({
        error,
      })
    }
  }

  return (
    <>
      {menuItems.map((item) => {
        if (isAuth && item.hideWhenLogin) {
          return null
        }

        if (item.roles && (!role || !item.roles.includes(role))) {
          return null
        }

        return (
          <Link href={item.href} key={item.href} className={className}>
            {item.title}
          </Link>
        )
      })}
      {isAuth && (
        <div className={cn(className, "cursor-pointer")} onClick={logout}>
          Đăng xuất
        </div>
      )}
    </>
  )
}
