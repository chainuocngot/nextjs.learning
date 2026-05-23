import dishApiRequests from "@/api-requests/dish"
import DishDetail from "@/app/[locale]/(public)/dishes/[slug]/dish-detail"
import { getIdFromSlugUrl, wrapServerApi } from "@/lib/utils"

export default async function DishPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const id = getIdFromSlugUrl(slug)
  const data = id ? await wrapServerApi(dishApiRequests.getDish(id)) : null

  if (!data)
    return (
      <div>
        <h1 className="text-2xl lg:text-3xl font-semibold">
          Món ăn không tồn tại
        </h1>
      </div>
    )

  const dish = data.payload.data

  return <DishDetail dish={dish} />
}
