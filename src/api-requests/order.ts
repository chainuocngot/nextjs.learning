import http from "@/lib/http"
import {
  CreateOrdersBodyType,
  CreateOrdersResType,
  GetOrderDetailResType,
  GetOrdersQueryParamsType,
  GetOrdersResType,
  PayGuestOrdersBodyType,
  PayGuestOrdersResType,
  UpdateOrderBodyType,
  UpdateOrderResType,
} from "@/schemaValidations/order.schema"
import queryString from "query-string"

const prefix = "/orders"
const orderApiRequests = {
  list: (queryParams: GetOrdersQueryParamsType) =>
    http.get<GetOrdersResType>(
      `${prefix}?` +
        queryString.stringify({
          fromDate: queryParams.fromDate?.toISOString(),
          toDate: queryParams.toDate?.toISOString(),
        }),
    ),

  update: (orderId: number, body: UpdateOrderBodyType) =>
    http.put<UpdateOrderResType>(`${prefix}/${orderId}`, body),

  getOrder: (orderId: number) =>
    http.get<GetOrderDetailResType>(`${prefix}/${orderId}`),

  createOrder: (body: CreateOrdersBodyType) =>
    http.post<CreateOrdersResType>(`${prefix}`, body),

  payGuestOrders: (body: PayGuestOrdersBodyType) =>
    http.post<PayGuestOrdersResType>(`${prefix}/pay`, body),
}

export default orderApiRequests
