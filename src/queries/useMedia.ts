import mediaApiRequests from "@/api-requests/media"
import { useMutation } from "@tanstack/react-query"

export const useUploadMediaMutation = () => {
  return useMutation({
    mutationFn: mediaApiRequests.upload,
  })
}
