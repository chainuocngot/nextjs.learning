import orderApiRequests from "@/api-requests/order"
import { UpdateOrderBodyType } from "@/schemaValidations/order.schema"
import { useMutation, useQuery } from "@tanstack/react-query"

export const useOrderList = () => {
  return useQuery({
    queryKey: ["orders"],
    queryFn: orderApiRequests.list,
  })
}

export const useUpdateOrderMutation = () => {
  return useMutation({
    mutationFn: ({
      orderId,
      ...body
    }: {
      orderId: number
    } & UpdateOrderBodyType) => orderApiRequests.update(orderId, body),
  })
}
