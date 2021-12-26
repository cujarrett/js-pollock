import smoothstep from "smoothstep"
import colorLuminance from "color-luminance"

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

  for (let index = 0; index < canvas.width * canvas.height; index += 1) {
    const red = rgba[index * 4 + 0]
    const green = rgba[index * 4 + 1]
    const blue = rgba[index * 4 + 2]

    // grayscale
    let luminance = colorLuminance(red, green, blue)

    // optional threshold
    if (threshold) {
      luminance = Math.floor(smoothstep(threshold[0], threshold[1], luminance / 255) * 255)
    }

    // replace RGBA
    rgba[index * 4 + 0] = luminance
    rgba[index * 4 + 1] = luminance
    rgba[index * 4 + 2] = luminance
  }

  return imageData
}
