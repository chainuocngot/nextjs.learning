"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { formatCurrency, getVietnameseOrderStatus } from "@/lib/utils"
import { useGuestListOrders } from "@/queries/useGuest"
import Image from "next/image"

export default function OrderCart() {
  const { data } = useGuestListOrders()

  const orders = data?.payload.data ?? []

  const totalPrice = orders.reduce(
    (total, order) => total + order.dishSnapshot.price * order.quantity,
    0,
  )

  return (
    <>
      {orders.map((order) => (
        <div key={order.id} className="flex gap-4">
          <div className="shrink-0">
            <Image
              src={order.dishSnapshot.image}
              alt={order.dishSnapshot.name}
              height={100}
              width={100}
              quality={100}
              className="object-cover w-20 h-20 rounded-md"
            />
          </div>
          <div className="space-y-1">
            <h3 className="text-sm">{order.dishSnapshot.name}</h3>
            <p className="text-xs font-semibold">
              {formatCurrency(order.dishSnapshot.price)} x {order.quantity}
            </p>
          </div>
          <Badge className="ml-auto h-fit">
            {getVietnameseOrderStatus(order.status)}
          </Badge>
        </div>
      ))}
      <Button className="w-full justify-between" disabled={orders.length === 0}>
        <span>Tổng cộng | {orders.length} món</span>
        <span>{formatCurrency(totalPrice)}</span>
      </Button>
    </>
  )
}
