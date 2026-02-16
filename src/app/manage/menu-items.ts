import { Role } from "@/constants/type"
import { RoleType } from "@/types/jwt.types"
import {
  Home,
  ShoppingCart,
  Users2,
  Salad,
  Table,
  LucideProps,
} from "lucide-react"
import { ForwardRefExoticComponent, RefAttributes } from "react"

interface MenuItem {
  title: string
  Icon: ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>
  >
  href: string
  roles: RoleType[]
}

const menuItems: MenuItem[] = [
  {
    title: "Dashboard",
    Icon: Home,
    href: "/",
    roles: [Role.Owner, Role.Employee],
  },
  {
    title: "Đơn hàng",
    Icon: ShoppingCart,
    href: "/manage/order",
    roles: [Role.Owner, Role.Employee],
  },
  {
    title: "Bàn ăn",
    Icon: Table,
    href: "/manage/tables",
    roles: [Role.Owner, Role.Employee],
  },
  {
    title: "Món ăn",
    Icon: Salad,
    href: "/manage/dishes",
    roles: [Role.Owner, Role.Employee],
  },
  {
    title: "Nhân viên",
    Icon: Users2,
    href: "/manage/accounts",
    roles: [Role.Owner],
  },
]

export default menuItems
