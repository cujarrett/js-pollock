export default (out, scale = 1.0, randFunc) => {
  const random = randFunc() * 2.0 * Math.PI
  const sphere = out
  sphere[0] = Math.cos(random) * scale
  sphere[1] = Math.sin(random) * scale
  return sphere
}
