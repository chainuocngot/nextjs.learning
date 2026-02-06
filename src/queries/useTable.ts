import tableApiRequests from "@/api-requests/table"
import { UpdateTableBodyType } from "@/schemaValidations/table.schema"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

export const useGetTableList = () => {
  return useQuery({
    queryKey: ["tables"],
    queryFn: tableApiRequests.list,
  })
}

export const useGetTable = ({
  number,
  enabled,
}: {
  number: number
  enabled: boolean
}) => {
  return useQuery({
    queryKey: ["tables", number],
    queryFn: () => tableApiRequests.getTable(number),
    enabled,
  })
}

export const useCreateTableMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: tableApiRequests.createTable,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["tables"],
      })
    },
  })
}

export const useUpdateTableMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      number,
      ...body
    }: UpdateTableBodyType & {
      number: number
    }) => tableApiRequests.updateTable(number, body),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["tables"],
      })
    },
  })
}

export const useDeleteTableMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: tableApiRequests.deleteTable,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["tables"],
      })
    },
  })
}
