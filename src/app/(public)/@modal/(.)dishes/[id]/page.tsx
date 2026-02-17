import dishApiRequests from "@/api-requests/dish"
import Modal from "@/app/(public)/@modal/(.)dishes/[id]/modal"
import DishDetail from "@/app/(public)/dishes/[id]/dish-detail"
import { wrapServerApi } from "@/lib/utils"

export default async function DishPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const data = await wrapServerApi(dishApiRequests.getDish(Number(id)))

  if (!data)
    return (
      <div>
        <h1 className="text-2xl lg:text-3xl font-semibold">
          Món ăn không tồn tại
        </h1>
      </div>
    )

  const dish = data.payload.data

  return (
    <Modal>
      <DishDetail dish={dish} />
    </Modal>
  )
}
