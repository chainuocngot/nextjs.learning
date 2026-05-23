import LoginForm from "@/app/[locale]/(public)/(auth)/login/login-form"
import { Locale } from "next-intl"
import { setRequestLocale } from "next-intl/server"
import { use } from "react"

export default function Login({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = use(params)

  setRequestLocale(locale as Locale)

  return (
    <div className="min-h-screen flex items-center justify-center">
      <LoginForm />
    </div>
  )
}
