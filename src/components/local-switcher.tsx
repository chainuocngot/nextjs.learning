"use client"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Locale, useLocale, useTranslations } from "next-intl"

type Props = {
  changeLocaleAction: (locale: Locale) => Promise<void>
}

export default function LocaleSwitcher({ changeLocaleAction }: Props) {
  const t = useTranslations("SwitchLanguage")
  const locale = useLocale()

  return (
    <Select
      value={locale}
      onValueChange={(value) => changeLocaleAction(value as Locale)}
    >
      <SelectTrigger className="w-[220px]">
        <SelectValue placeholder={t("language")} />
      </SelectTrigger>
      <SelectContent className="z-100">
        {["en", "vi"].map((cur) => (
          <SelectItem key={cur} value={cur}>
            {t(cur)}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
