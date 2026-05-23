import Layout from "@/app/[locale]/(public)/layout"
import { Locale } from "next-intl"

export default function GuestLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  return (
    <Layout modal={null} params={params}>
      {children}
    </Layout>
  )
}
