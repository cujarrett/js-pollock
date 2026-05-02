import smoothstep from "smoothstep"
import colorLuminance from "color-luminance"
import createImage from "./create-image"

interface CreatePixelsOptions {
  scale?: number
  threshold?: [number, number] | null
  fillStyle?: string
}

export default (
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  opt: CreatePixelsOptions,
): ImageData => {
  const { canvas } = ctx
  const scale = opt.scale ?? 1
  const threshold = Array.isArray(opt.threshold) ? opt.threshold : null

  // Use an offscreen canvas so the main visible canvas is never polluted with the height-map image.
  const offscreen = document.createElement("canvas")
  offscreen.width = canvas.width
  offscreen.height = canvas.height
  const offCtx = offscreen.getContext("2d") as CanvasRenderingContext2D

  offCtx.fillStyle = opt.fillStyle ?? "black"
  offCtx.fillRect(0, 0, offscreen.width, offscreen.height)

  createImage(offCtx, img, offscreen, scale)

  const imageData = offCtx.getImageData(0, 0, offscreen.width, offscreen.height)
  const rgba = imageData.data

  for (let index = 0; index < canvas.width * canvas.height; index += 1) {
    const red = rgba[index * 4 + 0]
    const green = rgba[index * 4 + 1]
    const blue = rgba[index * 4 + 2]

    let luminance = colorLuminance(red, green, blue)

    if (threshold) {
      luminance = Math.floor(smoothstep(threshold[0], threshold[1], luminance / 255) * 255)
    }

    rgba[index * 4 + 0] = luminance
    rgba[index * 4 + 1] = luminance
    rgba[index * 4 + 2] = luminance
  }

  return imageData
}
