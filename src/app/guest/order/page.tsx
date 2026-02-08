import OrderCart from "@/app/guest/order/order-cart"

export default function OrderPage() {
  return (
    <div className="max-w-[400px] space-y-4">
      <h1 className="text-center text-xl font-bold">🛒 Đơn hàng</h1>
      <OrderCart />
    </div>
  )
}
