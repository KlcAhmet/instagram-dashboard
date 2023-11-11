import type { PlasmoCSConfig, PlasmoGetOverlayAnchor } from "plasmo"
import { type FC } from "react"

import IndexPage from "~pages/index"





export const config: PlasmoCSConfig = {
  matches: ["https://www.instagram.com/*"]
}

export const getOverlayAnchor: PlasmoGetOverlayAnchor = async () =>
  document.querySelector("body")

export const getShadowHostId = () => "inline-anchor"

const PlasmoOverlay: FC = () => {
  return <IndexPage />
}

export default PlasmoOverlay