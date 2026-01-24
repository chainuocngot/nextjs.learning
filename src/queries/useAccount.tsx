import accountApiRequests from "@/api-requests/account"
import { UpdateEmployeeAccountBodyType } from "@/schemaValidations/account.schema"
import { QueryClient, useMutation, useQuery } from "@tanstack/react-query"

export const useAccountMe = () => {
  return useQuery({
    queryKey: ["account-me"],
    queryFn: accountApiRequests.cMe,
  })
}

export const useUpdateMeMutation = () => {
  return useMutation({
    mutationFn: accountApiRequests.updateMe,
  })
}

export const useChangePasswordMutation = () => {
  return useMutation({
    mutationFn: accountApiRequests.changePassword,
  })
}

export const useGetAccountList = () => {
  return useQuery({
    queryKey: ["accounts"],
    queryFn: accountApiRequests.list,
  })
}

export const useGetAccount = ({ id }: { id: number }) => {
  return useQuery({
    queryKey: ["accounts", id],
    queryFn: () => accountApiRequests.getEmployee(id),
  })
}

export const useAddAccountMutation = () => {
  const queryClient = new QueryClient()

  return useMutation({
    mutationFn: accountApiRequests.addEmployee,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["accounts"],
      })
    },
  })
}

export const useUpdateAccountMutation = () => {
  const queryClient = new QueryClient()

  return useMutation({
    mutationFn: ({
      id,
      ...body
    }: UpdateEmployeeAccountBodyType & {
      id: number
    }) => accountApiRequests.updateEmployee(id, body),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["accounts"],
      })
    },
  })
}

export const useDeleteAccountMutation = () => {
  const queryClient = new QueryClient()

  return useMutation({
    mutationFn: accountApiRequests.deleteEmployee,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["accounts"],
      })
    },
  })
}
