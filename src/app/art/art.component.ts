import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  afterNextRender,
  effect,
  input,
  signal,
  untracked,
  viewChild,
} from "@angular/core"
import createLoop from "raf-loop"
import createConfig from "../../lib/create-config"
import createRenderer from "../../lib/create-renderer"

@Component({
  selector: "app-art",
  template: "<canvas #canvas></canvas>",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArtComponent {
  readonly map = input.required<string>()
  readonly palette = input.required<string[]>()
  readonly seed = input<string | undefined>(undefined)
  readonly height = input<number>(window.innerHeight)
  readonly width = input<number>(window.innerWidth)

  private readonly canvasRef = viewChild.required<ElementRef<HTMLCanvasElement>>("canvas")
  private readonly ready = signal(false)

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private loop: any
  private _seed = ""
  private _map = ""
  private _palette: string[] = []

  constructor() {
    afterNextRender(() => this.ready.set(true))

    effect(() => {
      this.map()
      this.palette()
      this.seed()
      if (this.ready()) {
        untracked(() => this.draw())
      }
    })
  }

  draw(): void {
    const config = createConfig({
      maps: [this.map()],
      palettes: [this.palette()],
      seed: this.seed(),
      height: this.height(),
      width: this.width(),
    })

    this.refresh(config)
    this.letterbox(this.canvasRef().nativeElement, [this.width(), this.height()])

    this._seed = config.seedName
    this._map = config.backgroundSrc
    this._palette = config.palette
  }

  stop(): void {
    if (this.loop) this.loop.stop()
  }

  getMetadata(): { seed: string; map: string; palette: string[] } {
    return { seed: this._seed, map: this._map, palette: this._palette }
  }

  private refresh(config: ReturnType<typeof createConfig>): void {
    if (this.loop) this.loop.stop()

    this.loop = createLoop()

    const canvas = this.canvasRef().nativeElement
    const context = canvas.getContext("2d", {
      willReadFrequently: true,
    }) as CanvasRenderingContext2D
    const background = new Image()

    const pixelRatio = typeof config.pixelRatio === "number" ? config.pixelRatio : 1
    canvas.width = config.width * pixelRatio
    canvas.height = config.height * pixelRatio

    background.onload = () => {
      const renderer = createRenderer({
        ...config,
        context,
        backgroundImage: background,
      })

      if (config.debugLuma) {
        renderer.debugLuma()
      } else {
        renderer.clear()
        this.loop.on("tick", () => {
          renderer.step(config.interval)
        })
        this.loop.start()
      }
    }

    background.src = config.backgroundSrc
  }

  private letterbox(element: HTMLCanvasElement, [pwidth, pheight]: [number, number]): void {
    const aspect = element.width / element.height
    const width = pwidth
    const height = Math.round(width / aspect)
    const y = Math.floor(pheight - height) / 2

    element.style.top = `${y}px`
    element.style.width = `${width}px`
    element.style.height = `${height}px`
  }
}
