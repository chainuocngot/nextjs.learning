import orderApiRequests from "@/api-requests/order"
import {
  CreateOrdersBodyType,
  GetOrdersQueryParamsType,
  UpdateOrderBodyType,
} from "@/schemaValidations/order.schema"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

export const useOrderList = (queryParams: GetOrdersQueryParamsType) => {
  return useQuery({
    queryKey: ["orders", queryParams],
    queryFn: () => orderApiRequests.list(queryParams),
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

export const useGetOrderDetail = ({
  orderId,
  enabled,
}: {
  orderId: number
  enabled: boolean
}) => {
  return useQuery({
    queryKey: ["orders", orderId],
    queryFn: () => orderApiRequests.getOrder(orderId),
    enabled,
  })
}

export const useCreateOrderMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (body: CreateOrdersBodyType) =>
      orderApiRequests.createOrder(body),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["orders"],
      })
    },
  })
}
