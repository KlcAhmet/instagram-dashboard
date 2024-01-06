import styleText from "data-text:~appassets/global.css"
import type { PlasmoCSConfig, PlasmoGetStyle } from "plasmo"
import { type FC } from "react"

import IndexPage from "~pages/index"

import "~background"





export const config: PlasmoCSConfig = {
  matches: ["https://www.instagram.com/*"]
}

export const getStyle: PlasmoGetStyle = () => {
  const style = document.createElement("style")
  style.textContent = styleText
  return style
}
const PlasmoOverlay: FC = () => {
  document.body.remove()
  document.head.remove()
  document.firstElementChild.className = ""

  return <IndexPage />
}
export default PlasmoOverlay
