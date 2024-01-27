import styleText from "data-text:~appassets/global.css"
import type { PlasmoCSConfig, PlasmoGetStyle } from "plasmo"

import IndexPage from "~pages/index"

import "~indexedDB"
import "~background"





export const config: PlasmoCSConfig = {
  matches: ["https://www.instagram.com/*"]
}

export const getStyle: PlasmoGetStyle = () => {
  const style = document.createElement("style")
  style.textContent = styleText
  return style
}

const PlasmoInline = () => {
  document.body.remove()
  document.head.remove()
  document.firstElementChild.className = ""

  return <IndexPage />
}

export default PlasmoInline
