import seedRandom from "seed-random"
import createRange from "./create-range"

interface CreateConfigOptions {
  seed?: string
  height: number
  width: number
  factor?: number
  maps: string[]
  palettes: string[][]
}

export interface ArtConfig {
  count: number
  endlessBrowser: boolean
  globalAlpha: number
  interval: number
  lineStyle: "round" | "square"
  maxRadius: number
  noiseScalar: [number, number]
  pointilism: number
  random: () => number
  seedName: string
  startArea: number
  steps: number
  backgroundFill: string
  backgroundScale: number
  backgroundSrc: string
  debugLuma: boolean
  height: number
  palette: string[]
  pixelRatio: number
  width: number
}

export default ({
  seed = String(Math.floor(Math.random() * 1000000)),
  height,
  width,
  factor = 0.5,
  maps,
  palettes,
}: CreateConfigOptions): ArtConfig => {
  const randomFunc = seedRandom(seed)
  const random = createRange(randomFunc)

  const mapSrc = maps[Math.floor(random(maps.length))]

  return {
    count: Math.floor(random(50, 2000)),
    endlessBrowser: true,
    globalAlpha: 0.5,
    interval: 0,
    lineStyle: "round",
    maxRadius: random(25, 50),
    noiseScalar: [random(0.000001, 0.000001), random(0.0002, 0.004)],
    pointilism: random(0, 0.1),
    random: randomFunc,
    seedName: seed,
    startArea: random(0.5, 1.5),
    steps: Math.floor(random(100, 1000)),
    backgroundFill: "white",
    backgroundScale: 1,
    backgroundSrc: mapSrc,
    debugLuma: false,
    height: height / factor,
    palette: palettes[0],
    pixelRatio: 1,
    width: width / factor,
  }
}
