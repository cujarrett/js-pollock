import React, { Component } from "react"
import { saveAs } from "file-saver"
import Animated from "react-animated-transitions"
import IconButton from "@material-ui/core/IconButton"
import { GetApp, Shuffle } from "@material-ui/icons"
import PropTypes from "prop-types"

import Art from "./lib"

import maps from "./maps"
import palettes from "./palettes"

import "./app.css"

const getRandom = () => ({
  map: maps[Math.floor(Math.random() * maps.length)].default,
  palette: palettes[Math.floor(Math.random() * palettes.length)]
})

class App extends Component {
  state = {
    custom: false,
    full: true,
    map: getRandom().map,
    more: false,
    mounted: false,
    palette: ["#2E86AB", "#A23B72", "#F18F01", "#C73E1D", "#3B1F2B"],
    stopped: false
  }

  randomize = () => this.setState(getRandom(), () => this.drawArt())

  toggleShowUi = () => this.setState({ showUi: !this.state.showUi })

  drawArt = () => {
    if (this.art.metadata().palette) {
      document.body.style.background = this.art.metadata().palette[0]
    }

    this.art.draw()
    this.setState({ palette: this.art.metadata().palette, stopped: false })
  }

  stopDrawing = () => {
    this.art.stop()
    this.setState({ stopped: true })
  }

  downloadArt = () => {
    this.stopDrawing()

    this.art
      .ref()
      .toBlob((blob) => saveAs(blob, `${this.art.metadata().seed}.png`))
  }

  createRef = (ref) => {
    this.art = ref

    if (!this.state.mounted)
      this.setState({ mounted: true }, () => this.drawArt())
  }

  renderArt = () => {
    return (
      <Art
        map={this.state.map}
        palette={this.state.palette}
        ref={this.createRef}
      />
    )
  }

  render() {
    return (
      <Animated>
        <div>
          <div className="art" data-testid="art">
            {this.renderArt()}
          </div>
          <div className="menu">
            <div className="actions">
              <IconButton
                style={{ color: this.state.palette[4] }}
                onClick={this.randomize} color="inherit"
                aria-label="Shuffle"
                component="span">
                <Shuffle />
              </IconButton>
              <IconButton
                style={{ color: this.state.palette[4] }}
                onClick={this.downloadArt}
                color="inherit"
                aria-label="Download Image"
                component="span">
                <GetApp />
              </IconButton>
            </div>
          </div>
          <div className="footer">
            <h4 style={{ color: this.state.palette[4] }}>
              Made by <a style={{ color: this.state.palette[4] }}
              href="https://cujarrett.dev">@cujarrett</a> with <i className="fa fa-heart"/> and JavaScript
            </h4>
          </div>
        </div>
      </Animated>
    )
  }
}

App.propTypes = {
  children: PropTypes.element
}

export default App
