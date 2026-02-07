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
  id,
  enabled,
}: {
  id: number
  enabled: boolean
}) => {
  return useQuery({
    queryKey: ["tables", id],
    queryFn: () => tableApiRequests.getTable(id),
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
      id,
      ...body
    }: UpdateTableBodyType & {
      id: number
    }) => tableApiRequests.updateTable(id, body),
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
