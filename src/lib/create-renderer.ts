import clamp from "clamp"
import lerp from "lerp"
import newArray from "new-array"
import { createNoise3D } from "simplex-noise"
import * as vec2 from "gl-vec2"

import createPixels from "./create-pixels"
import createRange from "./create-range"
import createSphere from "./create-sphere"
import { ArtConfig } from "./create-config"

interface RendererOptions extends Partial<ArtConfig> {
  context: CanvasRenderingContext2D
  backgroundImage: HTMLImageElement
}

interface Particle {
  position: number[]
  radius: number
  duration: number
  time: number
  velocity: number[]
  speed: number
  color: string
}

export default (opt: RendererOptions) => {
  const randFunc = opt.random ?? Math.random
  const random = createRange(randFunc)

  const noise3D = createNoise3D()
  const ctx = opt.context
  const dpr = typeof opt.pixelRatio === "number" ? opt.pixelRatio : 1
  const { canvas } = ctx
  const { width, height } = canvas
  const count = opt.count ?? 0
  const palette = opt.palette ?? ["#fff", "#000"]
  const { backgroundImage } = opt

  const maxRadius = typeof opt.maxRadius === "number" ? opt.maxRadius : 10
  const startArea = typeof opt.startArea === "number" ? opt.startArea : 0.5
  const pointilism = lerp(0.000001, 0.5, opt.pointilism ?? 0)
  const noiseScalar = opt.noiseScalar ?? [0.00001, 0.0001]
  const globalAlpha = typeof opt.globalAlpha === "number" ? opt.globalAlpha : 1

  const heightMapImage = createPixels(ctx, backgroundImage, {
    scale: opt.backgroundScale,
    fillStyle: opt.backgroundFill,
  })

  const heightMap = heightMapImage.data
  let time = 0

  const resetParticle = (particle: Partial<Particle> = {}): Particle => {
    const scale = Math.min(width, height) / 2
    const p = particle as Particle

    p.position = createSphere([], random(0, scale * startArea), randFunc)
    p.position[0] += width / 2
    p.position[1] += height / 2
    p.radius = random(0.01, maxRadius)
    p.duration = random(1, 500)
    p.time = random(0, p.duration)
    p.velocity = [random(-1, 1), random(-1, 1)]
    p.speed = random(0.5, 2) * dpr
    p.color = palette[Math.floor(random(palette.length))]

    return p
  }

  const particles: Particle[] = newArray(count).map(() => resetParticle())

  const clear = () => {
    ctx.fillStyle = palette[0]
    ctx.fillRect(0, 0, canvas.width, canvas.height)
  }

  const step = (dt: number) => {
    time += dt

    particles.forEach((particle) => {
      const x = particle.position[0]
      const y = particle.position[1]

      const fx = clamp(Math.round(x), 0, canvas.width - 1)
      const fy = clamp(Math.round(y), 0, canvas.height - 1)

      const heightIndex = fx + fy * canvas.width
      const heightValue = heightMap[heightIndex * 4] / 255

      const pS = lerp(noiseScalar[0], noiseScalar[1], heightValue)
      const noise = noise3D(fx * pS, fy * pS, particle.duration + time)

      const angle = noise * Math.PI * 2
      const speed = particle.speed + lerp(0.0, 2, 1 - heightValue)

      vec2.add(particle.velocity, particle.velocity, [Math.cos(angle), Math.sin(angle)])
      vec2.normalize(particle.velocity, particle.velocity)

      const move = vec2.scale([], particle.velocity, speed)
      vec2.add(particle.position, particle.position, move)

      const s2 = pointilism
      let radius = particle.radius * noise3D(x * s2, y * s2, particle.duration + time)
      radius *= lerp(0.01, 1.0, heightValue)

      ctx.beginPath()
      ctx.lineTo(x, y)
      ctx.lineTo(particle.position[0], particle.position[1])
      ctx.lineWidth = radius * (particle.time / particle.duration)
      ctx.lineCap = (opt.lineStyle ?? "round") as CanvasLineCap
      ctx.lineJoin = opt.lineStyle === "round" ? "round" : "miter"
      ctx.strokeStyle = particle.color
      ctx.globalAlpha = globalAlpha
      ctx.stroke()

      particle.time += dt

      if (particle.time > particle.duration) {
        resetParticle(particle)
      }
    })
  }

  const debugLuma = () => {
    ctx.putImageData(heightMapImage, 0, 0)
  }

  return { clear, step, debugLuma }
}
