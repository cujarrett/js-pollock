export default (out, scale = 1.0, randFunc) => {
  const r = randFunc() * 2.0 * Math.PI

  const s = out

  s[0] = Math.cos(r) * scale
  s[1] = Math.sin(r) * scale

  return s
}
