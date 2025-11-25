import http from "@/lib/http"
import { UploadImageResType } from "@/schemaValidations/media.schema"

const mediaApiRequests = {
  upload: (formData: FormData) =>
    http.post<UploadImageResType>("/media/upload", formData),
}

export default mediaApiRequests
