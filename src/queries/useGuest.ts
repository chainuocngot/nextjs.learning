import guestApiRequests from "@/api-requests/guest"
import { useMutation, useQuery } from "@tanstack/react-query"

export const useGuestLoginMutation = () => {
  return useMutation({
    mutationFn: guestApiRequests.cLogin,
  })
}

export const useGuestLogoutMutation = () => {
  return useMutation({
    mutationFn: guestApiRequests.cLogout,
  })
}

export const useGuestCreateOrderMutation = () => {
  return useMutation({
    mutationFn: guestApiRequests.createOrder,
  })
}

export const useGuestListOrders = () => {
  return useQuery({
    queryKey: ["guest-orders"],
    queryFn: guestApiRequests.getOrderList,
  })
}
