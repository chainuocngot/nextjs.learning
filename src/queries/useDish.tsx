import dishApiRequests from "@/api-requests/dish"
import { UpdateDishBodyType } from "@/schemaValidations/dish.schema"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

export const useGetDishList = () => {
  return useQuery({
    queryKey: ["dishes"],
    queryFn: dishApiRequests.list,
  })
}

export const useGetDish = ({ id }: { id: number }) => {
  return useQuery({
    queryKey: ["dishes", id],
    queryFn: () => dishApiRequests.getDish(id),
  })
}

export const useCreateDishMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: dishApiRequests.createDish,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["dishes"],
      })
    },
  })
}

export const useUpdateDishMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      id,
      ...body
    }: UpdateDishBodyType & {
      id: number
    }) => dishApiRequests.updateDish(id, body),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["dishes"],
      })
    },
  })
}

export const useDeleteDishMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: dishApiRequests.deleteDish,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["dishes"],
      })
    },
  })
}
