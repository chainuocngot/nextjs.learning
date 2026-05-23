"use client"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Locale, useLocale, useTranslations } from "next-intl"
import { useParams, usePathname, useRouter } from "next/navigation"
import { Suspense } from "react"

export default function LocaleSwitcherWrapper() {
  return (
    <Suspense>
      <LocaleSwitcher />
    </Suspense>
  )
}

function LocaleSwitcher() {
  const t = useTranslations("SwitchLanguage")
  const locale = useLocale()
  const pathname = usePathname()
  const params = useParams()
  const router = useRouter()

  return (
    <Select
      value={locale}
      onValueChange={(value) => {
        const locale = params.locale as string
        const newPathname = pathname.replace(`/${locale}`, `/${value}`)
        router.replace(newPathname)
      }}
    >
      <SelectTrigger className="w-[220px]">
        <SelectValue placeholder={t("language")} />
      </SelectTrigger>
      <SelectContent className="z-100">
        {["en", "vi"].map((cur) => (
          <SelectItem key={cur} value={cur}>
            {t(cur as Locale)}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
