import accountApiRequests from "@/api-requests/account"
import { cookies } from "next/headers"
import React from "react"

export default async function Dashboard() {
  const cookieStore = await cookies()
  const accessToken = cookieStore.get("accessToken")?.value as string

  let name = ""

  try {
    const result = await accountApiRequests.sMe(accessToken)
    name = result.payload.data.name
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    if (error.digest.startsWith("NEXT_REDIRECT")) {
      throw error
    }
  }

  return <div>Dashboard {name}</div>
}
