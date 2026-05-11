"use client"

import { useAppStore } from "@/components/app-provider"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { OrderStatus } from "@/constants/type"
import { formatCurrency, getVietnameseOrderStatus } from "@/lib/utils"
import { useGuestListOrders } from "@/queries/useGuest"
import { PayGuestOrdersResType } from "@/schemaValidations/order.schema"
import Image from "next/image"
import { useEffect } from "react"
import { toast } from "sonner"

export default function OrderCart() {
  const socket = useAppStore((state) => state.socket)
  const { data, refetch } = useGuestListOrders()

  useEffect(() => {
    if (socket?.connected) {
      onConnect()
    }

    function onConnect() {
      console.log("Connected to socket with id:", socket?.id)
    }

    function onDisconnect() {
      console.log("Disconnected from socket")
    }

    function onUpdateOrder() {
      refetch()
      toast("Đơn hàng của bạn đã được cập nhật")
    }

    function onPay(data: PayGuestOrdersResType["data"]) {
      const { guest } = data[0]
      toast(`${guest?.name} tại bàn ${guest?.tableNumber} vừa thanh toán xong!`)
    }

    socket?.on("update-order", onUpdateOrder)
    socket?.on("connect", onConnect)
    socket?.on("disconnect", onDisconnect)
    socket?.on("payment", onPay)

    return () => {
      socket?.off("connect", onConnect)
      socket?.off("disconnect", onDisconnect)
      socket?.off("update-order", onUpdateOrder)
      socket?.off("payment", onPay)
    }
  }, [refetch, socket])

  const orders = data?.payload.data ?? []

  const { waitingForPaying, payed } = orders.reduce(
    (total, order) => {
      if (
        order.status === OrderStatus.Delivered ||
        order.status === OrderStatus.Processing ||
        order.status === OrderStatus.Pending
      ) {
        return {
          ...total,
          waitingForPaying: {
            price:
              total.waitingForPaying.price +
              order.dishSnapshot.price * order.quantity,
            quantity: total.waitingForPaying.quantity + order.quantity,
          },
        }
      }
      return {
        ...total,
        payed: {
          price: total.payed.price + order.dishSnapshot.price * order.quantity,
          quantity: total.payed.quantity + order.quantity,
        },
      }
    },
    {
      waitingForPaying: {
        price: 0,
        quantity: 0,
      },
      payed: {
        price: 0,
        quantity: 0,
      },
    },
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
      {!!payed.price && (
        <div className="w-full flex justify-between">
          <span>Đơn đã thanh toán | {payed.quantity} món</span>
          <span>{formatCurrency(payed.price)}</span>
        </div>
      )}
      <Button className="w-full justify-between" disabled={orders.length === 0}>
        <span>Đơn chưa thanh toán | {waitingForPaying.quantity} món</span>
        <span>{formatCurrency(waitingForPaying.price)}</span>
      </Button>
    </>
  )
}
