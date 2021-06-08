// fits the PIXI.Sprite to the parent
// similar to css background-size: cover

export default (ctx, image, parent, scale = 1) => {
  const p = parent || ctx.canvas

  const tAspect = image.width / image.height
  const pWidth = p.width
  const pHeight = p.height

  const pAspect = pWidth / pHeight

  let width
  let height

  if (tAspect > pAspect) {
    height = pHeight
    width = height * tAspect
  } else {
    width = pWidth
    height = width / tAspect
  }

  width *= scale
  height *= scale

  const x = (pWidth - width) / 2
  const y = (pHeight - height) / 2

  ctx.drawImage(image, x, y, width, height)
}
