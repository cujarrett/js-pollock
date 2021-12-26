import React, { Component } from "react"

import createLoop from "raf-loop"
import PropTypes from "prop-types"

import createConfig from "./create-config.js"
import createRenderer from "./create-renderer.js"

export default class Art extends Component {
  static propTypes = {
    map: PropTypes.string.isRequired,
    palette: PropTypes.arrayOf(PropTypes.string).isRequired,
    seed: PropTypes.string,
    height: PropTypes.number,
    width: PropTypes.number
  }

  static defaultProps = {
    seed: undefined,
    height: window.innerHeight,
    width: window.innerWidth
  }

  refresh = (config) => {
    if (this.loop) this.loop.stop()

    this.loop = createLoop()

    const context = this.canvas.getContext("2d")
    const background = new window.Image()

    const opts = Object.assign(
      {},
      {
        backgroundImage: background,
        context
      },
      config
    )

    const pixelRatio =
      typeof opts.pixelRatio === "number" ? opts.pixelRatio : 1

    this.canvas.width = opts.width * pixelRatio
    this.canvas.height = opts.height * pixelRatio

    background.onload = () => {
      const renderer = createRenderer(opts)

      if (opts.debugLuma) renderer.debugLuma()
      else {
        renderer.clear()
        this.loop.on("tick", () => {
          renderer.step(opts.interval)
        })

        this.loop.start()
      }
    }

    background.src = config.backgroundSrc
  }

  // resize and reposition canvas to form a letterbox view
  letterbox = (element, parent) => {
    const el = element

    const aspect = el.width / el.height
    const pwidth = parent[0]
    const pheight = parent[1]

    const width = pwidth
    const height = Math.round(width / aspect)
    // eslint-disable-next-line id-length
    const y = Math.floor(pheight - height) / 2

    el.style.top = `${y}px`
    el.style.width = `${width}px`
    el.style.height = `${height}px`
  }

  draw = () => {
    const config = createConfig({
      maps: [this.props.map],
      palettes: [this.props.palette],
      seed: this.props.seed,
      height: this.props.height,
      width: this.props.width
    })

    this.refresh(config)
    this.letterbox(this.canvas, [this.props.width, this.props.height]) // resize
    this.seed = config.seedName
    this.map = config.backgroundSrc
    this.palette = config.palette
  }

  stop = () => this.loop.stop()

  ref = () => this.canvas

  data = () => this.canvas.toDataURL("image/png")

  metadata = () => {
    const { seed, map, palette } = this
    return { seed, map, palette }
  }

  render() {
    return <canvas ref={(ref) => (this.canvas = ref)} />
  }
}
