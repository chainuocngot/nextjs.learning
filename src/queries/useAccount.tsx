import accountApiRequests from "@/api-requests/account"
import { useQuery } from "@tanstack/react-query"

export const useAccountProfile = () => {
  return useQuery({
    queryKey: ["account-profile"],
    queryFn: accountApiRequests.me,
  })
}
