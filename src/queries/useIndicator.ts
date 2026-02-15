import indicatorApiRequests from "@/api-requests/indicator"
import { DashboardIndicatorQueryParamsType } from "@/schemaValidations/indicator.schema"
import { useQuery } from "@tanstack/react-query"

export const useIndicatorDashboardQuery = (
  queryParams: DashboardIndicatorQueryParamsType,
) => {
  return useQuery({
    queryKey: ["dashboard-indicators", queryParams],
    queryFn: () => indicatorApiRequests.getDashboardIndicators(queryParams),
  })
}
