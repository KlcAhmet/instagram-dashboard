import styleText from "data-text:~assets/global.css"
import type {
  PlasmoCSConfig,
  PlasmoGetOverlayAnchor,
  PlasmoGetStyle
} from "plasmo"
import { type FC } from "react"

import IndexPage from "~pages/index"





export const config: PlasmoCSConfig = {
  matches: ["https://www.instagram.com/*"]
}

export const getStyle: PlasmoGetStyle = () => {
  const style = document.createElement("style")
  style.textContent = styleText
  return style
}

export const getOverlayAnchor: PlasmoGetOverlayAnchor = async () =>
  document.querySelector("body")

export const getShadowHostId = () => "plasmo-anchor"

const PlasmoOverlay: FC = () => {
  return <IndexPage />
}
export default PlasmoOverlay