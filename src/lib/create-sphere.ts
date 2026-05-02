export default (out: number[], scale = 1.0, randFunc: () => number): number[] => {
  const angle = randFunc() * 2.0 * Math.PI
  const sphere = out
  sphere[0] = Math.cos(angle) * scale
  sphere[1] = Math.sin(angle) * scale
  return sphere
}
