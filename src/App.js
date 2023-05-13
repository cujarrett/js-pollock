import React, { useState, useEffect, useRef } from "react"
import { saveAs } from "file-saver"
import Animated from "react-animated-transitions"
import IconButton from "@material-ui/core/IconButton"
import { GetApp, Shuffle, VisibilityOff } from "@material-ui/icons"
import PropTypes from "prop-types"
import palettes from "./palettes"

import Art from "./lib/"

import defaultMap from "./maps/1.jpg"

import "./app.css"

const numberOfColorOptions = [5, 10, 30, 100]

const App = () => {
  const getInitialPallete = () => {
    const newPalette = []
    const randomNumberOfColorsIndex = Math.floor(Math.random() * numberOfColorOptions.length)
    const maxNumberOfColors = numberOfColorOptions[randomNumberOfColorsIndex]
    const numberOfColors = Math.floor(Math.random(maxNumberOfColors) + maxNumberOfColors)

    for (let index = 0; index < numberOfColors; index++) {
      const colorIndex = Math.floor(Math.random() * Object.keys(palettes).length)
      const color = Object.keys(palettes)[colorIndex]
      const shadeIndex = Math.floor(Math.random() * Object.keys(palettes[color]).length)
      const shade = Object.keys(palettes[color])[shadeIndex]
      const pick = palettes[color][shade]
      newPalette.push(pick)
    }
    return newPalette
  }

  const art = useRef()
  const [map] = useState(defaultMap)
  const [palette, setPalette] = useState(getInitialPallete)
  const uiBackgroundColor = "#000000"
  const [uiColor, setUiColor] = useState(palette[0])
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
    const newPalette = []
    const randomNumberOfColorsIndex = Math.floor(Math.random() * numberOfColorOptions.length)
    const maxNumberOfColors = numberOfColorOptions[randomNumberOfColorsIndex]
    const numberOfColors = Math.floor(Math.random(maxNumberOfColors) + maxNumberOfColors)

    for (let index = 0; index < numberOfColors; index++) {
      const colorIndex = Math.floor(Math.random() * Object.keys(palettes).length)
      const color = Object.keys(palettes)[colorIndex]
      const shadeIndex = Math.floor(Math.random() * Object.keys(palettes[color]).length)
      const shade = Object.keys(palettes[color])[shadeIndex]
      const pick = palettes[color][shade]
      newPalette.push(pick)
    }

    setPalette(newPalette)
    setUiColor(newPalette[0])
  }

  const drawArt = () => {
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
                style={{ color: uiBackgroundColor, backgroundColor: uiColor }}
                onClick={getRandomPalette}
                color="inherit"
                aria-label="Shuffle"
                component="span"
              >
                <Shuffle />
              </IconButton>
              <IconButton
                style={{ color: uiBackgroundColor, backgroundColor: uiColor }}
                onClick={downloadArt}
                color="inherit"
                aria-label="Download Image"
                component="span"
              >
                <GetApp />
              </IconButton>
              <IconButton
                style={{ color: uiBackgroundColor, backgroundColor: uiColor }}
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
            <h4 style={{ color: uiBackgroundColor, backgroundColor: uiColor }}>
              Made by{" "}
              <a style={{ color: uiBackgroundColor, backgroundColor: uiColor }} href="https://cujarrett.dev">
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
