export default (
  ctx: CanvasRenderingContext2D,
  image: HTMLImageElement,
  parent?: HTMLCanvasElement | null,
  scale = 1,
): void => {
  const pixi = parent || ctx.canvas

  const tAspect = image.width / image.height
  const pixiWidth = pixi.width
  const pixiHeight = pixi.height
  const pAspect = pixiWidth / pixiHeight

  let width: number
  let height: number

  if (tAspect > pAspect) {
    height = pixiHeight
    width = height * tAspect
  } else {
    width = pixiWidth
    height = width / tAspect
  }

  width *= scale
  height *= scale

  const x = (pixiWidth - width) / 2
  const y = (pixiHeight - height) / 2

  ctx.drawImage(image, x, y, width, height)
}
