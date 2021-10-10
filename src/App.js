import React, { useState, useEffect, useRef } from "react"
import { saveAs } from "file-saver"
import Animated from "react-animated-transitions"
import IconButton from "@material-ui/core/IconButton"
import invert from "invert-color"
import { GetApp, Shuffle, VisibilityOff } from "@material-ui/icons"
import PropTypes from "prop-types"

import Art from "./lib/"

import maps from "./maps"
import palettes from "./palettes"

import "./app.css"

const getRandom = () => {
  const randomPalette = Math.floor(Math.random() * palettes.length)
  const result = {
    map: maps[Math.floor(Math.random() * maps.length)].default,
    palette: palettes[randomPalette]
  }
  return result
}

const App = () => {
  const art = useRef()
  const [map] = useState(getRandom().map)
  const [palette, setPalette] = useState(palettes[Math.floor(Math.random() * palettes.length)])
  const [uiColor, setUiColor] = useState(invert(palette[0]))
  const [showUi, setShowUi] = useState(true)

  useEffect(() => {
    drawArt()
  }, [])

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

  const drawArt = () => {
    const { palette } = getRandom()
    setPalette(palette)
    if (art.current.metadata().palette) {
      setUiColor(invert(art.current.metadata().palette[0]))
      document.body.style.background = art.current.metadata().palette[0]
    }
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

  const renderArt = () => {
    return <Art map={map} palette={palette} ref={art} />
  }

  const toggleShowUi = () => {
    setShowUi(!showUi)
  }

  return (
    <Animated>
      <div>
        <div className="art" data-testid="art">
          {renderArt()}
        </div>
        { showUi &&
          <div className="menu">
            <div className="actions">
              <IconButton
                style={{ color: uiColor }}
                onClick={drawArt}
                color="inherit"
                aria-label="Shuffle"
                component="span"
              >
                <Shuffle />
              </IconButton>
              <IconButton
                style={{ color: uiColor }}
                onClick={downloadArt}
                color="inherit"
                aria-label="Download Image"
                component="span"
              >
                <GetApp />
              </IconButton>
              <IconButton
                style={{ color: uiColor }}
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
            <h4 style={{ color: uiColor }}>
              Made by{" "}
              <a style={{ color: uiColor }} href="https://cujarrett.dev">
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
