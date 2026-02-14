"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { socket } from "@/lib/socket"
import { formatCurrency, getVietnameseOrderStatus } from "@/lib/utils"
import { useGuestListOrders } from "@/queries/useGuest"
import Image from "next/image"
import { useEffect } from "react"
import { toast } from "sonner"

export default function OrderCart() {
  const { data, refetch } = useGuestListOrders()

  useEffect(() => {
    if (socket.connected) {
      onConnect()
    }

    function onConnect() {
      console.log("Connected to socket with id:", socket.id)
    }

    function onDisconnect() {
      console.log("Disconnected from socket")
    }

    function onUpdateOrder() {
      refetch()
      toast("Đơn hàng của bạn đã được cập nhật")
    }

    socket.on("update-order", onUpdateOrder)
    socket.on("connect", onConnect)
    socket.on("disconnect", onDisconnect)

    return () => {
      socket.off("connect", onConnect)
      socket.off("disconnect", onDisconnect)
      socket.off("update-order", onUpdateOrder)
    }
  }, [refetch])

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
