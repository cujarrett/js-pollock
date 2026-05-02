declare module "clamp" {
  function clamp(value: number, min: number, max: number): number
  export = clamp
}

declare module "lerp" {
  function lerp(a: number, b: number, t: number): number
  export = lerp
}

declare module "new-array" {
  function newArray(n: number): undefined[]
  export = newArray
}

declare module "raf-loop" {
  interface Loop {
    on(event: "tick", cb: (dt: number) => void): this
    start(): this
    stop(): this
  }
  function createLoop(): Loop
  export = createLoop
}

declare module "seed-random" {
  function seedRandom(seed: string): () => number
  export = seedRandom
}

declare module "gl-vec2" {
  export function add(out: number[], a: number[], b: number[]): number[]
  export function normalize(out: number[], a: number[]): number[]
  export function scale(out: number[], a: number[], b: number): number[]
}

declare module "smoothstep" {
  function smoothstep(min: number, max: number, x: number): number
  export = smoothstep
}

declare module "color-luminance" {
  function colorLuminance(r: number, g: number, b: number): number
  export = colorLuminance
}
