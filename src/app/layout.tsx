import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { cn } from "@/lib/utils"
import { ThemeProvider } from "@/components/theme-provider"
import AppProvider from "@/components/app-provider"
import { Toaster } from "sonner"
import { Locale, NextIntlClientProvider } from "next-intl"
import { getLocale } from "next-intl/server"
import { cookies } from "next/headers"
import LocaleSwitcher from "@/components/local-switcher"

const fontSans = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "BigBoy Restaurant",
  description: "BigBoy Restaurant Website",
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const locale = await getLocale()

  return (
    <html lang={locale} suppressHydrationWarning>
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable,
        )}
      >
        <AppProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <NextIntlClientProvider>{children}</NextIntlClientProvider>
            <Toaster />
          </ThemeProvider>
        </AppProvider>
      </body>
    </html>
  )
}
