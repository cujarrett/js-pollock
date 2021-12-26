import React, { useState, useEffect, useRef } from "react"
import { saveAs } from "file-saver"
import Animated from "react-animated-transitions"
import IconButton from "@material-ui/core/IconButton"
import invert from "invert-color"
import { GetApp, Shuffle, VisibilityOff } from "@material-ui/icons"
import PropTypes from "prop-types"

import Art from "./lib/"

import defaultMap from "./maps/1.jpg"
import palettes from "./palettes"

import "./app.css"

const App = () => {
  const getInitialPallete = () => {
    const isUrlColors = window.location.pathname.substring(1) !== ""
    if (isUrlColors) {
      const userDefinedColors = window.location.pathname.substring(1).split("-")
      const userDefinedColorsWithHex = userDefinedColors.map((color) => `#${color}`)
      return userDefinedColorsWithHex
    } else {
      return palettes[Math.floor(Math.random() * palettes.length)]
    }
  }

  const art = useRef()
  const [map] = useState(defaultMap)
  const [palette, setPalette] = useState(getInitialPallete)
  const [uiColor, setUiColor] = useState(invert(palette[0]))
  const [showUi, setShowUi] = useState(true)

  useEffect(() => {
    drawArt()
  }, [palette])

  useEffect(() => {
    const handleClick = () => {
      if (showUi === false) {
        toggleShowUi()
      }
    }

    document.addEventListener("mousedown", handleClick)
    return () => {
      document.removeEventListener("mousedown", handleClick)
    }
  }, [showUi])

  const getRandomPalette = () => {
    const randomPaletteIndex = Math.floor(Math.random() * palettes.length)
    const palette = palettes[randomPaletteIndex]
    setPalette(palette)
    setUiColor(invert(palette[0]))
  }

  const drawArt = () => {
    const paletteWithoutHash = palette.map((color) => color.toUpperCase().replace("#", ""))
    const stringOfPalettes = paletteWithoutHash.join("-")
    window.history.pushState("", "jspollock", `/${stringOfPalettes}`)
    art.current.draw()
  }

  const stopDrawing = () => {
    art.current.stop()
  }

  const downloadArt = () => {
    stopDrawing()
    art.current
      .ref()
      .toBlob((blob) => saveAs(blob, `${art.current.metadata().seed}.png`))
  }

  const toggleShowUi = () => {
    setShowUi(!showUi)
  }

  return (
    <Animated>
      <div>
        <div className="art" data-testid="art">
          <Art map={map} palette={palette} ref={art} />
        </div>
        { showUi &&
          <div className="menu">
            <div className="actions">
              <IconButton
                style={{ color: uiColor, backgroundColor: invert(uiColor) }}
                onClick={getRandomPalette}
                color="inherit"
                aria-label="Shuffle"
                component="span"
              >
                <Shuffle />
              </IconButton>
              <IconButton
                style={{ color: uiColor, backgroundColor: invert(uiColor) }}
                onClick={downloadArt}
                color="inherit"
                aria-label="Download Image"
                component="span"
              >
                <GetApp />
              </IconButton>
              <IconButton
                style={{ color: uiColor, backgroundColor: invert(uiColor) }}
                onClick={toggleShowUi}
                color="inherit"
                aria-label="Hide UI"
                component="span"
              >
                <VisibilityOff />
              </IconButton>
            </div>
          </div>
        }
        { showUi &&
          <div className="footer">
            <h4 style={{ color: uiColor, backgroundColor: invert(uiColor) }}>
              Made by{" "}
              <a style={{ color: uiColor, backgroundColor: invert(uiColor) }} href="https://cujarrett.dev">
                @cujarrett
              </a>{" "}
              with <i className="fa fa-heart" /> and JavaScript
            </h4>
          </div>
        }
      </div>
    </Animated>
  )
}

App.propTypes = {
  children: PropTypes.element
}

export default App
