"use client"

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { useRouter } from "next/navigation"
import { useState } from "react"

export default function Modal({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const [open, setOpen] = useState(true)

  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        setOpen(open)
        if (!open) {
          setTimeout(() => {
            router.back()
          }, 300)
        }
      }}
    >
      <DialogTitle>Chi tiết món ăn</DialogTitle>
      <DialogContent>{children}</DialogContent>
    </Dialog>
  )
}
