"use client"

import Image from "next/image"
import { Button } from "@/components/ui/button"
import { useGetDishList } from "@/queries/useDish"
import { formatCurrency, handleErrorApi } from "@/lib/utils"
import Quantity from "@/app/guest/menu/quantity"
import { useState } from "react"
import { GuestCreateOrdersBodyType } from "@/schemaValidations/guest.schema"
import { useGuestCreateOrderMutation } from "@/queries/useGuest"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { DishStatus } from "@/constants/type"

export default function MenuOrder() {
  const router = useRouter()
  const [orders, setOrders] = useState<GuestCreateOrdersBodyType>([])
  const { data } = useGetDishList()
  const guestCreateOrderMutation = useGuestCreateOrderMutation()

  const dishes = data?.payload.data ?? []

  const totalPrice = orders.reduce((total, order) => {
    const dish = dishes.find((d) => d.id === order.dishId)
    return dish ? total + dish.price * order.quantity : total
  }, 0)

  const handleQuantityChange = (dishId: number, quantity: number) => {
    setOrders((prevOrders) => {
      const existingOrderIndex = prevOrders.findIndex(
        (order) => order.dishId === dishId,
      )

      if (existingOrderIndex !== -1) {
        const updatedOrders = [...prevOrders]
        if (quantity === 0) {
          updatedOrders.splice(existingOrderIndex, 1)
        } else {
          updatedOrders[existingOrderIndex].quantity = quantity
        }
        return updatedOrders
      } else {
        return [...prevOrders, { dishId, quantity }]
      }
    })
  }

  const handleCreateOrder = async () => {
    if (guestCreateOrderMutation.isPending) return

    try {
      const result = await guestCreateOrderMutation.mutateAsync(orders)
      toast.success(result.payload.message)
      router.push("/guest/order")
    } catch (error) {
      handleErrorApi({
        error,
      })
    }
  }

  return (
    <>
      {dishes
        .filter((dish) => dish.status !== DishStatus.Hidden)
        .map((dish) => (
          <div key={dish.id} className="flex gap-4">
            <div className="shrink-0">
              <Image
                src={dish.image}
                alt={dish.name}
                height={100}
                width={100}
                quality={100}
                className="object-cover w-20 h-20 rounded-md"
              />
            </div>
            <div className="space-y-1">
              <h3 className="text-sm">{dish.name}</h3>
              <p className="text-xs">{dish.description}</p>
              <p className="text-xs font-semibold">
                {formatCurrency(dish.price)}
              </p>
              {dish.status === DishStatus.Unavailable && (
                <p className="text-xs font-semibold text-red-500">Hết hàng</p>
              )}
            </div>
            <Quantity
              value={
                orders.find((order) => order.dishId === dish.id)?.quantity ?? 0
              }
              onChange={(quantity) => handleQuantityChange(dish.id, quantity)}
              disabled={dish.status === DishStatus.Unavailable}
            />
          </div>
        ))}
      <div className="sticky bottom-0">
        <Button
          className="w-full justify-between"
          onClick={handleCreateOrder}
          disabled={orders.length === 0}
        >
          <span>Giỏ hàng · {orders.length} món</span>
          <span>{formatCurrency(totalPrice)}</span>
        </Button>
      </div>
    </>
  )
}
