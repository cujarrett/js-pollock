import clamp from "clamp"
import lerp from "lerp"
import newArray from "new-array"
import { createNoise3D } from "simplex-noise"
import vec2 from "gl-vec2"

import createPixels from "./create-pixels.js"
import createRange from "./create-range.js"
import createSphere from "./create-sphere.js"

export default (opt = {}) => {
  const randFunc = opt.random || Math.random
  const random = createRange(randFunc)

  const noise3D = createNoise3D()
  const ctx = opt.context
  const dpr = typeof opt.pixelRatio === "number" ? opt.pixelRatio : 1
  const { canvas } = ctx
  const { width, height } = canvas
  const count = opt.count || 0
  const palette = opt.palette || ["#fff", "#000"]
  const { backgroundImage } = opt

  const maxRadius = typeof opt.maxRadius === "number" ? opt.maxRadius : 10
  const startArea = typeof opt.startArea === "number" ? opt.startArea : 0.5
  const pointilism = lerp(0.000001, 0.5, opt.pointilism)
  const noiseScalar = opt.noiseScalar || [0.00001, 0.0001]
  const globalAlpha = typeof opt.globalAlpha === "number" ? opt.globalAlpha : 1

  const heightMapImage = createPixels(ctx, backgroundImage, {
    scale: opt.backgroundScale,
    fillStyle: opt.backgroundFill
  })

  const heightMap = heightMapImage.data
  let time = 0

  const resetParticle = (particle = {}) => {
    const scale = Math.min(width, height) / 2

    particle.position = createSphere([], random(0, scale * startArea), randFunc)
    particle.position[0] += width / 2
    particle.position[1] += height / 2
    particle.radius = random(0.01, maxRadius)
    particle.duration = random(1, 500)
    particle.time = random(0, particle.duration)
    particle.velocity = [random(-1, 1), random(-1, 1)]
    particle.speed = random(0.5, 2) * dpr

    // we actually include the background color here
    // this means some strokes may seem to "erase" the other
    // colors, which can add a nice effect
    particle.color = palette[Math.floor(random(palette.length))]

    return particle
  }

  const particles = newArray(count).map(() => resetParticle())

  const clear = () => {
    ctx.fillStyle = palette[0]
    ctx.fillRect(0, 0, canvas.width, canvas.height)
  }

  const step = (dt) => {
    time += dt

    particles.forEach((particle) => {
      // eslint-disable-next-line id-length
      const x = particle.position[0]
      // eslint-disable-next-line id-length
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

      let random = particle.radius * noise3D(x * s2, y * s2, particle.duration + time)
      random *= lerp(0.01, 1.0, heightValue)

      ctx.beginPath()
      ctx.lineTo(x, y)
      ctx.lineTo(particle.position[0], particle.position[1])
      ctx.lineWidth = random * (particle.time / particle.duration)
      ctx.lineCap = opt.lineStyle || "square"
      ctx.lineJoin = opt.lineStyle || "square"
      ctx.strokeStyle = particle.color

      ctx.globalAlpha = globalAlpha
      ctx.stroke()

      particle.time += dt

      if (particle.time > particle.duration) resetParticle(particle)
    })
  }

  return {
    clear,
    step,
    debugLuma: ctx.putImageData(heightMapImage, 0, 0)
  }
}
