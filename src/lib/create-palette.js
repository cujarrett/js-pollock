const arrayShuffle = (arr, random) => {
  let rand
  let tmp

  let len = arr.length
  const ret = arr.slice()

  while (len) {
    rand = Math.floor(random(1) * len)
    len -= 1

    tmp = ret[len]
    ret[len] = ret[rand]
    ret[rand] = tmp
  }

  return ret
}

export default (palettes, random) => {
  const colors = palettes[Math.floor(random() * palettes.length)]
  return arrayShuffle(colors, random)
}
