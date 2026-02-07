import http from "@/lib/http"

const revalidateApiRequests = {
  revalidateTag: (tag: string) =>
    http.get(`/api/revalidate?tag=${tag}`, {
      baseUrl: "",
    }),
}

export default revalidateApiRequests
