import React, { useState, useEffect, useRef } from "react"
import { saveAs } from "file-saver"
import Animated from "react-animated-transitions"
import IconButton from "@material-ui/core/IconButton"
import { GetApp, Shuffle } from "@material-ui/icons"
import PropTypes from "prop-types"

import Art from "./lib/"

import maps from "./maps"
import palettes from "./palettes"

import "./app.css"

const getRandom = () => ({
  map: maps[Math.floor(Math.random() * maps.length)].default,
  palette: palettes[Math.floor(Math.random() * palettes.length)]
})

const App = () => {
  const art = useRef()
  const [state, setState] = useState({
    custom: false,
    full: true,
    map: getRandom().map,
    more: false,
    mounted: false,
    palette: palettes[Math.floor(Math.random() * palettes.length)],
    stopped: false
  })

  const drawArt = () => {
    if (art.current.metadata().palette) {
      document.body.style.background = art.current.metadata().palette[0]
    }

    art.current.draw()
    setState({
      ...state,
      palette: art.current.metadata().palette,
      stopped: false
    })
  }

  useEffect(() => {
    setState({ ...state, mounted: true })

    drawArt()
  }, [])

  const randomize = () => {
    setState({
      ...state,
      map: maps[Math.floor(Math.random() * maps.length)].default,
      palette: palettes[Math.floor(Math.random() * palettes.length)]
    })
    drawArt()
  }
  /* eslint-disable no-unused-vars */
  const toggleShowUi = () => setState({ ...state, showUi: !state.showUi })

  const stopDrawing = () => {
    art.current.stop()
    setState({ ...state, stopped: true })
  }

  const downloadArt = () => {
    stopDrawing()

    art.current
      .ref()
      .toBlob((blob) => saveAs(blob, `${art.current.metadata().seed}.png`))
  }

  const renderArt = () => {
    return <Art map={state.map} palette={state.palette} ref={art} />
    // return <div> I love Render</div>
  }
  return (
    <Animated>
      <div>
        <div className="art" data-testid="art">
          {renderArt()}
          {/* <RenderArt /> */}
        </div>
        <div className="menu">
          <div className="actions">
            <IconButton
              style={{ color: state.palette[4] }}
              onClick={randomize}
              color="inherit"
              aria-label="Shuffle"
              component="span"
            >
              <Shuffle />
            </IconButton>
            <IconButton
              style={{ color: state.palette[4] }}
              onClick={downloadArt}
              color="inherit"
              aria-label="Download Image"
              component="span"
            >
              <GetApp />
            </IconButton>
          </div>
        </div>
        <div className="footer">
          <h4 style={{ color: state.palette[4] }}>
            Made by{" "}
            <a style={{ color: state.palette[4] }} href="https://cujarrett.dev">
              @cujarrett
            </a>{" "}
            with <i className="fa fa-heart" /> and JavaScript
          </h4>
        </div>
      </div>
    </Animated>
  )
}

App.propTypes = {
  children: PropTypes.element
}

export default App
