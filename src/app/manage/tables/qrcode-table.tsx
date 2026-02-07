"use client"

import { getTableLink } from "@/lib/utils"
import QRCode from "qrcode"
import { useRef } from "react"
import { useEffect } from "react"

const QRCodeTable = ({
  token,
  tableNumber,
  width = 250,
}: {
  token: string
  tableNumber: number
  width?: number
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current!
    canvas.width = width
    canvas.height = width + 60
    const canvasContext = canvas.getContext("2d")!
    canvasContext.fillStyle = "white"
    canvasContext.fillRect(0, 0, canvas.width, canvas.height)
    canvasContext.font = "20px Arial"
    canvasContext.textAlign = "center"
    canvasContext.fillStyle = "black"
    canvasContext.fillText(
      `Bàn số ${tableNumber}`,
      canvas.width / 2,
      canvas.height - 40,
    )
    canvasContext.fillText(
      "Quét mã QR để gọi món",
      canvas.width / 2,
      canvas.height - 10,
    )

    const url = getTableLink({
      token,
      tableNumber,
    })
    const virtualCanvas = document.createElement("canvas")
    QRCode.toCanvas(
      virtualCanvas,
      url,
      {
        width,
      },
      (error) => {
        if (error) console.error(error)
        canvasContext.drawImage(virtualCanvas, 0, 0, canvas.width, canvas.width)
      },
    )
  }, [tableNumber, token, width])

  return <canvas ref={canvasRef} />
}

export default QRCodeTable
