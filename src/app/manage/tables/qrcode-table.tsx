"use client"

import { getTableLink } from "@/lib/utils"
import QRCode from "qrcode"
import { useRef } from "react"
import { useEffect } from "react"

const QRCodeTable = ({
  token,
  tableNumber,
  width,
}: {
  token: string
  tableNumber: number
  width?: number
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (canvasRef.current) {
      const url = getTableLink({
        token,
        tableNumber,
      })

      QRCode.toCanvas(
        canvasRef.current,
        url,
        {
          width: width || 200,
        },
        (error) => {
          if (error) console.error(error)
          console.log("QR code generated!")
        },
      )
    }
  }, [tableNumber, token, width])

  return <canvas ref={canvasRef} />
}

export default QRCodeTable
