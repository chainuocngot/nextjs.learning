"use client"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useForm } from "react-hook-form"
import { Form, FormField, FormItem, FormMessage } from "@/components/ui/form"
import { LoginBody, LoginBodyType } from "@/schemaValidations/auth.schema"
import { zodResolver } from "@hookform/resolvers/zod"
import { useLoginMutation } from "@/queries/useAuth"
import { toast } from "sonner"
import { generateSocketInstance, handleErrorApi } from "@/lib/utils"
import { useRouter, useSearchParams } from "next/navigation"
import { useEffect } from "react"
import { useAppStore } from "@/components/app-provider"
import { useTranslations } from "next-intl"

export default function LoginForm() {
  const t = useTranslations("Login")
  const router = useRouter()
  const searchParams = useSearchParams()
  const loginMutation = useLoginMutation()
  const setRole = useAppStore((state) => state.setRole)
  const setSocket = useAppStore((state) => state.setSocket)
  const form = useForm<LoginBodyType>({
    resolver: zodResolver(LoginBody),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  const clearTokens = searchParams.get("clearTokens")

  useEffect(() => {
    if (clearTokens) {
      setRole(undefined)
    }
  }, [clearTokens, setRole])

  const onSubmit = async (data: LoginBodyType) => {
    if (loginMutation.isPending) return

    try {
      const result = await loginMutation.mutateAsync(data)
      toast.success(result.payload.message)
      setRole(result.payload.data.account.role)
      router.push("/manage/dashboard")
      setSocket(generateSocketInstance(result.payload.data.accessToken))
    } catch (error) {
      handleErrorApi({
        error,
        setError: form.setError,
      })
    }
  }

  return (
    <Card className="mx-auto w-full max-w-[424px]">
      <CardHeader>
        <CardTitle className="text-2xl">{t("title")}</CardTitle>
        <CardDescription>{t("description")}</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            className="space-y-2 max-w-[600px] shrink-0 w-full"
            noValidate
            onSubmit={form.handleSubmit(onSubmit, console.warn)}
          >
            <div className="grid gap-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <div className="grid gap-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="m@example.com"
                        required
                        {...field}
                      />
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <div className="grid gap-2">
                      <div className="flex items-center">
                        <Label htmlFor="password">Password</Label>
                      </div>
                      <Input
                        id="password"
                        type="password"
                        required
                        {...field}
                      />
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                className="w-full"
                disabled={loginMutation.isPending}
              >
                Đăng nhập
              </Button>
              <Button variant="outline" className="w-full" type="button">
                Đăng nhập bằng Google
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
