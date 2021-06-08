import smoothstep from "smoothstep"
import luminance from "color-luminance"

import createImage from "./create-image.js"

export default (ctx, img, opt) => {
  const { canvas } = ctx
  const scale = opt.scale || 1

  const threshold = Array.isArray(opt.threshold) ? opt.threshold : null

  ctx.fillStyle = opt.fillStyle || "black"
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  createImage(ctx, img, canvas, scale)

  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
  const rgba = imageData.data

  for (let i = 0; i < canvas.width * canvas.height; i += 1) {
    const r = rgba[i * 4 + 0]
    const g = rgba[i * 4 + 1]
    const b = rgba[i * 4 + 2]

    // grayscale
    let L = luminance(r, g, b)

    // optional threshold
    if (threshold) {
      L = Math.floor(smoothstep(threshold[0], threshold[1], L / 255) * 255)
    }

    // replace RGBA
    rgba[i * 4 + 0] = L
    rgba[i * 4 + 1] = L
    rgba[i * 4 + 2] = L
  }

  return imageData
}
