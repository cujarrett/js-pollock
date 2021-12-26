// fits the PIXI.Sprite to the parent
// similar to css background-size: cover

export default (ctx, image, parent, scale = 1) => {
  const pixi = parent || ctx.canvas

  const tAspect = image.width / image.height
  const pixiWidth = pixi.width
  const pixiHeight = pixi.height

  const pAspect = pixiWidth / pixiHeight

  let width
  let height

  if (tAspect > pAspect) {
    height = pixiHeight
    width = height * tAspect
  } else {
    width = pixiWidth
    height = width / tAspect
  }

  width *= scale
  height *= scale

  // eslint-disable-next-line id-length
  const x = (pixiWidth - width) / 2
  // eslint-disable-next-line id-length
  const y = (pixiHeight - height) / 2

  ctx.drawImage(image, x, y, width, height)
}
