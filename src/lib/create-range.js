export default (randFunc) => (min = 1, max) => {
  let mi = min
  let ma = max

  if (ma === undefined) {
    ma = mi
    mi = 0
  }

  return randFunc() * (ma - mi) + mi
}
